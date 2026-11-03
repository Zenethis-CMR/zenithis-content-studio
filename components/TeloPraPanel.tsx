'use client';
import {useCallback,useEffect,useState} from 'react';
import {CheckCircle2, CircleAlert, Clock3, RefreshCw, Link2, ShieldCheck, MessageCircleMore, UsersRound, ChevronRight, LockKeyhole, Eye, EyeOff, Inbox, ServerCog, Search, AlertCircle} from 'lucide-react';
import {SiWhatsapp} from 'react-icons/si';
import {studioClient} from '@/lib/studio-db';
import type {BrandId} from '@/lib/types';

type Integration={brand_id:BrandId;instance_name:string|null;connection_state:string;last_synced_at:string|null;chats_count:number;messages_count:number;last_error:string|null};
type Chat={brand_id:BrandId;remote_jid:string;display_name:string|null;kind:string;unread_count:number;last_message_preview:string|null;last_message_at:string|null};
type Message={brand_id:BrandId;message_id:string;remote_jid:string;sent_at:string|null;from_me:boolean;message_type:string|null;text_body:string|null};
const stamp=(date:string|null)=>date?new Date(date).toLocaleString('fr-FR',{dateStyle:'medium',timeStyle:'short'}):'Jamais';
const stateLabel=(state:string)=>state==='connected'||state==='open'?'Connecté':state==='partial'?'Import partiel':state==='error'?'À vérifier':state==='not_connected'?'Non connecté':state;

export function TeloPraPanel({brand,canManage,canEdit}:{brand:BrandId;canManage:boolean;canEdit:boolean}){
 const [status,setStatus]=useState<Integration|null>(null);
 const [chats,setChats]=useState<Chat[]>([]);
 const [activeChat,setActiveChat]=useState('');
 const [messages,setMessages]=useState<Message[]>([]);
 const [baseUrl,setBaseUrl]=useState('');
 const [instance,setInstance]=useState('');
 const [apiKey,setApiKey]=useState('');
 const [reveal,setReveal]=useState(false);
 const [connecting,setConnecting]=useState(false);
 const [syncing,setSyncing]=useState(false);
 const [showForm,setShowForm]=useState(false);
 const [loading,setLoading]=useState(true);
 const [filter,setFilter]=useState('');
 const [notice,setNotice]=useState('');
 const [error,setError]=useState('');

 const load=useCallback(async()=>{
  if(!studioClient){setError('Supabase indisponible');setLoading(false);return}
  const [a,b]=await Promise.all([
   studioClient.from('studio_telopra_status').select('brand_id,instance_name,connection_state,last_synced_at,chats_count,messages_count,last_error').eq('brand_id',brand).maybeSingle(),
   studioClient.from('studio_telopra_chats').select('brand_id,remote_jid,display_name,kind,unread_count,last_message_preview,last_message_at').eq('brand_id',brand).order('last_message_at',{ascending:false,nullsFirst:false}).limit(60)
  ]);
  if(a.error||b.error)setError(a.error?.message||b.error?.message||'Lecture impossible');
  else{setStatus(a.data as Integration|null);setChats((b.data||[]) as Chat[]);setError('')}
  setLoading(false);
 },[brand]);
 useEffect(()=>{void load()},[load]);
 useEffect(()=>{
  if(!activeChat||!studioClient){setMessages([]);return}
  let active=true;
  studioClient.from('studio_telopra_messages')
   .select('brand_id,message_id,remote_jid,sent_at,from_me,message_type,text_body')
   .eq('brand_id',brand).eq('remote_jid',activeChat).order('sent_at',{ascending:false,nullsFirst:false}).limit(50).then(({data,error:err})=>{
    if(!active)return;
    if(err){setError(err.message);return}
    setMessages(((data||[]) as Message[]).slice().reverse());
   });
  return()=>{active=false};
 },[brand,activeChat,status?.last_synced_at]);

 const invoke=async(body:Record<string,unknown>)=>{
  if(!studioClient)throw Error('Supabase non connecté');
  const {data,error:err}=await studioClient.functions.invoke('telopra-bridge',{body:{brand,...body}});
  if(err){
   let detail=err.message;
   const context=(err as {context?:Response}).context;
   if(context?.json)try{const result=await context.json();detail=result.error||detail}catch{}
   throw Error(detail);
  }
  if(!data?.ok)throw Error(data?.error||'Réponse inattendue de TeloPra');
  return data as Record<string,unknown>;
 };
 const connect=async(e:React.FormEvent)=>{
  e.preventDefault();
  if(!canManage||connecting)return;
  setConnecting(true);setNotice('');setError('');
  try{
   const result=await invoke({action:'connect',baseUrl:baseUrl.trim(),instance:instance.trim(),apiKey});
   setApiKey('');setReveal(false);setShowForm(false);
   setNotice(String(result.message||'Connexion enregistrée'));
   await load();
  }catch(e){setError(e instanceof Error?e.message:'Connexion impossible')}
  finally{setConnecting(false)}
 };
 const sync=async()=>{
  if(!canEdit||syncing)return;
  setSyncing(true);setNotice('');setError('');
  try{
   const result=await invoke({action:'sync'});
   setNotice(String(result.chats||0)+' conversations lues · '+String(result.messages||0)+' messages récents importés'+(result.partial?' · import partiel':'')+'.');
   await load();
  }catch(e){setError(e instanceof Error?e.message:'Synchronisation impossible')}
  finally{setSyncing(false)}
 };
 const filtered=chats.filter(c=>(c.display_name||c.remote_jid).toLowerCase().includes(filter.toLowerCase()));
 const selected=chats.find(c=>c.remote_jid===activeChat);
 const online=!!status&&['connected','open','partial'].includes(status.connection_state);

 return <section className="panel telopra-panel" aria-label="Synchronisation TeloPra">
  <div className="telopra-heading">
   <div className="telopra-heading-title">
    <span className="telopra-brand"><SiWhatsapp size={25}/></span>
    <div><span className="telopra-eyebrow">SUIVI AUTOMATISÉ · TELOPRA</span>
     <h2>Flux WhatsApp de votre marque</h2>
     <p>Consultez les conversations hébergées sur TeloPra. Aucun message n’est envoyé depuis le Studio.</p>
    </div>
   </div>
   <span className={'telopra-state '+(online?'telopra-state-online':'')}>
    {online?<CheckCircle2 size={15}/>:<CircleAlert size={15}/>}
    {loading?'Chargement…':stateLabel(status?.connection_state||'not_connected')}
   </span>
  </div>
  <div className="telopra-kpis">
   <div className="telopra-kpi"><MessageCircleMore size={19}/><strong>{(status?.chats_count||0).toLocaleString('fr-FR')}</strong><span>Conversations lues</span></div>
   <div className="telopra-kpi"><Inbox size={19}/><strong>{(status?.messages_count||0).toLocaleString('fr-FR')}</strong><span>Messages récents importés</span></div>
   <div className="telopra-kpi"><Clock3 size={19}/><strong className="telopra-kpi-date">{stamp(status?.last_synced_at||null)}</strong><span>Dernière synchronisation</span></div>
  </div>
  <div className="telopra-actions">
   {status?.instance_name&&<span className="telopra-instance"><ServerCog size={16}/> Instance : <b>{status.instance_name}</b></span>}
   {canEdit&&<button type="button" className="btn btn-whatsapp" onClick={()=>void sync()} disabled={syncing||!status?.instance_name}>
    <RefreshCw size={17} className={syncing?'studio-spin':''}/>{syncing?'Synchronisation…':'Synchroniser'}</button>}
   {canManage&&<button type="button" className="btn btn-outline" onClick={()=>setShowForm(x=>!x)} aria-expanded={showForm}>
    <Link2 size={16}/>{showForm?'Masquer la connexion':online?'Modifier la connexion':'Connecter TeloPra'}</button>}
   {!canManage&&!status&&<span className="telopra-help"><LockKeyhole size={14}/> Connexion réservée au propriétaire.</span>}
  </div>
  {notice&&<p className="telopra-notice" role="status"><CheckCircle2 size={16}/>{notice}</p>}
  {(error||status?.last_error)&&<p className="telopra-error" role="alert"><AlertCircle size={16}/>{error||status?.last_error}</p>}
  {showForm&&canManage&&<form className="telopra-connect-form" onSubmit={connect}>
   <div className="telopra-form-title"><ShieldCheck size={19}/><div><strong>Connecter l’instance WhatsApp déjà active sur TeloPra</strong><small>La clé est transmise en HTTPS et conservée chiffrée dans Supabase Vault. Elle n’est jamais stockée dans ce navigateur.</small></div></div>
   <div className="telopra-form-grid">
    <label>URL HTTPS d’Evolution API dans TeloPra
     <input type="url" autoComplete="off" inputMode="url" placeholder="https://api.votre-domaine.tld" required value={baseUrl} onChange={e=>setBaseUrl(e.target.value)}/></label>
    <label>Nom de l’instance WhatsApp
     <input type="text" autoComplete="off" placeholder="Nom exact de l’instance" required value={instance} onChange={e=>setInstance(e.target.value)}/></label>
    <label>Clé API de l’instance
     <span className="telopra-secret-field"><input type={reveal?'text':'password'} autoComplete="off" placeholder="Clé réservée à l’instance" required value={apiKey} onChange={e=>setApiKey(e.target.value)}/>
      <button type="button" aria-label={reveal?'Masquer la clé':'Afficher la clé'} onClick={()=>setReveal(v=>!v)}>{reveal?<EyeOff size={18}/>:<Eye size={18}/>}</button></span></label>
   </div>
   <p className="telopra-form-note"><LockKeyhole size={15}/> Le domaine doit également être autorisé côté serveur dans <code>TELOPRA_ALLOWED_ORIGINS</code>. Utilisez une clé d’instance plutôt qu’une clé globale.</p>
   <button type="submit" className="btn btn-primary" disabled={connecting||!baseUrl||!instance||!apiKey}><Link2 size={16}/>{connecting?'Vérification…':'Tester et connecter'}</button>
  </form>}
  <div className="telopra-feed">
   <div className="telopra-feed-head"><div><h3>Conversations synchronisées</h3><span>Lecture seule · Séparation sécurisée BONAS-INC / LZO Empire</span></div><small>{chats.length} conversation(s)</small></div>
   {chats.length>0?<div className="telopra-chat-layout">
    <div className="telopra-chat-list">
     <label className="telopra-chat-search"><Search size={16}/><input value={filter} onChange={e=>setFilter(e.target.value)} placeholder="Rechercher" aria-label="Rechercher une conversation"/></label>
     {filtered.map(chat=><button type="button" key={chat.remote_jid}
        className={'telopra-chat-item '+(activeChat===chat.remote_jid?'telopra-chat-item-active':'')} onClick={()=>setActiveChat(chat.remote_jid)}>
       <span className="telopra-chat-avatar">{chat.kind==='group'?<UsersRound size={19}/>:<MessageCircleMore size={18}/>}</span>
       <span className="telopra-chat-meta"><strong>{chat.display_name||chat.remote_jid}</strong><small>{chat.last_message_preview||'Aperçu indisponible'}</small></span>
       <span className="telopra-chat-end">{chat.unread_count>0&&<b>{chat.unread_count}</b>}<ChevronRight size={16}/></span>
      </button>)}
     {!filtered.length&&<p className="telopra-feed-empty">Aucun résultat.</p>}
    </div>
    <div className="telopra-message-area">
     {selected?<><div className="telopra-selected-chat"><strong>{selected.display_name||selected.remote_jid}</strong><small>{selected.kind==='group'?'Groupe WhatsApp':'Discussion privée'} · Dernière activité : {stamp(selected.last_message_at)}</small></div>
      <div className="telopra-message-scroll">{messages.length?messages.map(message=><div className={'telopra-message '+(message.from_me?'telopra-message-out':'')} key={message.message_id}>
        <p>{message.text_body||('['+(message.message_type||'Média')+']')}</p><small>{stamp(message.sent_at)} · {message.from_me?'Envoyé':'Reçu'}</small>
       </div>):<p className="telopra-feed-empty">Aucun message récent importé pour cette conversation.</p>}</div>
     </>:<div className="telopra-chat-placeholder"><SiWhatsapp size={29}/><strong>Sélectionner une conversation</strong><p>Ouvrez une fiche pour consulter les messages synchronisés.</p></div>}
    </div>
   </div>:<div className="telopra-empty"><SiWhatsapp size={32}/><strong>{status?'Aucune conversation importée':'Aucune connexion TeloPra pour cette marque'}</strong>
    <p>{status?'Cliquez sur « Synchroniser » pour importer les échanges.':'Connectez l’instance déjà scannée sur TeloPra pour suivre son activité dans Zenithis Studio.'}</p></div>}
  </div>
  <p className="telopra-footnote">Import manuel en lecture seule, limité aux conversations et messages récents. Les statuts et qualifications propres à TeloPra nécessitent un raccordement supplémentaire à son API métier.</p>
 </section>;
}
