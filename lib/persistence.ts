import { get, put } from '@vercel/blob';
import type { BrandId, PersistentWorkspace } from './types';
import { createPosts, seededMedia, templates } from './data';

export type StoredWorkspace={ state:PersistentWorkspace; revision:string; provider:'supabase'|'blob'; created?:boolean };
const validBrand=(brand: string): brand is BrandId => brand==='bonas'||brand==='lzo';
export {validBrand};
const prefix=(b:BrandId)=>`workspaces/${b}/state.json`;
export function dbConfigured(){return Boolean(process.env.SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY)};
export function storeConfigured(){return Boolean(process.env.BLOB_READ_WRITE_TOKEN)};
export function initialWorkspace(brand:BrandId):PersistentWorkspace{return {posts:createPosts(brand),variants:templates[brand].variants,scripts:templates[brand].scripts,media:seededMedia.filter(x=>x.brand===brand),notes:'',metrics:{messages:0,qualified:0,registrations:0,attendees:0}}}

const supaHeaders={get 'apikey'(){return process.env.SUPABASE_SERVICE_ROLE_KEY||''},get 'Authorization'(){return `Bearer ${process.env.SUPABASE_SERVICE_ROLE_KEY||''}`},'Content-Type':'application/json'};
async function dbRequest(path:string,init:RequestInit={}):Promise<Response>{
 const base=process.env.SUPABASE_URL?.replace(/\/$/,'');
 if (!base) throw new Error('Supabase non configuré');
 const r=await fetch(`${base}/rest/v1/${path}`,{...init,headers:{...supaHeaders,...init.headers},cache:'no-store'});
 if(!r.ok) throw new Error(`Erreur base PostgreSQL (${r.status}): ${(await r.text()).slice(0,250)}`);
 return r;
}
async function blobLoad(b:BrandId):Promise<StoredWorkspace|null>{
 if(!storeConfigured())return null;
 const response=await get(prefix(b),{access:'private'});
 if(!response || response.statusCode!==200 || !response.stream)return null;
 const text=await new Response(response.stream).text();
 const parsed=JSON.parse(text) as {state:PersistentWorkspace};
 const state={...parsed.state,scripts:parsed.state.scripts||templates[b].scripts};
 return {state,revision:response.blob.etag,provider:'blob'};
}
async function blobSave(b:BrandId,state:PersistentWorkspace,revision?:string):Promise<StoredWorkspace>{
 if(!storeConfigured())throw new Error('BLOB_READ_WRITE_TOKEN manquant');
 const blob=await put(prefix(b),JSON.stringify({state}),{access:'private',contentType:'application/json',allowOverwrite:Boolean(revision),...(revision?{ifMatch:revision}:{})});
 const fresh=await blobLoad(b);
 if(!fresh)throw new Error('La sauvegarde n’a pas pu être vérifiée');
 return {...fresh,revision:fresh.revision||blob.etag};
}
async function dbLoad(b:BrandId):Promise<StoredWorkspace|null>{
 const r=await dbRequest(`studio_workspaces?brand=eq.${b}&select=state,version`);
 const rows=await r.json() as {state:PersistentWorkspace;version:number}[];
 if(!rows.length)return null;
 return {state:{...rows[0].state,scripts:rows[0].state.scripts||templates[b].scripts},revision:String(rows[0].version),provider:'supabase'};
}
export async function loadWorkspace(b:BrandId):Promise<StoredWorkspace>{
 if(dbConfigured()){
  const inDb=await dbLoad(b);if(inDb)return inDb;
  // One-time migration: the durable Blob snapshot is imported before using the seed.
  const previous=await blobLoad(b);const state=previous?.state||initialWorkspace(b);
  await dbRequest('studio_workspaces?on_conflict=brand',{method:'POST',headers:{Prefer:'resolution=ignore-duplicates'},body:JSON.stringify({brand:b,state,version:1})});
  const row=await dbLoad(b);if(!row)throw new Error('Initialisation de la base refusée');
  return {...row,created:!previous};
 }
 const previous=await blobLoad(b);if(previous)return previous;
 const state=initialWorkspace(b);
 try {const res=await blobSave(b,state);return {...res,created:true}}
 catch(e){const res=await blobLoad(b);if(res)return res;throw e}
}
export async function saveWorkspace(b:BrandId,state:PersistentWorkspace,revision:string):Promise<StoredWorkspace>{
 if(dbConfigured()){
  const n=Number(revision);
  if(!Number.isSafeInteger(n)||n<1)throw new Error('Révision invalide');
  const r=await dbRequest(`studio_workspaces?brand=eq.${b}&version=eq.${n}&select=version`,{method:'PATCH',headers:{Prefer:'return=representation'},body:JSON.stringify({state,version:n+1,updated_at:new Date().toISOString()})});
  const updated=await r.json() as {version:number}[];
  if(!updated.length)throw new Error('CONFLIT: ce contenu a été modifié ailleurs. Exportez votre brouillon avant de recharger.');
  return {state,revision:String(updated[0].version),provider:'supabase'};
 }
 const current=await blobLoad(b);
 if(!current || current.revision!==revision)throw new Error('CONFLIT: la version sur le serveur a changé. Exportez avant d’actualiser.');
 try{return await blobSave(b,state,revision)}catch(e){throw new Error('Échec de sauvegarde : '+String(e))}
}
