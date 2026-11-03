import {createClient, type SupabaseClient} from '@supabase/supabase-js';
import type {BrandId, PersistentWorkspace, MediaAsset, WorkspaceData} from './types';
export const studioClient:SupabaseClient|null =
  process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
    ? createClient(process.env.NEXT_PUBLIC_SUPABASE_URL,process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
       {auth:{persistSession:true,autoRefreshToken:true,detectSessionInUrl:true}}) : null;
export const STUDIO_BUCKET='studio-media';
export type StoredWorkspace={data:PersistentWorkspace;version:number};
const encodePayload=(data:PersistentWorkspace):PersistentWorkspace=>({
 ...data, media:(data.media||[]).map(m=>m.storagePath?{...m,src:'storage://'+m.storagePath,...(m.posterStoragePath?{posterSrc:'storage://'+m.posterStoragePath}:{})}:m)
});
export const encodeWorkspace=encodePayload;
export async function hydrateWorkspace(data:PersistentWorkspace):Promise<PersistentWorkspace>{
 if(!studioClient)return data;
 const media=await Promise.all((data.media||[]).map(async m=>{
  if(!m.storagePath)return m;
  const storage=studioClient!.storage.from(STUDIO_BUCKET);
  const paths=[m.storagePath,...(m.posterStoragePath?[m.posterStoragePath]:[])];
  const signed=await Promise.all(paths.map(path=>storage.createSignedUrl(path,604800)));
  if(signed[0].error)console.warn('Cannot sign media URL',signed[0].error.message);
  return {...m,src:signed[0].error?'':signed[0].data.signedUrl,
    ...(m.posterStoragePath?{posterSrc:signed[1].error?'':signed[1].data.signedUrl}:{})};
 }));
 return {...data,media};
}
export async function readWorkspace(brand:BrandId,seed:PersistentWorkspace,userId:string):Promise<StoredWorkspace>{
 if(!studioClient)throw Error('Supabase non configuré');
 let {data,error}=await studioClient.from('studio_documents').select('payload,version').eq('brand_id',brand).maybeSingle();
 if(error)throw error;
 if(!data){
  const {error:insertError}=await studioClient.from('studio_documents').upsert(
    {brand_id:brand,payload:encodePayload(seed),version:1,updated_by:userId},
    {onConflict:'brand_id',ignoreDuplicates:true});
  if(insertError)throw insertError;
  const read=await studioClient.from('studio_documents').select('payload,version').eq('brand_id',brand).single();
  if(read.error)throw read.error;
  data=read.data;
 }
 return {data:await hydrateWorkspace(data.payload as PersistentWorkspace),version:data.version as number};
}
export async function saveWorkspace(brand:BrandId,value:PersistentWorkspace,expectedVersion:number,userId:string):Promise<number>{
 if(!studioClient)throw Error('Supabase non configuré');
 const result=await studioClient.from('studio_documents').update({
  payload:encodePayload(value),version:expectedVersion+1,updated_at:new Date().toISOString(),updated_by:userId
 }).eq('brand_id',brand).eq('version',expectedVersion).select('version').maybeSingle();
 if(result.error)throw result.error;
 if(!result.data)throw new Error('CONFLICT: ce contenu a été modifié ailleurs. Recharge la page pour récupérer la version récente.');
 return result.data.version as number;
}
/** Best-effort still frame for video previews; browser-only, no remote transcoding. */
async function makeVideoPoster(file:File):Promise<File|null>{
 if(typeof document==='undefined')return null;
 return new Promise(resolve=>{
  const video=document.createElement('video');
  const blobUrl=URL.createObjectURL(file);
  let done=false;
  let timeout:ReturnType<typeof setTimeout>;
  const finish=(result:File|null)=>{
   if(done)return;
   done=true;clearTimeout(timeout);
   video.pause();video.removeAttribute('src');video.load();URL.revokeObjectURL(blobUrl);
   resolve(result);
  };
  const capture=()=>{
   try{
    const ratio=Math.min(1,640/Math.max(1,video.videoWidth));
    const canvas=document.createElement('canvas');
    canvas.width=Math.max(1,Math.round(video.videoWidth*ratio));
    canvas.height=Math.max(1,Math.round(video.videoHeight*ratio));
    const ctx=canvas.getContext('2d');
    if(!ctx)throw new Error('canvas indisponible');
    ctx.drawImage(video,0,0,canvas.width,canvas.height);
    canvas.toBlob(blob=>finish(blob?new File([blob],'poster.jpg',{type:'image/jpeg'}):null),'image/jpeg',.79);
   }catch{finish(null)}
  };
  timeout=setTimeout(()=>finish(null),9000);
  video.muted=true;video.preload='auto';video.playsInline=true;
  video.onerror=()=>finish(null);
  video.onloadeddata=()=>{
   if(video.duration&&Number.isFinite(video.duration)&&video.duration>.5){
    video.onseeked=capture;
    try{video.currentTime=Math.min(.7,video.duration/4)}catch{capture()}
   }else capture();
  };
  video.src=blobUrl;video.load();
 });
}
export async function uploadStudioMedia(file:File,brand:BrandId):Promise<MediaAsset>{
 if(!studioClient)throw Error('Supabase non configuré');
 const maxBytes=25*1024*1024;
 if(file.size>maxBytes)throw Error('Ce stockage privé accepte 25 Mo par fichier actuellement. Pour les grandes vidéos, compressez le clip; le stockage externe sera raccordé séparément.');
 const accepted=['image/jpeg','image/png','image/webp','image/gif','video/mp4','video/webm','application/pdf'];
 if(!accepted.includes(file.type))throw Error('Format non pris en charge : images JPEG, PNG, WebP, GIF, MP4, WebM et PDF.');
 const ext=(file.name.split('.').at(-1)||'bin').replace(/[^a-z0-9]/gi,'').toLowerCase();
 const id=crypto.randomUUID();
 const path=brand+'/'+id+'.'+ext;
 const bucket=studioClient.storage.from(STUDIO_BUCKET);
 const {error}=await bucket.upload(path,file,{contentType:file.type,upsert:false,cacheControl:'3600'});
 if(error)throw error;
 const signed=await bucket.createSignedUrl(path,604800);
 if(signed.error)throw signed.error;
 let posterSrc: string|undefined;
 let posterStoragePath: string|undefined;
 if(file.type.startsWith('video/')){
  const poster=await makeVideoPoster(file);
  if(poster){
   const posterPath=brand+'/posters/'+id+'.jpg';
   const attempt=await bucket.upload(posterPath,poster,{contentType:'image/jpeg',upsert:false});
   if(!attempt.error){
    const signedPoster=await bucket.createSignedUrl(posterPath,604800);
    if(!signedPoster.error){posterSrc=signedPoster.data.signedUrl;posterStoragePath=posterPath}
   }
  }
 }
 return {id:'media-'+id,brand,name:file.name,
 kind:file.type.startsWith('image/')?'Image':file.type.startsWith('video/')?'Vidéo':'Document',
 src:signed.data.signedUrl,storagePath:path,posterSrc,posterStoragePath,provider:'supabase',origin:'upload',
 format:file.type,created:new Date().toISOString().slice(0,10),size:(file.size/1024/1024).toFixed(2)+' Mo'};
}

/** Editorial resources are private and fetched only after brand authorization. */
export async function readStudioLibrary(brand:BrandId):Promise<WorkspaceData>{
 if(!studioClient)throw new Error('Supabase non configuré');
 const {data,error}=await studioClient.from('studio_libraries').select('payload').eq('brand_id',brand).single();
 if(error)throw error;
 return data.payload as WorkspaceData;
}
