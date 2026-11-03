import {createClient, type SupabaseClient} from '@supabase/supabase-js';
import type {BrandId, PersistentWorkspace, MediaAsset} from './types';
export const studioClient:SupabaseClient|null =
  process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
    ? createClient(process.env.NEXT_PUBLIC_SUPABASE_URL,process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
       {auth:{persistSession:true,autoRefreshToken:true,detectSessionInUrl:true}}) : null;
export const STUDIO_BUCKET='studio-media';
export type StoredWorkspace={data:PersistentWorkspace;version:number};
const encodePayload=(data:PersistentWorkspace):PersistentWorkspace=>({
 ...data, media:data.media.map(m=>m.storagePath?{...m,src:'storage://'+m.storagePath}:m)
});
export const encodeWorkspace=encodePayload;
export async function hydrateWorkspace(data:PersistentWorkspace):Promise<PersistentWorkspace>{
 if(!studioClient)return data;
 const media=await Promise.all(data.media.map(async(m)=>{
  if(!m.storagePath)return m;
  const {data:response,error}=await studioClient!.storage.from(STUDIO_BUCKET).createSignedUrl(m.storagePath,604800);
  if(error){console.warn('Cannot sign media URL',error.message);return {...m,src:''}}
  return {...m,src:response.signedUrl};
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
export async function uploadStudioMedia(file:File,brand:BrandId):Promise<MediaAsset>{
 if(!studioClient)throw Error('Supabase non configuré');
 if(file.size>25*1024*1024)throw Error('Taille maximale : 25 Mo');
 const accepted=['image/jpeg','image/png','image/webp','image/gif','video/mp4','video/webm','application/pdf'];
 if(!accepted.includes(file.type))throw Error('Format non pris en charge');
 const ext=(file.name.split('.').at(-1)||'bin').replace(/[^a-z0-9]/gi,'').toLowerCase();
 const path=brand+'/'+crypto.randomUUID()+'.'+ext;
 const {error}=await studioClient.storage.from(STUDIO_BUCKET).upload(path,file,{contentType:file.type,upsert:false,cacheControl:'3600'});
 if(error)throw error;
 const signed=await studioClient.storage.from(STUDIO_BUCKET).createSignedUrl(path,604800);
 if(signed.error)throw signed.error;
 return {id:'media-'+crypto.randomUUID(),brand,name:file.name,kind:file.type.startsWith('image/')?'Image':file.type.startsWith('video/')?'Vidéo':'Document',
 src:signed.data.signedUrl,storagePath:path,format:file.type,created:new Date().toISOString().slice(0,10),size:(file.size/1024/1024).toFixed(2)+' Mo'};
}
