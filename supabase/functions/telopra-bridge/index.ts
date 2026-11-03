import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import {createClient} from "npm:@supabase/supabase-js@2.57.0";

const SITE="https://zenithis-content-studio-mu.vercel.app";
const CORS={
 "Access-Control-Allow-Origin":SITE,
 "Access-Control-Allow-Headers":"authorization, apikey, content-type, x-client-info",
 "Access-Control-Allow-Methods":"POST, OPTIONS",
 "Content-Type":"application/json",
 "Vary":"Origin"
};
const response=(code:number,result:Record<string,unknown>)=>
 new Response(JSON.stringify(result),{status:code,headers:CORS});
type Json=Record<string,unknown>;
const object=(v:unknown):Json=>(v!==null&&typeof v==="object"&&!Array.isArray(v))?v as Json:{};
const array=(v:unknown):unknown[]=>Array.isArray(v)?v:[];
const str=(v:unknown):string=>typeof v==="string"?v:"";
const num=(v:unknown):number=>typeof v==="number"&&Number.isFinite(v)?v:0;
const now=()=>new Date().toISOString();
function timestamp(value:unknown):string|null{
 if(value===null||value===undefined)return null;
 const n=Number(value);
 const d=Number.isFinite(n)&&n>0?new Date(n<1e11?n*1000:n):new Date(str(value));
 return Number.isFinite(d.getTime())?d.toISOString():null;
}
function textMessage(data:Json):string{
 const message=object(data.message);
 const ext=object(message.extendedTextMessage);
 const image=object(message.imageMessage);
 const video=object(message.videoMessage);
 const ephemeral=object(object(message.ephemeralMessage).message);
 const payload=str(message.conversation)||str(ext.text)||str(image.caption)||str(video.caption)||
     str(ephemeral.conversation)||str(object(ephemeral.extendedTextMessage).text);
 return payload.slice(0,4000);
}
function remoteId(chat:Json):string{
 return str(chat.remoteJid)||str(chat.id)||str(object(chat.key).remoteJid);
}
function originAllowed(base:string):boolean{
 try{
  const u=new URL(base);
  const allowed=(Deno.env.get("TELOPRA_ALLOWED_ORIGINS")||"").split(",").map(x=>x.trim()).filter(Boolean);
  return u.protocol==="https:"&&!!u.hostname&&!u.username&&!u.password&&!u.search&&!u.hash
    &&allowed.includes(u.origin)
    &&u.hostname!=="localhost"&&!/^\d{1,3}(?:\.\d{1,3}){3}$/.test(u.hostname);
 }catch{return false}
}
async function evolution(base:string,instance:string,key:string,route:string,body?:Json):Promise<unknown>{
 const endpoint=base.replace(/\/+$/,"")+"/"+route+"/"+encodeURIComponent(instance);
 const res=await fetch(endpoint,{
  method:body?"POST":"GET",
  headers:{"apikey":key,"Content-Type":"application/json"},
  body:body?JSON.stringify(body):undefined,
  signal:AbortSignal.timeout(12000)
 });
 if(!res.ok)throw new Error("TeloPra / Evolution API HTTP "+res.status);
 const content=await res.json().catch(()=>null);
 if(content===null)throw new Error("Réponse non JSON de TeloPra");
 return content;
}
Deno.serve(async(req:Request)=>{
 if(req.method==="OPTIONS")return new Response(null,{status:204,headers:CORS});
 if(req.method!=="POST")return response(405,{error:"Méthode non acceptée"});
 if(req.headers.get("origin")!==SITE)return response(403,{error:"Origine non autorisée"});
 const bearer=req.headers.get("authorization")||"";
 if(!bearer.startsWith("Bearer "))return response(401,{error:"Connexion requise"});
 const url=Deno.env.get("SUPABASE_URL")||"";
 const anon=Deno.env.get("SUPABASE_ANON_KEY")||"";
 const service=Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")||"";
 if(!url||!anon||!service)return response(500,{error:"Backend Supabase non configuré"});
 const member=createClient(url,anon,{
  auth:{persistSession:false,autoRefreshToken:false},
  global:{headers:{Authorization:bearer}}
 });
 const {data:{user},error:userError}=await member.auth.getUser(bearer.slice(7));
 if(userError||!user?.id||!user.email_confirmed_at)return response(401,{error:"Session vérifiée requise"});
 let body:Json;
 try{body=object(await req.json())}catch{return response(400,{error:"Requête JSON invalide"})}
 const brand=str(body.brand),action=str(body.action);
 if(!["bonas","lzo"].includes(brand)||!["connect","sync"].includes(action))
  return response(400,{error:"Marque ou opération invalide"});
 const permission=action==="connect"?"manage":"sync";
 const grant=await member.rpc("studio_telopra_allowed",{p_brand:brand,p_action:permission});
 if(grant.error||grant.data!==true)return response(403,{error:"Vous n’êtes pas autorisé à gérer la synchronisation de cette marque"});
 const admin=createClient(url,service,{auth:{persistSession:false,autoRefreshToken:false}});
 if(action==="connect"){
  const base=str(body.baseUrl).trim().replace(/\/+$/,"");
  const instance=str(body.instance).trim();
  const apiKey=str(body.apiKey).trim();
  if(!originAllowed(base))return response(409,{error:"Origine TeloPra non autorisée côté serveur. Configurez TELOPRA_ALLOWED_ORIGINS dans Supabase Edge Functions avant la connexion."});
  if(!instance||instance.length>128||!/^[\w. -]+$/.test(instance)||apiKey.length<8||apiKey.length>2048)
   return response(400,{error:"Nom d’instance ou clé d’accès invalide"});
  try{
   const check=object(await evolution(base,instance,apiKey,"instance/connectionState"));
   const state=str(object(check.instance).state)||str(check.state)||str(check.connectionState)||"unknown";
   const save=await admin.rpc("studio_telopra_configure",{
    p_brand:brand,p_base_url:base,p_instance:instance,p_secret:apiKey,p_actor:user.id
   });
   if(save.error)throw new Error("Sauvegarde sécurisée impossible");
   await admin.from("studio_telopra_status").update({connection_state:state==="open"?"connected":state,last_error:null,updated_at:now()}).eq("brand_id",brand);
   return response(200,{ok:true,instance,state,message:"Accès sauvegardé dans Supabase Vault. Vous pouvez synchroniser les conversations."});
  }catch(e){
   return response(502,{error:e instanceof Error?e.message:"Connexion à TeloPra impossible"});
  }
 }
 const config=await admin.rpc("studio_telopra_private_connection",{p_brand:brand});
 if(config.error||!config.data)return response(409,{error:"Aucune connexion TeloPra configurée pour cette marque"});
 const credentials=object(config.data);
 const base=str(credentials.baseUrl),instance=str(credentials.instance),apiKey=str(credentials.apiKey);
 if(!originAllowed(base))return response(409,{error:"L’origine TeloPra n’est plus autorisée côté serveur"});
 try{
  const result=await evolution(base,instance,apiKey,"chat/findChats",{take:60});
  const rawChats=Array.isArray(result)?result:Array.isArray(object(result).chats)?array(object(result).chats):
    Array.isArray(object(result).records)?array(object(result).records):null;
  if(!rawChats)throw new Error("Format des conversations non reconnu : aucune donnée n’a été importée");
  const fetched=rawChats.slice(0,60).map(object).filter(x=>!!remoteId(x));
  const chats=fetched.map(chat=>{
   const jid=remoteId(chat);
   const last=object(chat.lastMessage);
   return {
    brand_id:brand,remote_jid:jid,
    display_name:(str(chat.pushName)||str(chat.name)||str(chat.contactName)||jid.split("@")[0]).slice(0,180),
    kind:jid.endsWith("@g.us")?"group":"contact",
    unread_count:Math.max(0,Math.min(100000,Math.trunc(num(chat.unreadCount)))),
    last_message_preview:textMessage(last).slice(0,300),
    last_message_at:timestamp(chat.updatedAt)||timestamp(last.messageTimestamp),
    updated_at:now()
   };
  });
  if(chats.length){
   const up=await admin.from("studio_telopra_chats").upsert(chats,{onConflict:"brand_id,remote_jid"});
   if(up.error)throw new Error("Enregistrement des conversations impossible");
  }
  let savedMessages=0,failedChats=0;
  // A bounded read-only import protects Evolution and Edge Functions from unbounded jobs.
  for(const chat of chats.slice(0,20)){
   try{
    const found=object(await evolution(base,instance,apiKey,"chat/findMessages",{
      where:{key:{remoteJid:chat.remote_jid}},page:1,offset:15
    }));
    const container=object(found.messages);
    const records=Array.isArray(container.records)?container.records:Array.isArray(found.records)?found.records:[];
    const messages=records.slice(0,15).map(object).map(msg=>{
     const key=object(msg.key);
     const id=str(key.id)||str(msg.id);
     return id?{
      brand_id:brand,message_id:id,remote_jid:chat.remote_jid,
      sent_at:timestamp(msg.messageTimestamp)||timestamp(msg.timestamp),
      from_me:key.fromMe===true,message_type:(str(msg.messageType)||"text").slice(0,80),
      text_body:textMessage(msg),updated_at:now()
     }:null;
    }).filter(x=>x!==null);
    if(messages.length){
     const stored=await admin.from("studio_telopra_messages").upsert(messages,{onConflict:"brand_id,message_id"});
     if(stored.error)throw new Error("Message storage failed");
     savedMessages+=messages.length;
    }
   }catch{failedChats++}
  }
  const partial=failedChats>0;
  await admin.from("studio_telopra_status").upsert({
    brand_id:brand,provider:"evolution-api",instance_name:instance,
    connection_state:partial?"partial":"connected",
    last_synced_at:now(),last_error:partial?failedChats+" conversation(s) sans historique récent":null,
    chats_count:chats.length,messages_count:savedMessages,updated_at:now()
  },{onConflict:"brand_id"});
  return response(200,{
   ok:true,partial,chats:chats.length,messages:savedMessages,
   limit:"60 conversations et 15 messages récents dans les 20 premières conversations par synchronisation",
   warning:partial?"Certains historiques n’ont pas pu être chargés":null
  });
 }catch(e){
  await admin.from("studio_telopra_status").upsert({
   brand_id:brand,connection_state:"error",
   last_error:"Synchronisation indisponible : vérifiez l’instance et l’accès TeloPra",updated_at:now()
  },{onConflict:"brand_id"});
  return response(502,{error:e instanceof Error?e.message:"Synchronisation impossible"});
 }
});
