'use client';

import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
  LayoutDashboard, CalendarDays, CalendarClock, Columns3, Images, PenSquare, Video,
  Megaphone, MessageCircle, ChartNoAxesCombined, Library, Settings2, Search, Bell,
  ChevronDown, ChevronLeft, ChevronRight, Plus, ArrowUpRight, Check, X, Clock3,
  CircleCheck, Download, Upload, ExternalLink, Copy, Filter, CalendarCheck, Users,
  Eye, Send, FileText, Play, MoreHorizontal, Sparkles, LayoutGrid, List, Menu,
  Bookmark, Pencil, Trash2, MoveRight, Target, TrendingUp, ArrowRight, Activity,
  MapPin, ClipboardCheck, Info, RotateCcw, CircleAlert, SlidersHorizontal, Link2, LogOut,
  FolderOpen, ChartColumn, FileVideo, Layers, CheckCheck, CalendarRange, Lightbulb,
  CalendarPlus, RefreshCw, UserRound, AlertTriangle, BadgeCheck, LoaderCircle
} from 'lucide-react';
import {SiFacebook,SiInstagram,SiTiktok,SiYoutube,SiLinkedin,SiPinterest,SiWhatsapp,SiThreads} from 'react-icons/si';
import {StudioLogin,StudioOnboarding} from './StudioAuth';
import {TeloPraPanel} from './TeloPraPanel';
import {closingPlaybooks,closerStageNames} from '@/lib/closing-playbooks';
import {parseStudioRoute,serializeStudioRoute} from '@/lib/studio-routing';
import type { BrandId, ContentPost, ChannelVariant, Script, GroupEvent, MediaAsset, Status, View, PersistentWorkspace, WorkspaceData } from '@/lib/types';
import { studioClient, STUDIO_BUCKET, readWorkspace, saveWorkspace, uploadStudioMedia, encodeWorkspace, readStudioLibrary } from '@/lib/studio-db';
import { BRAND_INFO, emptyLibrary, seededMedia, statuses, normalizeStatus, labelForType, asDate, longDate, shortDate, byDate, socialChannels, downloadJson } from '@/lib/data';

type Toast = { message: string; kind?: 'success' | 'info' | 'warning' } | null;
type LocalWorkspace = PersistentWorkspace;
type BrandRole = 'owner' | 'editor' | 'viewer';
type AccessState = {isSuperadmin:boolean;roles:Partial<Record<BrandId,BrandRole>>;allowedBrands:BrandId[]};
type GrantRow = {email:string;brand_id:BrandId;role:BrandRole;created_at?:string};
const emptyMetrics={messages:0,qualified:0,registrations:0,attendees:0};
const initialWorkspace=(id:BrandId):LocalWorkspace=>({posts:[],variants:[],media:seededMedia.filter(x=>x.brand===id),metrics:{...emptyMetrics},notes:''});
const initialAll=():Record<BrandId,LocalWorkspace>=>({bonas:initialWorkspace('bonas'),lzo:initialWorkspace('lzo')});
const nav:[View,string,React.ComponentType<{size?:number;strokeWidth?:number}>][]=[
 ['overview','Vue d’ensemble',LayoutDashboard],['planning','Programmation',CalendarClock],['calendar','Calendrier',CalendarDays],['kanban','Kanban éditorial',Columns3],['media','Médiathèque',Images],['editor','Éditeur de contenu',PenSquare],['video','Scripts vidéo',Video],['campaigns','Campagnes éditoriales',Megaphone],['whatsapp','WhatsApp & séminaires',WhatsappMark],['insights','Analyses',ChartNoAxesCombined],['research','Veille & angles',Target],['sources','Sources & références',Library],['settings','Paramètres',Settings2]
];
const socialIconByChannel:Record<string,React.ComponentType<{size?:number}>>={
 'Facebook':SiFacebook,'Instagram':SiInstagram,'TikTok':SiTiktok,'YouTube Shorts':SiYoutube,
 'YouTube':SiYoutube,'LinkedIn':SiLinkedin,'Pinterest':SiPinterest,
 'WhatsApp':SiWhatsapp,'Threads':SiThreads
};
// Toutes les variantes de format d'un réseau réutilisent le même logo officiel.
// Exemple : "Facebook Reels" et "Facebook Stories" affichent le logo Facebook.
const canonicalNetwork=(value:string):string=>{
 const normalized=value.trim().normalize('NFKD').replace(/[\u0300-\u036f]/g,'').toLowerCase().replace(/[\s_-]+/g,' ');
 if(normalized.startsWith('facebook')||normalized==='fb')return 'Facebook';
 if(normalized.startsWith('instagram')||normalized==='insta')return 'Instagram';
 if(normalized.startsWith('tiktok')||normalized.startsWith('tik tok'))return 'TikTok';
 if(normalized.startsWith('youtube')||normalized.startsWith('you tube'))return 'YouTube';
 if(normalized.startsWith('linkedin'))return 'LinkedIn';
 if(normalized.startsWith('pinterest'))return 'Pinterest';
 if(normalized.startsWith('whatsapp')||normalized.startsWith('whats app'))return 'WhatsApp';
 if(normalized.startsWith('threads'))return 'Threads';
 return '';
};
const channelClass=(value:string)=>canonicalNetwork(value).toLowerCase().replace(/\s+/g,'-')||'other';
const statusClass=(s:string)=>{
 const v=normalizeStatus(s);return v==='Publié'?'success':v==='Programmé'?'blue':v==='À valider'?'purple':v==='En rédaction'?'orange':v==='Idée'?'neutral':'gray';
};
const dayNames=['Lundi','Mardi','Mercredi','Jeudi','Vendredi','Samedi','Dimanche'];
const isoDate=(d:Date)=>[d.getFullYear(),String(d.getMonth()+1).padStart(2,'0'),String(d.getDate()).padStart(2,'0')].join('-');
const monthLabel=(date:Date)=>date.toLocaleDateString('fr-FR',{month:'long',year:'numeric'});
const monthGrid=(date:Date)=>{
 const start=new Date(date.getFullYear(),date.getMonth(),1);const offset=(start.getDay()+6)%7;
 return Array.from({length:42},(_,i)=>new Date(start.getFullYear(),start.getMonth(),1-offset+i));
};
const clean=(str:string,max=130)=>str.length>max?str.slice(0,max-1)+'…':str;
function Badge({children,tone='blue'}:{children:React.ReactNode,tone?:string}){return <span className={'pill pill-'+tone}>{children}</span>}
function Channel({name,small=false}:{name:string;small?:boolean}){
 const network=canonicalNetwork(name);
 const Icon=socialIconByChannel[network];
 return <span title={name} aria-label={name} data-network={network||'other'}
  className={'channel channel-'+channelClass(name)+(small?' channel-mini':'')}>
  {Icon?<Icon size={small?17:21}/>:<Megaphone aria-hidden size={small?15:18}/>}
 </span>;
}
function IconButton({children,onClick,title,className=''}:{children:React.ReactNode;onClick?:()=>void;title?:string;className?:string}){return <button type="button" onClick={onClick} title={title} className={'icon-btn '+className}>{children}</button>}
function WhatsappMark({size=20}:{size?:number;strokeWidth?:number}){return <SiWhatsapp aria-hidden size={size} style={{color:'#25d366'}}/>}
function MiniLine({values}:{values:number[]}){const mx=Math.max(1,...values);const pts=values.map((v,i)=>`${i*24},${38-(v/mx)*29}`).join(' ');return <svg className="mini-line" viewBox="0 0 168 44" aria-hidden="true"><polyline points={pts} fill="none" stroke="#3e76f7" strokeWidth="2.7" strokeLinecap="round" strokeLinejoin="round"/></svg>}

export default function Studio(){
 const [brand,setBrand]=useState<BrandId>('bonas');
 const [brandMenuOpen,setBrandMenuOpen]=useState(false);
 const brandMenuRef=useRef<HTMLDivElement>(null);
 const [profileMenuOpen,setProfileMenuOpen]=useState(false);
 const profileMenuRef=useRef<HTMLDivElement>(null);
 const [view,setView]=useState<View>('overview');
 const [routeHydrated,setRouteHydrated]=useState(false);
 const [selectedWhatsappStage,setSelectedWhatsappStage]=useState<'1'|'2'|'3'|'4'>('2');
 const [selectedEventId,setSelectedEventId]=useState('');
 const [filterWeek,setFilterWeek]=useState('Toutes les semaines');
 const [workspaces,setWorkspaces]=useState<Record<BrandId,LocalWorkspace>>(initialAll);
 const [libraries,setLibraries]=useState<Record<BrandId,WorkspaceData>>({bonas:emptyLibrary('bonas'),lzo:emptyLibrary('lzo')});
 const [ready,setReady]=useState(false);
 const [user,setUser]=useState<{id:string;email?:string;firstName?:string;lastName?:string}|null>(null);
 const [onboardingMode,setOnboardingMode]=useState<'setup'|'reset'|null>(null);
 const [authEmail,setAuthEmail]=useState('');
 const [authMessage,setAuthMessage]=useState('');
 const [authLoading,setAuthLoading]=useState(true);
 const [access,setAccess]=useState<AccessState|null>(null);
 const [grantRows,setGrantRows]=useState<GrantRow[]>([]);
 const [inviteEmail,setInviteEmail]=useState('');
 const [inviteBrand,setInviteBrand]=useState<BrandId>('bonas');
 const [inviteRole,setInviteRole]=useState<BrandRole>('editor');
 const [inviteBusy,setInviteBusy]=useState(false);
 const [dbMessage,setDbMessage]=useState('Connexion à la base…');
 const [dbProblem,setDbProblem]=useState('');
 const versionRef=useRef<Record<BrandId,number>>({bonas:0,lzo:0});
 const snapshotRef=useRef<Record<BrandId,string>>({bonas:'',lzo:''});
 const pendingWrites=useRef<Record<BrandId,Promise<void>>>({bonas:Promise.resolve(),lzo:Promise.resolve()});
 const [search,setSearch]=useState('');
 const [filterStatus,setFilterStatus]=useState('Tous les statuts');
 const [filterChannel,setFilterChannel]=useState('Tous les canaux');
 const [selectedPostId,setSelectedPostId]=useState('');
 const [selectedMediaId,setSelectedMediaId]=useState('');
 const [selectedScript,setSelectedScript]=useState('');
 const [calendarMonth,setCalendarMonth]=useState(new Date(2026,10,1));
 const [selectedDate,setSelectedDate]=useState('2026-11-09');
 const [calendarMode,setCalendarMode]=useState<'Mois'|'Semaine'|'Agenda'>('Mois');
 const [kanbanFilter,setKanbanFilter]=useState('');
 const [mediaFilter,setMediaFilter]=useState('Tous');
 const [toast,setToast]=useState<Toast>(null);
 const [mobileMenu,setMobileMenu]=useState(false);
 useEffect(()=>{
  if(!mobileMenu)return;
  const onEscape=(event:KeyboardEvent)=>{if(event.key==='Escape')setMobileMenu(false)};
  document.addEventListener('keydown',onEscape);
  if(!window.matchMedia('(max-width:780px)').matches)return()=>document.removeEventListener('keydown',onEscape);
  const previous=document.body.style.overflow;
  document.body.style.overflow='hidden';
  return()=>{document.body.style.overflow=previous;document.removeEventListener('keydown',onEscape)};
 },[mobileMenu]);
 useEffect(()=>{
  if(!ready)return;
  setMobileMenu(false);
  window.scrollTo({top:0,behavior:'instant'});
 },[view,brand,ready]);
 useEffect(()=>{
  if(view!=='media'||!selectedMediaId||!window.matchMedia('(max-width:780px)').matches)return;
  const frame=window.requestAnimationFrame(()=>document.getElementById('mobile-media-details')?.scrollIntoView({behavior:'smooth',block:'start'}));
  return()=>window.cancelAnimationFrame(frame);
 },[view,selectedMediaId]);
 const [editorDraft,setEditorDraft]=useState<Partial<ContentPost>>({});
 const [editTab,setEditTab]=useState<'contenu'|'declinaisons'>('contenu');
 const [newModal,setNewModal]=useState(false);
 const [variantId,setVariantId]=useState('');
 const [variantDraft,setVariantDraft]=useState<Partial<ChannelVariant>>({});
 const fileInput=useRef<HTMLInputElement>(null);
 const importInput=useRef<HTMLInputElement>(null);

 // Route hydration and browser history. The URL remains the source of truth on refresh/back/forward.
 useEffect(()=>{
  const restore=()=>{
   const route=parseStudioRoute(window.location.search);
   setView(route.view);
   if(route.brand)setBrand(route.brand);
   setSelectedPostId(route.post||'');
   setSelectedMediaId(route.media||'');
   setSelectedScript(route.script||'');
   setSelectedEventId(route.event||'');
   setSelectedWhatsappStage(route.stage||'2');
   setEditTab(route.tab||'contenu');
   setFilterWeek(route.week||'Toutes les semaines');
   setFilterStatus(route.status && statuses.includes(route.status as Status)?route.status:'Tous les statuts');
   setFilterChannel(route.channel && socialChannels.includes(route.channel)?route.channel:'Tous les canaux');
   setCalendarMode(route.calendar==='week'?'Semaine':route.calendar==='agenda'?'Agenda':route.calendar==='month'?'Mois':window.matchMedia('(max-width:780px)').matches?'Agenda':'Mois');
   if(route.date)setSelectedDate(route.date);
   const month=route.month||route.date?.slice(0,7);
   if(month){
    const date=new Date(month+'-01T12:00:00');
    if(!Number.isNaN(date.getTime()))setCalendarMonth(new Date(date.getFullYear(),date.getMonth(),1));
   }
   setMobileMenu(false);
   setBrandMenuOpen(false);
   setProfileMenuOpen(false);
   setRouteHydrated(true);
  };
  restore();
  window.addEventListener('popstate',restore);
  return()=>window.removeEventListener('popstate',restore);
 },[]);
 useEffect(()=>{
  if(!access?.allowedBrands.length)return;
  if(!access.allowedBrands.includes(brand))setBrand(access.allowedBrands[0]);
 },[brand,access]);
 useEffect(()=>{
  if(!routeHydrated||!ready||!access||onboardingMode||!access.allowedBrands.includes(brand))return;
  const target=serializeStudioRoute({
   brand,view,
   post:view==='editor'?selectedPostId:undefined,
   media:view==='media'?selectedMediaId:undefined,
   script:view==='video'?selectedScript:undefined,
   date:view==='calendar'?selectedDate:undefined,
   month:view==='calendar'?isoDate(calendarMonth).slice(0,7):undefined,
   calendar:view==='calendar'?(calendarMode==='Semaine'?'week':calendarMode==='Agenda'?'agenda':'month'):undefined,
   tab:view==='editor'?editTab:undefined,
   event:view==='whatsapp'?selectedEventId:undefined,
   stage:view==='whatsapp'?selectedWhatsappStage:undefined,
   week:view==='planning'||view==='kanban'||view==='campaigns'?filterWeek:undefined,
   status:view==='planning'||view==='kanban'?filterStatus:undefined,
   channel:view==='planning'||view==='kanban'?filterChannel:undefined
  },window.location.search);
  if(target!==window.location.search){
   window.history.pushState({zenithisStudio:true},'',window.location.pathname+target+window.location.hash);
  }
 },[routeHydrated,ready,access,brand,view,selectedPostId,selectedMediaId,selectedScript,selectedDate,calendarMonth,calendarMode,editTab,selectedWhatsappStage,selectedEventId,filterWeek,filterStatus,filterChannel,onboardingMode]);

 useEffect(()=>{
  if(typeof window==='undefined')return;
  const q=new URLSearchParams(window.location.search).get('mode');
  if(q==='setup'||q==='reset')setOnboardingMode(q);
 },[]);
 useEffect(()=>{
  if(!studioClient){setAuthLoading(false);return}
  const client=studioClient;
  let active=true;
  const refresh=async()=>{
   const {data,error}=await client.auth.getUser();
   if(active){setUser(error?null:(data.user?{id:data.user.id,email:data.user.email,firstName:data.user.user_metadata?.first_name,lastName:data.user.user_metadata?.last_name}:null));setAuthLoading(false)}
  };
  void refresh();
  const {data:{subscription}}=client.auth.onAuthStateChange((event,session)=>{
   if(!active)return;
   setUser(session?.user?{id:session.user.id,email:session.user.email,firstName:session.user.user_metadata?.first_name,lastName:session.user.user_metadata?.last_name}:null);
   if(event==='PASSWORD_RECOVERY')setOnboardingMode('reset');
   setAuthLoading(false);
  });
  return()=>{active=false;subscription.unsubscribe()}
 },[]);
 useEffect(()=>{
  if(!studioClient||!user){setReady(false);setAccess(null);return}
  let active=true;
  const load=async()=>{
   setReady(false);setAccess(null);setDbProblem('');setDbMessage('Vérification des autorisations…');
   try{
    const email=(user.email||'').trim().toLowerCase();
    if(!email)throw new Error('Le compte connecté ne possède pas d’adresse e-mail vérifiée.');
    const [admins,brands]=await Promise.all([
      studioClient!.from('studio_superadmins').select('email').eq('email',email).maybeSingle(),
      studioClient!.from('studio_brand_access').select('brand_id,role').eq('email',email)
    ]);
    if(admins.error)throw admins.error;
    if(brands.error)throw brands.error;
    const roles:Partial<Record<BrandId,BrandRole>>={};
    for(const item of brands.data||[]){
      if((item.brand_id==='bonas'||item.brand_id==='lzo')&&
         (item.role==='owner'||item.role==='editor'||item.role==='viewer'))roles[item.brand_id as BrandId]=item.role as BrandRole;
    }
    const isSuperadmin=!!admins.data;
    const allowedBrands:BrandId[]=isSuperadmin?['bonas','lzo']:(['bonas','lzo'] as BrandId[]).filter(id=>!!roles[id]);
    if(!active)return;
    setAccess({isSuperadmin,roles,allowedBrands});
    if(allowedBrands.length===0){
      setDbProblem('Aucun espace ne vous a encore été attribué. Demandez une invitation au propriétaire de la marque ou au super-administrateur.');
      return;
    }
    // Each brand is queried only after server-backed authorization has passed.
    const editorial=await Promise.all(allowedBrands.map(async id=>({id,data:await readStudioLibrary(id)})));
    const records=await Promise.all(allowedBrands.map(async id=>{
      const library=editorial.find(x=>x.id===id)!.data;
      const seed:LocalWorkspace={
        posts:library.posts.map(p=>({...p,status:normalizeStatus(p.status)})),
        variants:library.variants,
        media:seededMedia.filter(m=>m.brand===id),
        metrics:{...emptyMetrics},notes:''
      };
      const record=await readWorkspace(id,seed,user.id);
      return {id,...record};
    }));
    if(!active)return;
    const next=initialAll();
    const nextLibraries:{bonas:WorkspaceData;lzo:WorkspaceData}={bonas:emptyLibrary('bonas'),lzo:emptyLibrary('lzo')};
    for(const entry of editorial)nextLibraries[entry.id]=entry.data;
    for(const record of records){
      next[record.id]=record.data;
      versionRef.current[record.id]=record.version;
      snapshotRef.current[record.id]=JSON.stringify(encodeWorkspace(record.data));
    }
    setLibraries(nextLibraries);
    setBrand(prev=>allowedBrands.includes(prev)?prev:allowedBrands[0]);
    setWorkspaces(next);
    setReady(true);
    setDbMessage('Supabase connecté · accès limités à vos marques');
   }catch(e){
    if(active){setDbProblem(e instanceof Error?e.message:String(e));setDbMessage('Connexion ou autorisation impossible')}
   }
  };
  void load();return()=>{active=false}
 },[user?.id]);
 useEffect(()=>{
  if(!ready||!user||!studioClient||!access)return;
  const timeouts:Array<ReturnType<typeof setTimeout>>=[];
  for(const id of access.allowedBrands){
    if(!access.isSuperadmin && access.roles[id]==='viewer')continue;
    const value=workspaces[id];
    const serialized=JSON.stringify(encodeWorkspace(value));
    if(serialized===snapshotRef.current[id])continue;
    setDbMessage('Modifications en cours de synchronisation…');
    timeouts.push(setTimeout(()=>{
      pendingWrites.current[id]=pendingWrites.current[id].catch(()=>{}).then(async()=>{
        const latest=JSON.stringify(encodeWorkspace(value));
        if(latest===snapshotRef.current[id])return;
        try{
          const v=await saveWorkspace(id,value,versionRef.current[id],user.id);
          versionRef.current[id]=v;snapshotRef.current[id]=latest;
          setDbProblem('');setDbMessage('Toutes les modifications sont enregistrées dans Supabase');
        }catch(e){
          const message=e instanceof Error?e.message:String(e);
          setDbProblem(message);setDbMessage('Erreur de sauvegarde · veuillez exporter une copie');
        }
      });
    },900));
  }
  return()=>timeouts.forEach(clearTimeout);
 },[workspaces,ready,user?.id,access]);
 useEffect(()=>{if(!toast)return;const t=setTimeout(()=>setToast(null),4200);return()=>clearTimeout(t)},[toast]);
 const info=BRAND_INFO[brand], raw=libraries[brand], ws=workspaces[brand];
 const allPosts=ws.posts;
 const selectedPost=allPosts.find(p=>p.id===selectedPostId) || null;
 const selectedMedia=ws.media.find(m=>m.id===selectedMediaId)||null;
 const currentVariants=selectedPost?ws.variants.filter(v=>v.postId===selectedPost.id):[];
 const chosenVariant=ws.variants.find(v=>v.id===variantId)||currentVariants[0];
 const filtered=useMemo(()=>allPosts.filter(p=>{
  const hay=[p.title,p.caption,p.id,p.pillar,p.type,p.stage].join(' ').toLowerCase();
  return (!search||hay.includes(search.toLowerCase()))&&(filterStatus==='Tous les statuts'||normalizeStatus(p.status)===filterStatus)&&(filterChannel==='Tous les canaux'||p.channels.some(c=>c.toLowerCase().includes(filterChannel.toLowerCase())))&&(filterWeek==='Toutes les semaines'||p.week===filterWeek);
 }).sort(byDate),[allPosts,search,filterStatus,filterChannel,filterWeek]);
 const upcoming=useMemo(()=>[...allPosts].sort(byDate).filter(x=>x.date>='2026-11-02').slice(0,6),[allPosts]);
 const pipeline=useMemo(()=>statuses.map(s=>({name:s,count:allPosts.filter(p=>normalizeStatus(p.status)===s).length})),[allPosts]);
 const stats={posts:allPosts.length,variants:ws.variants.length,videos:raw.scripts.length,published:pipeline.find(x=>x.name==='Publié')?.count||0,scheduled:pipeline.find(x=>x.name==='Programmé')?.count||0};
 const countsByWeek=useMemo(()=>Array.from({length:8},(_,i)=>{const week=`S${i+1}`;return {week,planned:allPosts.filter(p=>p.week===week).length,published:allPosts.filter(p=>p.week===week&&normalizeStatus(p.status)==='Publié').length}}),[allPosts]);
 const notify=(message:string,kind:'success'|'info'|'warning'='success')=>setToast({message,kind});
 const switchBrand=(id:BrandId)=>{
  setBrandMenuOpen(false);setProfileMenuOpen(false);
  if(!access?.allowedBrands.includes(id)){notify('Accès à cette marque non autorisé','warning');return}
  if(id===brand)return;
  setBrand(id);setSelectedPostId('');setSelectedMediaId('');setSelectedScript('');
  setSelectedEventId('');setSearch('');setFilterWeek('Toutes les semaines');
  setFilterStatus('Tous les statuts');setFilterChannel('Tous les canaux');
 };
 useEffect(()=>{
  if(!brandMenuOpen)return;
  const closeOutside=(event:MouseEvent)=>{if(!brandMenuRef.current?.contains(event.target as Node))setBrandMenuOpen(false)};
  const closeEscape=(event:KeyboardEvent)=>{if(event.key==='Escape')setBrandMenuOpen(false)};
  document.addEventListener('pointerdown',closeOutside);
  document.addEventListener('keydown',closeEscape);
  return()=>{document.removeEventListener('pointerdown',closeOutside);document.removeEventListener('keydown',closeEscape)};
 },[brandMenuOpen]);
 useEffect(()=>{
  if(!profileMenuOpen)return;
  const closeOutside=(event:PointerEvent)=>{if(!profileMenuRef.current?.contains(event.target as Node))setProfileMenuOpen(false)};
  const closeEscape=(event:KeyboardEvent)=>{if(event.key==='Escape')setProfileMenuOpen(false)};
  document.addEventListener('pointerdown',closeOutside);
  document.addEventListener('keydown',closeEscape);
  return()=>{document.removeEventListener('pointerdown',closeOutside);document.removeEventListener('keydown',closeEscape)};
 },[profileMenuOpen]);
 const canEdit=(id:BrandId)=>!!access && access.allowedBrands.includes(id) && (access.isSuperadmin || access.roles[id]!=='viewer');
 const canManage=(id:BrandId)=>!!access && access.allowedBrands.includes(id) && (access.isSuperadmin || access.roles[id]==='owner');
 const modifyWs=(id:BrandId,fn:(p:LocalWorkspace)=>LocalWorkspace)=>{
  if(!canEdit(id)){notify('Accès en lecture seule','warning');return}
  setWorkspaces(old=>({...old,[id]:fn(old[id])}));
 };
 const updatePost=(id:string,patch:Partial<ContentPost>)=>{if(!canEdit(brand)){notify('Lecture seule','warning');return}modifyWs(brand,w=>({...w,posts:w.posts.map(p=>p.id===id?{...p,...patch}:p)}));notify('Contenu mis à jour dans cet espace de travail')};
 const updateVariant=(id:string,patch:Partial<ChannelVariant>)=>{if(!canEdit(brand)){notify('Lecture seule','warning');return}modifyWs(brand,w=>({...w,variants:w.variants.map(v=>v.id===id?{...v,...patch}:v)}));notify('Déclinaison enregistrée')};
 const jumpToPost=(id:string,where:View='editor')=>{setSelectedPostId(id);setEditorDraft({});setEditTab('contenu');setView(where);setMobileMenu(false)};
 const exportBackup=()=>{
  if(!access)return;
  const permitted=Object.fromEntries(access.allowedBrands.map(id=>[id,workspaces[id]]));
  downloadJson({version:2,exportedAt:new Date().toISOString(),workspaces:permitted},'zenithis-studio-sauvegarde.json');
  notify('Sauvegarde des espaces autorisés téléchargée')
 };
 const importBackup=async(file:File|undefined)=>{
  if(!file||!user||!access)return;
  try{
    const obj=JSON.parse(await file.text());
    const entries=access.allowedBrands.filter(id=>canEdit(id)&&obj?.workspaces?.[id]?.posts?.length);
    if(!entries.length)throw new Error('Aucune marque autorisée dans la sauvegarde');
    setWorkspaces(old=>{
      const next={...old};
      for(const id of entries)next[id]=obj.workspaces[id];
      return next;
    });
    notify('Sauvegarde restaurée pour '+entries.map(id=>BRAND_INFO[id].label).join(', '))
  }catch(e){notify('Import refusé : '+(e instanceof Error?e.message:String(e)),'warning')}
 };
 const addPost=()=>{
  if(!canEdit(brand)){notify('Accès en lecture seule','warning');return}
  const id=brand.toUpperCase()+'-NEW-'+Math.floor(Date.now()/1000);const post:ContentPost={id,date:'2026-11-09',week:'S1',day:'Lundi',time:'18:30',type:'Publication',stage:'Découverte',pillar:brand==='bonas'?'PLAN B':'MON APRÈS',title:'Nouveau contenu',caption:'Ajoutez votre texte ici.',cta:brand==='bonas'?'Écris PLAN B':'Écris AVENIR',channels:['Facebook'],script:'',duration:'',asset:'',hashtags:'',sources:'',production:'',status:'Idée',eventDate:'',proof:'',assignee:info.person,dmLink:raw.config.whatsapp,groupLink:''};modifyWs(brand,w=>({...w,posts:[...w.posts,post]}));setSelectedPostId(id);setEditorDraft({});setNewModal(false);setView('editor');notify('Nouveau brouillon créé')};
 const mediaUpload=async(file:File|undefined)=>{
  if(!file||!user||!studioClient)return;
  if(!canEdit(brand)){notify('Accès en lecture seule','warning');return}
  setDbMessage('Envoi du fichier dans Supabase Storage…');
  try{
    const asset=await uploadStudioMedia(file,brand);
    modifyWs(brand,w=>({...w,media:[asset,...w.media]}));
    notify('Fichier téléversé dans Supabase Storage et ajouté à la médiathèque');
  }catch(e){notify('Échec du téléversement : '+(e instanceof Error?e.message:String(e)),'warning')}
 };
 const manageableBrands=(access?.allowedBrands||[]).filter(id=>canManage(id));
 const refreshGrantRows=async()=>{
  if(!studioClient||!manageableBrands.length)return;
  const {data,error}=await studioClient.from('studio_brand_access')
    .select('email,brand_id,role,created_at')
    .in('brand_id',manageableBrands)
    .order('brand_id').order('email');
  if(error){notify('Impossible de charger les accès : '+error.message,'warning');return}
  setGrantRows((data||[]) as GrantRow[]);
 };
 useEffect(()=>{
  if(view==='settings'&&ready&&manageableBrands.length)void refreshGrantRows();
 },[view,brand,ready,user?.id,access?.isSuperadmin,access?.roles.bonas,access?.roles.lzo]);
 const grantAccess=async()=>{
  if(!studioClient||!user||inviteBusy)return;
  const targetBrand=manageableBrands.includes(inviteBrand)?inviteBrand:manageableBrands[0];
  const normalized=inviteEmail.trim().toLowerCase();
  if(!targetBrand||!canManage(targetBrand)){notify('Vous ne pouvez pas inviter dans cette marque','warning');return}
  if(!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalized)){notify('Adresse e-mail invalide','warning');return}
  if(inviteRole==='owner'&&!access?.isSuperadmin){notify('Seul le super-administrateur peut nommer un propriétaire','warning');return}
  if(normalized===user.email?.trim().toLowerCase() && !access?.isSuperadmin){notify('Vous ne pouvez pas modifier votre propre accès','warning');return}
  setInviteBusy(true);
  const {error}=await studioClient.from('studio_brand_access').upsert({
    email:normalized,brand_id:targetBrand,role:inviteRole,granted_by:user.id
  },{onConflict:'email,brand_id'});
  if(error){setInviteBusy(false);notify('Autorisation refusée : '+error.message,'warning');return}
  const {data:invitation,error:deliveryError}=await studioClient.functions.invoke('invite-studio-member',{
    body:{email:normalized,brand:targetBrand,role:inviteRole}
  });
  setInviteBusy(false);
  if(deliveryError||!invitation?.ok){
    notify('Marque attribuée, mais e-mail non envoyé. Vérifiez les redirections et le quota SMTP Supabase.','warning');
    await refreshGrantRows();return;
  }
  setInviteEmail('');
  notify(invitation.status==='existing-account-reset'
   ?'Accès attribué : e-mail de configuration du mot de passe envoyé.'
   :'Invitation envoyée. Le destinataire pourra définir son profil et son mot de passe.');
  await refreshGrantRows();
 };
 const revokeGrant=async(grant:GrantRow)=>{
  if(!studioClient||!canManage(grant.brand_id))return;
  if(grant.role==='owner'&&!access?.isSuperadmin){notify('Seul le super-administrateur peut retirer un propriétaire','warning');return}
  if(!window.confirm('Retirer l’accès de '+grant.email+' à '+BRAND_INFO[grant.brand_id].label+' ?'))return;
  const {error}=await studioClient.from('studio_brand_access').delete()
   .eq('email',grant.email).eq('brand_id',grant.brand_id);
  if(error){notify('Révocation refusée : '+error.message,'warning');return}
  notify('Accès retiré');await refreshGrantRows();
 };
 const copyText=(text:string)=>{navigator.clipboard?.writeText(text).then(()=>notify('Texte copié')).catch(()=>notify('Copie indisponible dans ce navigateur','warning'))};
 const openEditor=(post:ContentPost)=>jumpToPost(post.id);
 const activateBlock=(event:React.MouseEvent<HTMLElement>,action:()=>void)=>{
  if((event.target as HTMLElement).closest('button,a,select,input,textarea,[contenteditable="true"]'))return;
  action();
 };
 const activateBlockKey=(event:React.KeyboardEvent<HTMLElement>,action:()=>void)=>{
  if(event.target!==event.currentTarget)return;
  if(event.key==='Enter'||event.key===' '){event.preventDefault();action()}
 };
 const openWeek=(week:string)=>{setFilterWeek(week);setFilterStatus('Tous les statuts');setView('planning')};
 const openCalendarDay=(date:string)=>{
  setSelectedDate(date);
  if(window.matchMedia('(max-width:780px)').matches){
   window.requestAnimationFrame(()=>document.getElementById('studio-calendar-day-details')?.scrollIntoView({behavior:'smooth',block:'start'}));
  }
 };
 const goToWhatsApp=(stage:'1'|'2'|'3'|'4')=>{
  setSelectedWhatsappStage(stage);
  document.getElementById('studio-whatsapp-sequences')?.scrollIntoView({behavior:'smooth',block:'start'});
 };
 const weekDates=useMemo(()=>{const d=asDate(selectedDate);const day=(d.getDay()+6)%7;const monday=new Date(d);monday.setDate(d.getDate()-day);return Array.from({length:7},(_,i)=>{const x=new Date(monday);x.setDate(monday.getDate()+i);return x})},[selectedDate]);
 const selectedDayPosts=filtered.filter(p=>p.date===selectedDate);
 const pageMeta:{[key in View]:{title:string,subtitle:string,icon:React.ComponentType<{size?:number;strokeWidth?:number}>}}={
  overview:{title:'Votre studio éditorial',subtitle:'Pilotez vos contenus et transformez vos idées en publications.',icon:LayoutDashboard},
  planning:{title:'Programmation',subtitle:'Organisez et suivez chaque contenu avant publication.',icon:CalendarClock},
  calendar:{title:'Calendrier éditorial',subtitle:'Une vision claire de votre planning multicanal.',icon:CalendarDays},
  kanban:{title:'Kanban éditorial',subtitle:'Faites avancer les créations d’une étape à l’autre.',icon:Columns3},
  media:{title:'Médiathèque',subtitle:'Centralisez les visuels et ressources de vos marques.',icon:Images},
  editor:{title:'Éditeur de contenu',subtitle:'Affinez les textes et déclinaisons avant publication.',icon:PenSquare},
  video:{title:'Studio vidéo',subtitle:'Scripts, accroches, scènes et intentions de tournage.',icon:Video},
  campaigns:{title:'Campagnes éditoriales',subtitle:'Construisez des séquences cohérentes autour de vos objectifs.',icon:Megaphone},
  whatsapp:{title:'WhatsApp & présentations',subtitle:'Organisez l’accueil et la première présentation collective.',icon:WhatsappMark},
  insights:{title:'Analyses',subtitle:'Mesurez les étapes qui comptent vraiment.',icon:ChartNoAxesCombined},
  research:{title:'Veille concurrentielle & angles',subtitle:'Des observations vérifiables aux sujets réellement différenciants.',icon:Target},
  sources:{title:'Sources & veille',subtitle:'Références, preuves et inspirations documentées.',icon:Library},
  settings:{title:'Paramètres',subtitle:'Gérez votre espace et vos autorisations d’accès.',icon:Settings2}
 };
 const banner=pageMeta[view]; const BannerIcon=banner.icon;
 const research=raw.research;

 const workChip=(p:ContentPost)=><button type="button" className="post-chip" key={p.id} onClick={()=>openEditor(p)} title={'Éditer '+p.title}><span className={'chip-dot '+statusClass(p.status)}/><span>{clean(p.title,40)}</span><span className="chip-hour">{p.time}</span></button>;
 const PostCard=({p,compact=false}:{p:ContentPost;compact?:boolean})=><article
  className={'post-card navigable-block '+(compact?'post-card-compact':'')} key={p.id}
  role="link" tabIndex={0} aria-label={'Ouvrir le contenu '+p.title}
  onClick={()=>openEditor(p)} onKeyDown={e=>activateBlockKey(e,()=>openEditor(p))}>
   <div className="post-media"><div className={'post-media-glyph '+(p.type.toLowerCase().includes('video')?'video-tint':'')}><FileText size={compact?16:22}/></div></div>
   <div className="post-card-body"><strong className="post-card-title">{p.title}</strong><p>{clean(p.caption,compact?75:105)}</p><div className="card-meta"><Badge tone={statusClass(p.status)}>{normalizeStatus(p.status)}</Badge>{!compact&&<span>{shortDate(p.date)} · {p.time}</span>}</div></div>
   <ArrowUpRight className="post-card-arrow" aria-hidden size={16}/>
  </article>;
 const ToolbarFilters=()=> <div className="toolbar-filters"><div className="inline-search"><Search size={16}/><input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Rechercher un contenu..." aria-label="Rechercher un contenu"/></div><select aria-label="Statut" value={filterStatus} onChange={e=>setFilterStatus(e.target.value)}><option>Tous les statuts</option>{statuses.map(s=><option key={s}>{s}</option>)}</select><select aria-label="Canal" value={filterChannel} onChange={e=>setFilterChannel(e.target.value)}><option>Tous les canaux</option>{socialChannels.map(c=><option key={c}>{c}</option>)}</select><select aria-label="Semaine" value={filterWeek} onChange={e=>setFilterWeek(e.target.value)}><option>Toutes les semaines</option>{Array.from({length:8},(_,i)=><option key={i} value={'S'+(i+1)}>{'S'+(i+1)}</option>)}</select><span className="muted little">{filtered.length} contenus</span></div>;


 const authPanel:React.CSSProperties={minHeight:'100vh',display:'grid',placeItems:'center',background:'#f3f6ff',padding:'24px'};
 const authCard:React.CSSProperties={maxWidth:550,width:'100%',background:'#fff',borderRadius:20,padding:32,boxShadow:'0 12px 45px #1525561c',color:'#14204c'};
 if(!studioClient)return <main style={authPanel}><div style={authCard}><h1>Zenithis Content Studio</h1><h2>Base de données non configurée</h2><p>La sauvegarde locale a été désactivée pour ne plus annoncer de faux enregistrements. Ajoutez NEXT_PUBLIC_SUPABASE_URL et NEXT_PUBLIC_SUPABASE_ANON_KEY dans Vercel puis appliquez la migration SQL Supabase.</p><p>Le compte doit être autorisé dans studio_members. Les données restent protégées par RLS.</p></div></main>;
 if(authLoading)return <main style={authPanel}><div style={authCard}>Vérification de la session…</div></main>;
 if(!user)return <StudioLogin/>;
 if(onboardingMode)return <StudioOnboarding mode={onboardingMode}
  email={user.email||''} firstName={user.firstName||''} lastName={user.lastName||''}
  onComplete={()=>setOnboardingMode(null)}
 />;
 if(access&&access.allowedBrands.length===0)return <main style={authPanel}><div style={authCard}>
 <h1>Accès en attente</h1><p>Le compte <strong>{user.email}</strong> est authentifié, mais n’a accès à aucune marque.</p>
 <p>Demande au propriétaire de BONAS-INC, de LZO Empire ou au super-administrateur de t’autoriser depuis Paramètres → Accès aux marques.</p>
 <button type="button" className="btn btn-outline" onClick={()=>window.location.reload()}>Actualiser mes autorisations</button>
 <button type="button" className="btn btn-outline" style={{marginLeft:10}} onClick={()=>studioClient?.auth.signOut()}>Se déconnecter</button>
 </div></main>;
 if(!ready)return <main style={authPanel}><div style={authCard}><h2>Chargement des données</h2><p>{dbProblem||dbMessage}</p>
 {dbProblem&&<><p>Vérifiez les autorisations de marque dans Supabase pour le compte {user.email}.</p><button className="btn btn-outline" onClick={()=>studioClient?.auth.signOut()}>Changer de compte</button></>}
 </div></main>;
 return <div className="studio-shell" style={{'--brand-accent':info.color,'--brand-light':info.light} as React.CSSProperties}>
  <div className={'sync-indicator'+(dbProblem?' sync-indicator-error':'')} role="status" title={dbProblem||dbMessage}>
   <span className="sync-indicator-dot"/>
   <span className="sync-indicator-message">{dbProblem||dbMessage}</span>
   <span className="sync-indicator-short">{dbProblem?'Erreur de sauvegarde':dbMessage.toLowerCase().includes('cours')?'Synchronisation…':'Supabase actif'}</span>
  </div>
  <aside id="studio-mobile-drawer" aria-label="Modules du studio" className={'sidebar '+(mobileMenu?'sidebar-open':'')}>
    <div className="logo-row"><button type="button" className="logo-home-btn" aria-label="Retour à l’accueil" onClick={()=>{setView('overview');setMobileMenu(false)}}><span className="brand-mark"><Layers size={18} strokeWidth={3}/></span><span className="brand-text">Zenithis<span>Studio</span></span></button><IconButton className="mobile-dismiss" title="Fermer le menu" onClick={()=>setMobileMenu(false)}><X size={18}/></IconButton></div>
    <div className="sidebar-workspace" ref={brandMenuRef}>
     <div className="eyebrow">ESPACE DE TRAVAIL</div>
     {(access?.allowedBrands.length||0)>1?<>
       <button type="button" className={'workspace-switcher workspace-trigger'+(brandMenuOpen?' workspace-trigger-open':'')} aria-label="Choisir une marque" aria-haspopup="listbox" aria-expanded={brandMenuOpen} aria-controls="studio-brand-menu" onClick={()=>setBrandMenuOpen(v=>!v)}>
        <span className="workspace-initial">{info.initial}</span><span><b>{info.label}</b><small>{info.person}</small></span><ChevronDown className={'workspace-chevron'+(brandMenuOpen?' workspace-chevron-open':'')} size={17}/>
       </button>
       {brandMenuOpen&&<div className="workspace-dropdown" id="studio-brand-menu" role="listbox" aria-label="Marques autorisées">
        <div className="workspace-dropdown-heading">CHOISIR UN ESPACE</div>
        {access?.allowedBrands.map(id=>{
          const item=BRAND_INFO[id];const active=id===brand;
          return <button key={id} type="button" role="option" aria-selected={active} className={'workspace-option'+(active?' workspace-option-active':'')} onClick={()=>switchBrand(id)}>
           <span className="workspace-option-initial" style={{background:item.light,color:item.color}}>{item.initial}</span>
           <span className="workspace-option-copy"><strong>{item.label}</strong><small>{item.person}</small></span>
           {active&&<Check size={17} strokeWidth={2.7} className="workspace-option-check"/>}
          </button>;
        })}
        <div className="workspace-dropdown-foot"><Check size={13}/> Uniquement vos marques autorisées</div>
       </div>}
     </>:<div className="workspace-switcher workspace-static" aria-label={'Espace '+info.label}><span className="workspace-initial">{info.initial}</span><span><b>{info.label}</b><small>Votre espace exclusif</small></span><Check size={16}/></div>}
    </div>
    <div className="sidebar-label">WORKSPACE</div>
    <nav className="side-nav" aria-label="Navigation principale">{nav.map(([key,label,Icon])=><button type="button" onClick={()=>{setView(key);setMobileMenu(false);setSearch('')}} key={key} className={'nav-link '+(view===key?'nav-active':'')}><Icon size={19} strokeWidth={1.9}/><span>{label}</span>{key==='planning'&&<span className="nav-count">{stats.posts}</span>}</button>)}</nav>
    <div className="sidebar-bottom"><div className="sidebar-tip"><span><Sparkles size={16}/> CONSEIL DU STUDIO</span><p>Un bon contenu explique avant de convaincre.</p><button onClick={()=>setView('sources')}>Consulter les sources <ArrowRight size={14}/></button></div><div className="sidebar-foot"><span className="online-dot"/> Supabase · Accès sécurisés</div></div>
  </aside>
  {mobileMenu&&<div className="mobile-overlay" role="presentation" onClick={()=>setMobileMenu(false)}/>}
  <div className="app-column">
   <header className="topbar"><IconButton className="hamburger" title="Ouvrir les modules" onClick={()=>setMobileMenu(true)}><Menu size={23}/></IconButton>
   <div className="mobile-brand-head">
    <span className="mobile-brand-monogram" style={{color:info.color,background:info.light}}>{info.initial}</span>
    {(access?.allowedBrands.length||0)>1?
     <label className="mobile-brand-select-wrap"><span className="sr-only">Changer de marque</span>
      <select value={brand} onChange={e=>switchBrand(e.target.value as BrandId)} aria-label="Marque active">
       {access!.allowedBrands.map(id=><option key={id} value={id}>{BRAND_INFO[id].label}</option>)}
      </select><ChevronDown size={15} aria-hidden/>
     </label>:
     <strong className="mobile-brand-name">{info.label}</strong>}
   </div>
   <div className="global-search"><Search size={19}/><input value={search} onChange={e=>{setSearch(e.target.value);if(e.target.value.trim())setView('planning')}} aria-label="Recherche globale" placeholder="Rechercher un contenu, un projet, un mot-clé..."/><kbd>⌘ K</kbd></div><div className="topbar-actions"><span className="session-date"><CalendarDays size={15}/> Novembre 2026</span><IconButton onClick={exportBackup} title="Exporter une sauvegarde"><Download size={19}/></IconButton><span className="topbar-divider"/><div className="profile-menu-wrap" ref={profileMenuRef}>
 <button type="button" className={'profile profile-trigger'+(profileMenuOpen?' profile-trigger-open':'')} aria-haspopup="menu" aria-expanded={profileMenuOpen} aria-controls="studio-profile-menu"
  onClick={()=>{setBrandMenuOpen(false);setProfileMenuOpen(v=>!v)}}>
  <span className="avatar">{info.initial}</span><span><strong>{user.email?.split('@')[0]||info.person.split(' ')[0]}</strong>
  <small>{access?.isSuperadmin?'Super-administrateur':(access?.roles[brand]==='owner'?'Propriétaire · ':access?.roles[brand]==='viewer'?'Lecture seule · ':'Éditeur · ')+info.label}</small></span>
  <ChevronDown className={profileMenuOpen?'workspace-chevron-open':''} size={14}/>
 </button>
 {profileMenuOpen&&<div id="studio-profile-menu" className="profile-dropdown" role="menu" aria-label="Menu utilisateur">
  <div className="profile-dropdown-header"><strong>{user.email}</strong><small>{access?.isSuperadmin?'Super-administrateur':'Compte d’équipe'}</small></div>
  <button type="button" role="menuitem" onClick={()=>{setView('settings');setProfileMenuOpen(false)}}><Settings2 size={17}/> Paramètres et accès</button>
  <button type="button" role="menuitem" onClick={()=>{setProfileMenuOpen(false);void studioClient?.auth.signOut()}}><LogOut size={17}/> Se déconnecter</button>
 </div>}
 </div></div></header>
   <main className="workspace-main">
    <section className="hero"><div><div className="hero-eyebrow"><Sparkles size={15}/> STUDIO DE PUBLICATION</div><h1><BannerIcon size={31}/> {banner.title}</h1><p>{banner.subtitle}</p></div><div className="hero-illustration" aria-hidden="true"><div className="hero-orbit orbit-one"/><div className="hero-orbit orbit-two"/><div className="hero-card card-back"><span>APR</span><b>24</b><i/></div><div className="hero-card card-front"><span>STUDIO</span><b>✦</b><div className="hero-wave"/></div></div><span className="hero-signature">Vos idées méritent<br/>d’aller plus loin.</span></section>
    {view!=='editor'&&<div className="section-toolbar"><div className="brand-banner"><span className="brand-banner-mark">{info.initial}</span><span><strong>{info.label}</strong><small>{raw.config.tagline}</small></span></div><div className="toolbar-buttons"><button className="btn btn-ghost" onClick={exportBackup}><Download size={16}/> Sauvegarder</button><button className="btn btn-primary" onClick={()=>setNewModal(true)}><Plus size={17}/> Nouveau contenu</button></div></div>}

    {view==='overview'&&<>
     <section className="metrics-grid">
      {[
        {label:'Contenus planifiés',n:stats.posts,desc:'Sur 8 semaines',icon:FileText,tone:'indigo',target:'planning'},
        {label:'Déclinaisons réseaux',n:stats.variants,desc:'Multi-canaux',icon:Layers,tone:'blue',target:'editor'},
        {label:'Scripts vidéo',n:stats.videos,desc:'Prêts à tourner',icon:Play,tone:'purple',target:'video'},
        {label:'Publications réalisées',n:stats.published,desc:`${stats.scheduled} programmées`,icon:CheckCheck,tone:'mint',target:'planning'},
        {label:'Conversations qualifiées',n:ws.metrics.qualified,desc:'Saisie manuelle',icon:WhatsappMark,tone:'orange',target:'insights'}
       ].map(m=><button type="button" className="metric-card navigable-block" key={m.label}
          onClick={()=>{
             if(m.label==='Publications réalisées')setFilterStatus('Publié');else setFilterStatus('Tous les statuts');
             if(m.label==='Déclinaisons réseaux'){setSelectedPostId(allPosts[0]?.id||'');setEditTab('declinaisons')}
             setView(m.target as View);
          }}
          aria-label={'Ouvrir '+m.label}>
          <div className="metric-top"><span>{m.label}</span><span className={'metric-icon '+m.tone}><m.icon size={20}/></span></div>
          <strong>{m.n.toLocaleString('fr-FR')}</strong><div className="metric-note"><span className="tiny-dot"/>{m.desc}</div>
       </button>)}
     </section>
     <section className="overview-grid"><div className="overview-primary">
      <div className="panel panel-no-padding"><div className="panel-header padded"><div><h2>Prochaines publications</h2><p>Votre file éditoriale, en un coup d’œil.</p></div><button className="text-link" onClick={()=>setView('planning')}>Tout voir <ArrowUpRight size={16}/></button></div><div className="table-scroll"><table className="content-table"><thead><tr><th>Contenu</th><th>Canaux</th><th>Date & heure</th><th>Statut</th><th></th></tr></thead><tbody>{upcoming.map(p=><tr key={p.id} tabIndex={0} className="navigable-table-row" title={'Ouvrir '+p.title}
 onClick={e=>activateBlock(e,()=>openEditor(p))}
 onKeyDown={e=>activateBlockKey(e,()=>openEditor(p))}><td><button onClick={()=>openEditor(p)} className="row-title">{p.title}</button><small>{clean(p.caption,62)}</small></td><td><div className="channel-row">{p.channels.slice(0,4).map((c,i)=><Channel key={i} name={c} small/>)}</div></td><td><div className="cell-date">{shortDate(p.date)}<small>{p.time}</small></div></td><td><Badge tone={statusClass(p.status)}>{normalizeStatus(p.status)}</Badge></td><td><IconButton onClick={()=>openEditor(p)}><ChevronRight size={17}/></IconButton></td></tr>)}</tbody></table></div></div>
      <div className="lower-grid"><div className="panel"><div className="panel-header"><div><h2>Progression éditoriale</h2><p>Contenus par étape</p></div><button className="text-link" onClick={()=>setView('kanban')}>Kanban <ArrowUpRight size={15}/></button></div><div className="pipeline-bars">{pipeline.map(s=><button key={s.name} onClick={()=>{setFilterStatus(s.name);setView('planning')}} className="pipeline-line"><span>{s.name}</span><div className="track"><span className={'fill '+statusClass(s.name)} style={{width:`${Math.max(3,s.count/Math.max(1,stats.posts)*100)}%`}}/></div><strong>{s.count}</strong></button>)}</div></div><div className="panel"><div className="panel-header"><div><h2>Cadence de production</h2><p>8 semaines de contenu</p></div><Badge tone="blue">S1 — S8</Badge></div><div className="chart-bars">{countsByWeek.map(w=><button type="button" title={'Voir les publications de '+w.week}
 onClick={()=>openWeek(w.week)} key={w.week} className="chart-col navigable-block"><div className="bar-track"><div className="bar-primary" style={{height:`${Math.max(w.planned*8,8)}%`}}/><div className="bar-secondary" style={{height:`${Math.max(w.published*8,0)}%`}}/></div><span>{w.week}</span></button>)}</div><div className="chart-legend"><span><i className="blue-dot"/> Prévus</span><span><i className="green-dot"/> Publiés</span></div></div></div>
     </div><div className="overview-aside"><div className="panel"><div className="panel-header"><div><h2>Focus de la semaine</h2><p>{info.label}</p></div><span className="focus-symbol"><Target size={21}/></span></div><div className="focus-card navigable-block" role="link" tabIndex={0}
 onClick={e=>activateBlock(e,()=>setView('campaigns'))}
 onKeyDown={e=>activateBlockKey(e,()=>setView('campaigns'))}>
 <div className="focus-small">TERRITOIRE ÉDITORIAL</div><h3>{raw.config.tagline}</h3><p>Créer une relation de confiance et inviter à la première présentation du modèle.</p><button onClick={()=>setView('campaigns')}>Voir le programme <ArrowRight size={15}/></button></div><div className="step-flow">
 <button type="button" onClick={()=>setView('planning')}><span>01</span> Contenu social <ArrowUpRight size={14}/></button>
 <button type="button" onClick={()=>{setView('whatsapp');setSelectedWhatsappStage('1')}}><span>02</span> Conversation privée <ArrowUpRight size={14}/></button>
 <button type="button" onClick={()=>{setView('whatsapp');setSelectedWhatsappStage('2')}}><span>03</span> <SiWhatsapp size={15} style={{color:'#25d366'}}/> Groupe WhatsApp <ArrowUpRight size={14}/></button>
 <button type="button" onClick={()=>{setView('whatsapp');setSelectedWhatsappStage('3')}}><span>04</span> Présentation <ArrowUpRight size={14}/></button>
 </div></div><div className="panel"><div className="panel-header"><div><h2>Accès rapide</h2><p>Votre espace de production</p></div></div><div className="quick-actions">{[['Calendrier',CalendarDays,'calendar'],['Scripts vidéo',Video,'video'],['Médiathèque',Images,'media'],['WhatsApp',WhatsappMark,'whatsapp']].map(([label,Icon,target])=><button key={String(target)} onClick={()=>setView(target as View)}>{React.createElement(Icon as React.ComponentType<{size:number}>,{size:20})}<span>{label as string}</span><ChevronRight size={15}/></button>)}</div></div></div></section>
    </>}

    {view==='planning'&&<section className="panel panel-no-padding"><div className="panel-header padded"><div><h2>File de programmation</h2><p>Planifier, réviser et marquer vos contenus comme publiés.</p></div><Badge tone="blue">{filtered.length} publications</Badge></div><div className="padded filter-line">{ToolbarFilters()}</div><div className="table-scroll"><table className="content-table detailed-table"><thead><tr><th>Contenu</th><th>Réseaux</th><th>Date</th><th>Étape</th><th>Statut</th><th>Action</th></tr></thead><tbody>{filtered.map(p=><tr key={p.id} tabIndex={0} className="navigable-table-row" title={'Ouvrir '+p.title}
 onClick={e=>activateBlock(e,()=>openEditor(p))}
 onKeyDown={e=>activateBlockKey(e,()=>openEditor(p))}><td><button className="row-title" onClick={()=>openEditor(p)}>{p.title}</button><small>{clean(p.caption,95)}</small></td><td><div className="channel-row">{p.channels.slice(0,5).map((c,i)=><Channel key={i} name={c} small/>)}</div></td><td className="nowrap">{shortDate(p.date)} · {p.time}</td><td><span className="muted">{p.stage}</span></td><td><Badge tone={statusClass(p.status)}>{normalizeStatus(p.status)}</Badge></td><td><div className="row-actions"><button title="Éditer" onClick={()=>openEditor(p)}><Pencil size={15}/></button><button title="Programmer dans le planning local" onClick={()=>updatePost(p.id,{status:'Programmé'})}><CalendarCheck size={15}/></button><button title="Marquer publié (aucune publication externe)" onClick={()=>updatePost(p.id,{status:'Publié'})}><Check size={15}/></button></div></td></tr>)}</tbody></table></div>{filtered.length===0&&<div className="empty">Aucun contenu pour ces filtres.</div>}</section>}

    {view==='calendar'&&<section className="calendar-layout"><div className="panel calendar-main"><div className="calendar-head"><div className="calendar-title"><h2>{monthLabel(calendarMonth)}</h2><span>{allPosts.filter(p=>p.date.slice(0,7)===isoDate(calendarMonth).slice(0,7)).length} contenus</span></div><div className="calendar-actions"><div className="segmented"><button className={calendarMode==='Mois'?'on':''} onClick={()=>setCalendarMode('Mois')}>Mois</button><button className={calendarMode==='Semaine'?'on':''} onClick={()=>setCalendarMode('Semaine')}>Semaine</button><button className={calendarMode==='Agenda'?'on':''} onClick={()=>setCalendarMode('Agenda')}>Agenda</button></div><IconButton onClick={()=>setCalendarMonth(new Date(calendarMonth.getFullYear(),calendarMonth.getMonth()-1,1))}><ChevronLeft size={17}/></IconButton><IconButton onClick={()=>setCalendarMonth(new Date(calendarMonth.getFullYear(),calendarMonth.getMonth()+1,1))}><ChevronRight size={17}/></IconButton></div></div>
      {calendarMode==='Mois'?<div className="month-view"><div className="weekday-row">{dayNames.map(x=><div key={x}>{x}</div>)}</div><div className="month-grid">{monthGrid(calendarMonth).map((d,i)=>{const iso=isoDate(d);const posts=filtered.filter(x=>x.date===iso);return <button key={iso+'-'+i} type="button" onClick={()=>openCalendarDay(iso)} className={'day-cell '+(d.getMonth()!==calendarMonth.getMonth()?'out-month ':'')+(iso===selectedDate?'chosen-day ':'')}><span className="day-num">{d.getDate()}</span><div className="day-content">{posts.slice(0,3).map(p=><span title={p.title} key={p.id} className={'calendar-event '+statusClass(p.status)}>{clean(p.title,24)}</span>)}{posts.length>3&&<span className="more-events">+{posts.length-3} autres</span>}</div></button>})}</div></div>:calendarMode==='Semaine'?<div className="week-view"><div className="weekday-row">{weekDates.map(d=><button className={isoDate(d)===selectedDate?'selected-weekday':''} onClick={()=>openCalendarDay(isoDate(d))} key={isoDate(d)}>{dayNames[(d.getDay()+6)%7]} {d.getDate()}</button>)}</div><div className="week-columns">{weekDates.map(d=><div key={isoDate(d)} className="week-column">{filtered.filter(p=>p.date===isoDate(d)).map(p=>workChip(p))}</div>)}</div></div>:<div className="agenda-view" aria-label="Publications du mois">
  {filtered.filter(p=>p.date.slice(0,7)===isoDate(calendarMonth).slice(0,7)).length===0?
   <div className="agenda-empty"><CalendarDays size={28}/><strong>Aucune publication ce mois-ci</strong><span>Changez de mois ou ajoutez un contenu au planning.</span></div>:
   Array.from(new Set(filtered.filter(p=>p.date.slice(0,7)===isoDate(calendarMonth).slice(0,7)).map(p=>p.date)))
    .sort().map(day=><section className="agenda-day" key={day}>
     <div className="agenda-day-header"><span>{new Date(day+'T12:00:00').toLocaleDateString('fr-FR',{weekday:'long',day:'numeric',month:'long'})}</span><small>{filtered.filter(p=>p.date===day).length} contenu(s)</small></div>
     {filtered.filter(p=>p.date===day).map(p=><button type="button" key={p.id} className="agenda-item"
       onClick={()=>openEditor(p)} aria-label={'Modifier '+p.title}>
       <span className={'agenda-time '+statusClass(p.status)}>{p.time||'—'}</span>
       <span className="agenda-copy"><strong>{p.title}</strong><small>{p.channels.slice(0,2).join(' · ')||p.type}</small></span>
       <ChevronRight size={19}/></button>)}
    </section>)
  }
 </div>}
     </div><aside id="studio-calendar-day-details" className="panel day-sidebar"><div className="panel-header"><div><h2>{longDate(selectedDate)}</h2><p>Publications du jour</p></div><Badge tone="blue">{selectedDayPosts.length}</Badge></div>{selectedDayPosts.length?selectedDayPosts.map(p=><PostCard key={p.id} p={p} compact/>):<div className="empty-day"><CalendarDays size={29}/><p>Aucun contenu à cette date.</p></div>}<button className="btn btn-outline full-btn" onClick={()=>{addPost();setEditorDraft({date:selectedDate})}}><Plus size={16}/> Ajouter un contenu</button><div className="tip-note"><Info size={16}/> Ces dates pilotent le planning interne ; aucune publication automatique n’est déclenchée.</div></aside></section>}

    {view==='kanban'&&<><div className="panel kanban-help"><div className="panel-header"><div><h2>Production de contenu</h2><p>Glissez une carte vers une autre colonne ou utilisez son sélecteur de statut.</p></div><Badge tone="purple">{stats.posts} cartes</Badge></div>{ToolbarFilters()}</div><section className="kanban-board">{statuses.map(s=>{const cards=filtered.filter(p=>normalizeStatus(p.status)===s);return <div className="kanban-column" key={s} onDragOver={e=>e.preventDefault()} onDrop={e=>{e.preventDefault();if(kanbanFilter)updatePost(kanbanFilter,{status:s});setKanbanFilter('')}}><header><span className={'kanban-bubble '+statusClass(s)}/><strong>{s}</strong><em>{cards.length}</em></header><div className="kanban-cards">{cards.map(p=><article draggable onDragStart={()=>setKanbanFilter(p.id)} onDragEnd={()=>setKanbanFilter('')}
 role="link" tabIndex={0} aria-label={'Ouvrir le contenu '+p.title}
 onClick={e=>activateBlock(e,()=>{if(!kanbanFilter)openEditor(p)})}
 onKeyDown={e=>activateBlockKey(e,()=>openEditor(p))}
 className="kanban-card navigable-block" key={p.id}><div className="kanban-type"><span>{labelForType(p.type)}</span><GripIcon/></div><strong className="kanban-title">{p.title}</strong><p>{clean(p.caption,90)}</p><div className="channel-row">{p.channels.slice(0,3).map((c,i)=><Channel key={i} name={c} small/>)}</div><footer><span><CalendarDays size={13}/>{shortDate(p.date)}</span><select title="Changer le statut" value={normalizeStatus(p.status)} onChange={e=>updatePost(p.id,{status:e.target.value})}>{statuses.map(ss=><option key={ss}>{ss}</option>)}</select></footer></article>)}</div></div>})}</section></>}

    {view==='media'&&<><div className="panel media-toolbar"><div className="panel-header"><div><h2>Bibliothèque des supports</h2><p>Images de campagne et créations disponibles dans votre espace sécurisé.</p></div><div className="toolbar-buttons"><input ref={fileInput} type="file" accept="image/*" style={{display:'none'}} onChange={e=>mediaUpload(e.target.files?.[0])}/><button className="btn btn-primary" onClick={()=>fileInput.current?.click()}><Plus size={16}/> Ajouter une image</button></div></div><div className="pill-tabs">{['Tous','Image','Vidéo','Document'].map(x=><button onClick={()=>setMediaFilter(x)} className={mediaFilter===x?'active':''} key={x}>{x}</button>)}</div></div><div className="media-layout"><div className="media-grid">{ws.media.filter(x=>mediaFilter==='Tous'||x.kind===mediaFilter).map(m=><button key={m.id} className={'asset-card '+(selectedMediaId===m.id?'asset-selected':'')} onClick={()=>setSelectedMediaId(m.id)}><div className="asset-image">{m.kind==='Image'?<img src={m.src} alt={m.name}/>:<FileVideo size={36}/>}</div><div className="asset-caption"><strong>{m.name}</strong><span>{m.format} <MoreHorizontal size={15}/></span></div></button>)}</div><aside id="mobile-media-details" className={"panel asset-details"+(selectedMedia?" asset-details-open":"")}><div className="panel-header"><h2>Détails du média</h2><IconButton onClick={()=>setSelectedMediaId('')}><X size={16}/></IconButton></div>{selectedMedia?<><div className="asset-large"><img src={selectedMedia.src} alt={selectedMedia.name}/></div><h3>{selectedMedia.name}</h3><p className="muted">{selectedMedia.note||'Ressource de création'}</p><div className="detail-line"><span>Type</span><strong>{selectedMedia.kind}</strong></div><div className="detail-line"><span>Format</span><strong>{selectedMedia.format}</strong></div><div className="detail-line"><span>Date</span><strong>{selectedMedia.created}</strong></div><div className="detail-line"><span>Marque</span><strong>{info.label}</strong></div><a className="btn btn-primary full-btn" href={selectedMedia.src} download={selectedMedia.name}><Download size={15}/> Télécharger</a></>:<div className="empty-day"><Images size={30}/><p>Sélectionnez un média pour afficher ses informations.</p></div>}</aside></div></>}

    {view==='editor'&&<div className="editor-page"><div className="editor-top"><div><h2>Éditeur de contenu</h2><p>Rédigez, adaptez et enregistrez votre contenu dans le studio.</p></div><div className="toolbar-buttons"><button className="btn btn-outline" onClick={()=>setView('planning')}><ChevronLeft size={16}/> Retour au planning</button><button className="btn btn-primary" disabled={!selectedPost} onClick={()=>{if(selectedPost)updatePost(selectedPost.id,editorDraft);setEditorDraft({})}}><Check size={17}/> Enregistrer</button></div></div><div className="editor-layout"><aside className="panel editor-list"><h3>Contenus</h3><div className="inline-search"><Search size={15}/><input placeholder="Rechercher..." value={search} onChange={e=>setSearch(e.target.value)}/></div><div className="editor-post-list">{filtered.slice(0,80).map(p=><button key={p.id} className={selectedPost?.id===p.id?'selected':''} onClick={()=>{setSelectedPostId(p.id);setEditorDraft({});setEditTab('contenu');setVariantId('')}}><span>{clean(p.title,55)}</span><small>{shortDate(p.date)} · {labelForType(p.type)}</small></button>)}</div></aside><section className="panel editor-workspace">{selectedPost?<><div className="editor-tabs"><button className={editTab==='contenu'?'active':''} onClick={()=>setEditTab('contenu')}>Contenu maître</button><button className={editTab==='declinaisons'?'active':''} onClick={()=>setEditTab('declinaisons')}>Déclinaisons ({currentVariants.length})</button></div>{editTab==='contenu'?<><label className="field">Titre du contenu<input value={editorDraft.title??selectedPost.title} onChange={e=>setEditorDraft(d=>({...d,title:e.target.value}))}/></label><div className="two-fields"><label className="field">Date<input type="date" value={editorDraft.date??selectedPost.date} onChange={e=>setEditorDraft(d=>({...d,date:e.target.value}))}/></label><label className="field">Heure<input type="time" value={editorDraft.time??selectedPost.time} onChange={e=>setEditorDraft(d=>({...d,time:e.target.value}))}/></label></div><label className="field">Texte principal<textarea rows={12} value={editorDraft.caption??selectedPost.caption} onChange={e=>setEditorDraft(d=>({...d,caption:e.target.value}))}/></label><label className="field">Appel à l’action<input value={editorDraft.cta??selectedPost.cta} onChange={e=>setEditorDraft(d=>({...d,cta:e.target.value}))}/></label><label className="field">Hashtags<textarea rows={2} value={editorDraft.hashtags??selectedPost.hashtags} onChange={e=>setEditorDraft(d=>({...d,hashtags:e.target.value}))}/></label><div className="two-fields"><label className="field">Étape<select value={editorDraft.status??normalizeStatus(selectedPost.status)} onChange={e=>setEditorDraft(d=>({...d,status:e.target.value}))}>{statuses.map(s=><option key={s}>{s}</option>)}</select></label><label className="field">Canaux<input value={(editorDraft.channels??selectedPost.channels).join(', ')} onChange={e=>setEditorDraft(d=>({...d,channels:e.target.value.split(',').map(x=>x.trim()).filter(Boolean)}))}/></label></div><div className="editor-footer"><button className="btn btn-outline" onClick={()=>copyText((editorDraft.caption??selectedPost.caption)+'\n'+(editorDraft.hashtags??selectedPost.hashtags))}><Copy size={16}/> Copier la légende</button><button className="btn btn-primary" onClick={()=>{updatePost(selectedPost.id,editorDraft);setEditorDraft({})}}>Enregistrer les modifications <Check size={16}/></button></div></>:<><div className="variant-tabs">{currentVariants.length===0?<p>Aucune déclinaison pour ce contenu.</p>:currentVariants.map(v=><button className={(chosenVariant?.id===v.id)?'active':''} onClick={()=>{setVariantId(v.id);setVariantDraft({})}} key={v.id}><Channel name={v.channel} small/>{v.channel}</button>)}</div>{chosenVariant&&<><label className="field">Accroche<input value={variantDraft.hook??chosenVariant.hook} onChange={e=>setVariantDraft(d=>({...d,hook:e.target.value}))}/></label><label className="field">Texte adapté à {chosenVariant.channel}<textarea rows={12} value={variantDraft.caption??chosenVariant.caption} onChange={e=>setVariantDraft(d=>({...d,caption:e.target.value}))}/></label><label className="field">CTA<input value={variantDraft.cta??chosenVariant.cta} onChange={e=>setVariantDraft(d=>({...d,cta:e.target.value}))}/></label><div className="editor-footer"><button className="btn btn-outline" onClick={()=>copyText((variantDraft.caption??chosenVariant.caption)+'\n'+chosenVariant.hashtags)}><Copy size={16}/> Copier</button><button className="btn btn-primary" onClick={()=>{updateVariant(chosenVariant.id,variantDraft);setVariantDraft({})}}>Enregistrer la déclinaison</button></div></>}</>}</>:<div className="empty-day"><PenSquare size={32}/><p>Choisissez un contenu sur la gauche pour l’éditer.</p></div>}</section><aside className="panel editor-side"><h3>Assistant de production</h3><div className="editor-assist-intro"><Sparkles size={21}/><strong>Checklist éditoriale</strong><p>Chaque publication doit être utile et fidèle au modèle réel.</p></div>{['Accroche compréhensible en 3 secondes','Une seule idée principale','Aucun revenu garanti ni preuve inventée','CTA simple vers WhatsApp','Adaptation selon le réseau','Vérification des faits avant publication'].map(x=><label className="check-line" key={x}><input type="checkbox"/> {x}</label>)}<div className="editor-side-note"><Info size={16}/> Les suggestions IA automatiques et la publication directe nécessitent des services connectés. Elles ne sont pas actives dans cette V1.</div></aside></div></div>}

    {view==='video'&&<div className="video-layout"><section className="panel script-list"><div className="panel-header"><div><h2>Scénarios prêts à tourner</h2><p>{raw.scripts.length} scripts développés pour {info.person.split(' ')[0]} · 1:40–2:00</p></div></div><div className="script-cards">{raw.scripts.map((s:Script)=><button className={'script-card '+(selectedScript===s.id?'selected':'')} key={s.id} onClick={()=>{
  setSelectedScript(s.id);
  if(window.matchMedia('(max-width:780px)').matches){
   window.requestAnimationFrame(()=>document.getElementById('studio-script-detail')?.scrollIntoView({behavior:'smooth',block:'start'}));
  }
 }}><span className="script-number">{s.id.slice(-3)}</span><span><strong>{clean(s.hook,80)}</strong><small>{shortDate(s.date)} · {s.duration||'Vidéo courte'} · {s.angle||'Face caméra'}</small></span><ChevronRight size={16}/></button>)}</div></section><section id="studio-script-detail" className="panel script-detail">{(()=>{const s=raw.scripts.find((x:Script)=>x.id===selectedScript)||raw.scripts[0];if(!s)return null;return <><div className="script-hero"><Badge tone="blue">Scénario · {s.week}</Badge><Badge tone="purple">{s.duration}</Badge><h2>{s.hook}</h2><p>{s.angle||s.role}</p></div><div className="script-toolbox"><div className="script-toolbox-title"><span><Video size={18}/> Texte intégral à dire</span><button className="btn btn-primary" onClick={()=>copyText(s.spoken||[s.hook,s.tension,s.story,s.realism,s.cta].join('\n\n'))}><Copy size={15}/> Copier toute la narration</button></div><p className="script-voiceover">{s.spoken||[s.hook,s.tension,s.story,s.realism,s.cta].join('\n\n')}</p></div><div className="panel-subhead"><h3>Storyboard · {s.scenes?.length||'6'} scènes</h3><p>Chaque plan précise ce qui est dit, filmé et affiché à l’écran.</p></div><div className="scenes-stack">{s.scenes?.map((scene,index)=><article className="scene-card" key={index}><div className="scene-index"><span>{String(index+1).padStart(2,'0')}</span><strong>{scene.time}</strong></div><div><h4>{scene.scene}</h4><div className="scene-speech">« {scene.spoken} »</div><div className="scene-columns"><span><b>ÉCRAN</b>{scene.onScreen}</span><span><b>PLAN / DÉTAIL</b>{scene.shot}</span></div></div><button className="script-copy" onClick={()=>copyText(scene.spoken)} title="Copier les paroles"><Copy size={16}/></button></article>)}</div><div className="script-two-col"><div className="script-panel"><h3>Variantes d’accroche</h3>{(s.hookAlternatives||[]).map((h,i)=><button className="hook-alt" key={i} onClick={()=>copyText(h)}><span>{i+1}</span><strong>{h}</strong><Copy size={14}/></button>)}</div><div className="script-panel"><h3>Versions par réseau</h3>{Object.entries(s.platformCuts||{}).map(([channel,note])=><div className="script-cut" key={channel}><strong>{channel}</strong><p>{note}</p></div>)}</div></div><div className="script-panel"><h3>Production, son & vérifications</h3>{[['Direction',s.direction],['Son / montage',s.sound],['Matériel & couverture',s.asset],['Détails à confirmer',s.proofNeeded||s.compliance]].map(([label,txt])=><div className="detail-line" key={label}><span>{label}</span><strong>{txt}</strong></div>)}</div><div className="script-panel"><h3>Références vérifiables</h3><div className="source-chips">{(s.referenceIds||s.sources.split(',').map(x=>x.trim())).map((id,i)=>{const src=raw.sources.find(x=>x.id===id);return src?.url?.startsWith('http')?<a target="_blank" rel="noopener noreferrer" href={src.url} key={i}>{src.name}<ExternalLink size={12}/></a>:<span key={i}>{src?.name||id}</span>})}</div></div><div className="editor-footer"><button className="btn btn-outline" onClick={()=>copyText(s.postCaption||s.story)}><Copy size={16}/> Copier la légende</button><button className="btn btn-primary" onClick={()=>copyText(s.spoken||s.timeline)}><Copy size={16}/> Copier le script complet</button></div></>})()}</section></div>}

    {view==='campaigns'&&<><div className="campaign-intro panel"><div><Badge tone="purple">CAMPAGNE ÉDITORIALE · 8 SEMAINES</Badge><h2>{raw.config.tagline}</h2><p>Un parcours de contenus réguliers, de la découverte à la première présentation collective. Le tableau correspond au planning éditorial : aucune campagne publicitaire Meta n'est modifiée ici.</p></div><div className="campaign-stats"><span><b>{stats.posts}</b> publications</span><span><b>{stats.variants}</b> déclinaisons</span><button type="button" className="campaign-whatsapp-link" onClick={()=>setView('whatsapp')}><SiWhatsapp size={16} style={{color:'#25d366'}}/> <b>{raw.events.length}</b> séquences WhatsApp <ArrowUpRight size={14}/></button></div></div><div className="campaign-weeks">{countsByWeek.map(w=><div key={w.week} className="panel campaign-week navigable-block" role="link" tabIndex={0}
 aria-label={'Voir les publications de la semaine '+w.week}
 onClick={e=>activateBlock(e,()=>openWeek(w.week))}
 onKeyDown={e=>activateBlockKey(e,()=>openWeek(w.week))}>
 <div className="campaign-week-head"><Badge tone="blue">{w.week}</Badge><strong>{w.planned} contenus</strong></div><h3>{w.week==='S1'?'Faire connaissance':w.week==='S2'?'Faire émerger les questions':w.week==='S3'?'Éduquer sans promesses':w.week==='S4'?'Explorer les objections':w.week==='S5'?'Présenter les étapes':w.week==='S6'?'Bâtir la confiance':w.week==='S7'?'Inviter à découvrir':'Consolider la communauté'}</h3><div className="campaign-week-items">{allPosts.filter(p=>p.week===w.week).sort(byDate).slice(0,5).map(p=><button onClick={()=>openEditor(p)} key={p.id}><span className="tiny-dot"/>{clean(p.title,50)}<ArrowUpRight size={14}/></button>)}</div><button className="text-link" onClick={()=>openWeek(w.week)}>Ouvrir les contenus <ArrowRight size={14}/></button></div>)}</div></>}

    {view==='whatsapp'&&<>
     <TeloPraPanel key={brand} brand={brand} canManage={canManage(brand)} canEdit={canEdit(brand)}/>
     <div className="funnel-grid" aria-label="Parcours WhatsApp">
      {[
       {id:'1' as const,title:'Conversation privée',Icon:WhatsappMark},
       {id:'2' as const,title:'Groupe commun',Icon:WhatsappMark},
       {id:'3' as const,title:'Présentation collective',Icon:CalendarCheck},
       {id:'4' as const,title:'Suite avec la coach',Icon:UserRound}
      ].map(({id,title,Icon})=><button type="button" className={'panel funnel-card navigable-block '+(selectedWhatsappStage===id?'funnel-card-active':'')}
        key={id} aria-pressed={selectedWhatsappStage===id} aria-label={'Voir les messages : '+title}
        onClick={()=>goToWhatsApp(id)}>
        <span>{id}</span><Icon size={28}/><strong>{title}</strong><ArrowRight className="funnel-arrow" size={15}/>
      </button>)}
     </div>

     <section className="panel closer-panel" aria-label="Bibliothèque commerciale WhatsApp">
      <div className="panel-header"><div><h2>Closer 2.0 · Réponses rapides</h2>
       <p>{closerStageNames[selectedWhatsappStage]} · {info.label} · Chaque texte est distinct et s'adapte à un signal précis.</p>
      </div><Badge tone="mint">{closingPlaybooks[brand].filter(m=>m.step===selectedWhatsappStage).length} situations</Badge></div>
      <div className="closer-guidance"><Sparkles size={17}/>
       <p>Créer l'envie de découvrir un autre avenir, puis aider à évaluer l'activité sans pression. Envoyer manuellement après avoir compris le besoin; ne pas masquer les coûts, le travail ni les risques.</p>
      </div>
      <div className="closer-grid">
       {closingPlaybooks[brand].filter(m=>m.step===selectedWhatsappStage).map(m=><article className="closer-card" key={m.id}>
        <div className="closer-card-heading"><span className="closer-keyword">{m.keyword}</span><h3>{m.title}</h3></div>
        <p className="closer-trigger"><Target size={14}/> {m.trigger}</p>
        <p className="closer-copy">{m.message}</p>
        <div className="closer-card-footer"><span><ArrowRight size={15}/>{m.nextAction}</span>
         <button className="btn btn-outline" type="button" onClick={()=>copyText(m.message)}><Copy size={15}/> Copier</button>
        </div>
       </article>)}
      </div>
     </section>
     {selectedWhatsappStage!=='1'&&<div className="panel" id="studio-whatsapp-sequences">
      <div className="panel-header">
       <div><h2>Messages spécifiques aux présentations</h2><p>{selectedWhatsappStage==='2'?'Messages d’invitation au groupe':selectedWhatsappStage==='3'?'Rappels pour les présentations collectives':'Messages de suivi après les présentations'}</p></div>
       {raw.config.whatsapp?.startsWith('https://')?
        <a href={raw.config.whatsapp} target="_blank" rel="noopener noreferrer" className="btn btn-whatsapp"><SiWhatsapp size={19}/> Ouvrir WhatsApp <ExternalLink size={13}/></a>:
        <button type="button" className="btn btn-whatsapp" onClick={()=>notify('Aucun lien WhatsApp n’est renseigné pour cette marque','warning')}><SiWhatsapp size={19}/> Lien WhatsApp manquant</button>}
      </div>
      <div className="event-grid">
       {raw.events.map((evt:GroupEvent)=>{
        const msg=selectedWhatsappStage==='1'?(evt.greeting||evt.invitation):selectedWhatsappStage==='2'?evt.invitation:selectedWhatsappStage==='3'?evt.reminder:evt.followUp;
        const label=selectedWhatsappStage==='1'?'MESSAGE D’ACCUEIL':selectedWhatsappStage==='2'?'MESSAGE D’INVITATION':selectedWhatsappStage==='3'?'RAPPEL DE PRÉSENTATION':'MESSAGE DE SUIVI';
        const expanded=selectedEventId===evt.id;
        return <article className={'event-card navigable-block '+(expanded?'event-card-active':'')} key={evt.id}
          role="button" tabIndex={0} aria-expanded={expanded} aria-label={'Afficher la séquence '+evt.theme}
          onClick={e=>activateBlock(e,()=>setSelectedEventId(expanded?'':evt.id))}
          onKeyDown={e=>activateBlockKey(e,()=>setSelectedEventId(expanded?'':evt.id))}>
          <div className="event-head"><Badge tone="blue">{evt.week}</Badge><span>{shortDate(evt.date)}</span><ChevronDown size={17} className={expanded?'workspace-chevron-open':''}/></div>
          <h3>{evt.theme}</h3>
          <div className="event-message"><span>{label}</span><p>{expanded?msg:clean(msg,280)}</p></div>
          {expanded&&<div className="event-expanded"><strong>Suite du parcours</strong><p>{evt.flow||evt.condition||'Adapter le message et assurer le suivi personnalisé.'}</p><small>Copiez les messages avec les commandes ci-dessous.</small></div>}
          <div className="event-controls">
           <button onClick={()=>copyText(evt.invitation)}><Copy size={15}/> Invitation</button>
           <button onClick={()=>copyText(evt.reminder)}><Clock3 size={15}/> Rappel</button>
           <button onClick={()=>copyText(evt.followUp)}><Send size={15}/> Suivi</button>
          </div>
         </article>;
       })}
      </div>
     </div>}
     <div className="panel whatsapp-disclaimer"><Info size={18}/><p>Les messages sont préparés pour un envoi manuel. Les tarifs, témoignages et conditions commerciales doivent être vérifiés avant communication.</p></div>
    </>}

    {view==='insights'&&<><div className="metrics-grid insights-metrics">{[['Messages reçus','messages',MessageCircle],['Conversations qualifiées','qualified',BadgeCheck],['Inscriptions','registrations',CalendarCheck],['Participants','attendees',Users]].map(([label,key,Icon])=><div className="metric-card metric-input" key={String(key)}><div className="metric-top"><span>{label as string}</span>{React.createElement(Icon as React.ComponentType<{size:number}>,{size:19})}</div><input type="number" min="0" value={ws.metrics[key as keyof typeof ws.metrics]} onChange={e=>modifyWs(brand,w=>({...w,metrics:{...w.metrics,[key as string]:Math.max(0,Number(e.target.value)||0)}}))}/><p>À renseigner manuellement</p></div>)}</div><div className="analytics-layout"><section className="panel"><div className="panel-header"><div><h2>Entonnoir de conversion</h2><p>Des conversations aux participants</p></div><Badge tone="mint">Saisie locale</Badge></div>{[['Messages reçus',ws.metrics.messages],['Conversations qualifiées',ws.metrics.qualified],['Inscriptions',ws.metrics.registrations],['Participants',ws.metrics.attendees]].map(([title,val])=><div className="funnel-line" key={String(title)}><span>{String(title)}</span><div className="track"><div style={{width:`${Math.min(100,Number(val)/Math.max(1,ws.metrics.messages)*100)}%`}}/></div><strong>{Number(val).toLocaleString('fr-FR')}</strong></div>)}<div className="stats-footnote"><Info size={15}/> Ces statistiques ne sont pas synchronisées avec Meta Ads ni WhatsApp Business.</div></section><section className="panel"><div className="panel-header"><div><h2>Votre taux de qualification</h2><p>Calcul sur les saisies de l'équipe</p></div></div><div className="conversion-ring" style={{'--pct':`${Math.min(100,Math.round(ws.metrics.qualified/Math.max(1,ws.metrics.messages)*100))}%`} as React.CSSProperties}><div><strong>{ws.metrics.messages?Math.round(ws.metrics.qualified/ws.metrics.messages*100):0}%</strong><span>Qualifiés / messages</span></div></div><div className="detail-line"><span>Taux de participation</span><strong>{ws.metrics.registrations?Math.round(ws.metrics.attendees/ws.metrics.registrations*100):0}%</strong></div></section></div></>}

    {view==='research'&&<div className="intelligence-page">
      <div className="intelligence-hero panel">
        <div><Badge tone="purple">{research.release}</Badge><h2>Éditorial de terrain, pas des slogans recopiés.</h2><p>{research.editorialSignature}</p><div className="research-meta"><span><Badge tone="mint">DONNÉES RÉELLES</Badge> Comptes de la marque</span><span><Badge tone="blue">VEILLE</Badge> Sources publiques</span><span><Badge tone="orange">HYPOTHÈSES</Badge> À tester</span></div></div>
        <div className="research-score"><span>PUBLICATIONS</span><strong>{stats.posts}</strong><span>{raw.scripts.length} scripts complets · {ws.variants.length} déclinaisons</span></div>
      </div>
      <div className="research-panels">
        <section className="panel"><h3>Ce que disent nos données</h3><p>{research.firstParty.organic}</p><p>{research.firstParty.ads}</p><small>{research.firstParty.warning}</small></section>
        <section className="panel"><h3>Objectif commercial réel</h3><p>{research.northStar}</p><p>{research.noClaim}</p><small>La première présentation informe ; les coachs détaillent les conditions commerciales ensuite.</small></section>
      </div>
      <div className="panel research-board"><div className="panel-header"><div><h2>Benchmark concurrentiel</h2><p>Leurs arguments publics ne prouvent pas leurs taux de conversion. Voici ce qui peut être testé et ce qui ne doit pas être copié.</p></div><Badge tone="blue">{research.competitorPatterns.length} observations</Badge></div>
      <div className="research-competitors">{research.competitorPatterns.map((c,i)=><div className="research-competitor" key={c.name}><div className="research-competitor-head"><span className="research-index">{String(i+1).padStart(2,'0')}</span><div><h3>{c.name}</h3><small>{c.format}</small></div></div><p>{c.observation}</p><div className="research-do"><strong>À adapter</strong><span>{c.transfer}</span></div><div className="research-dont"><strong>À ne pas reprendre</strong><span>{c.avoid}</span></div><footer>{c.confidence}<div>{c.source.split(',').map(id=>{const v=raw.sources.find(s=>s.id===id);return v?.url?.startsWith('http')?<a key={id} target="_blank" rel="noopener noreferrer" href={v.url}>{id} <ExternalLink size={12}/></a>:<span key={id}>{id}</span>})}</div></footer></div>)}</div></div>
      <div className="research-panels"><section className="panel"><h3>Territoires éditoriaux</h3><div className="research-pill-list">{research.editorialAngles.map((x,i)=><span key={i}><Lightbulb size={14}/>{x}</span>)}</div></section><section className="panel"><h3>Expériences à mesurer</h3><ol className="research-experiments">{research.testedIdeas.map((x,i)=><li key={i}>{x}</li>)}</ol></section></div>
      <div className="panel research-destination"><div><h3>De la veille à un script</h3><p>Les 16 vidéos de chaque marque incluent le texte à prononcer, un découpage 6 scènes, des plans, le texte à l’écran, des variantes d’accroche, des versions par réseau et des sources associées.</p></div><button className="btn btn-primary" onClick={()=>setView('video')}>Ouvrir les scripts vidéo <ArrowRight size={17}/></button></div>
    </div>}

    {view==='sources'&&<div className="panel"><div className="panel-header"><div><h2>Bibliothèque de sources</h2><p>Références utilisées pour les contenus et la veille concurrentielle.</p></div><Badge tone="blue">{raw.sources.length} références</Badge></div><div className="source-list">{raw.sources.map(s=><div key={s.id} className="source-row navigable-block" role="link" tabIndex={0}
 aria-label={'Consulter la référence '+s.name} title={'Consulter '+s.name}
 onClick={e=>activateBlock(e,()=>/^https?:\/\//.test(s.url||'')?window.open(s.url,'_blank','noopener,noreferrer'):setView('research'))}
 onKeyDown={e=>activateBlockKey(e,()=>/^https?:\/\//.test(s.url||'')?window.open(s.url,'_blank','noopener,noreferrer'):setView('research'))}>
 <div className="source-icon"><BookOpenIcon/></div><div><h3>{s.name}</h3><p>{s.purpose}</p><small>{s.type} · {s.status}</small>{s.caution&&<small className="caution-text">{clean(s.caution,160)}</small>}</div>{s.url?.startsWith('http')?<a href={s.url} target="_blank" rel="noopener noreferrer" className="source-open" title="Voir la référence"><ExternalLink size={17}/></a>:<span className="muted">Référence interne</span>}</div>)}</div></div>}

    {view==='settings'&&<div className="settings-layout"><section className="panel"><div className="panel-header"><div><h2>Paramètres du studio</h2><p>Personnalisez l’espace de travail.</p></div></div><div className="setting-section"><h3>Espaces de marques</h3><div className="brand-cards">{(access?.allowedBrands||[]).map(id=><button className={'setting-brand '+(id===brand?'selected':'')} onClick={()=>switchBrand(id)} key={id}><span className="workspace-initial">{BRAND_INFO[id].initial}</span><span><strong>{BRAND_INFO[id].label}</strong><small>{BRAND_INFO[id].person}</small></span>{id===brand&&<Check size={17}/>}</button>)}</div></div>
 {(manageableBrands.length>0)&&<div className="setting-section">
 <h3><Users size={18} style={{verticalAlign:'middle',marginRight:8}}/>Accès aux marques</h3>
 <p>Attribuez une marque et envoyez automatiquement un e-mail de configuration du compte. La personne définit ensuite son prénom, son nom et son mot de passe. Seuls les propriétaires et le super-administrateur peuvent accorder des accès.</p>
 <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(160px,1fr))',gap:10,marginTop:12}}>
 <input type="email" value={inviteEmail} onChange={e=>setInviteEmail(e.target.value)} placeholder="adresse@email.com" aria-label="Adresse de l’utilisateur à inviter" style={{padding:11,border:'1px solid #d6dff4',borderRadius:9}}/>
 <select aria-label="Espace à partager" value={manageableBrands.includes(inviteBrand)?inviteBrand:manageableBrands[0]} onChange={e=>setInviteBrand(e.target.value as BrandId)} style={{padding:11,border:'1px solid #d6dff4',borderRadius:9}}>
 {manageableBrands.map(id=><option key={id} value={id}>{BRAND_INFO[id].label}</option>)}
 </select>
 <select aria-label="Niveau d’accès" value={inviteRole} onChange={e=>setInviteRole(e.target.value as BrandRole)} style={{padding:11,border:'1px solid #d6dff4',borderRadius:9}}>
 <option value="editor">Éditeur</option><option value="viewer">Lecture seule</option>{access?.isSuperadmin&&<option value="owner">Propriétaire</option>}
 </select>
 <button type="button" className="btn btn-primary" disabled={inviteBusy} onClick={()=>void grantAccess()}>{inviteBusy?'Enregistrement…':'Attribuer et inviter'}</button>
 </div>
 <div style={{marginTop:15,display:'grid',gap:8}}>
 {grantRows.map(g=><div key={g.brand_id+'-'+g.email} style={{display:'flex',alignItems:'center',gap:9,justifyContent:'space-between',padding:'9px 12px',background:'#f5f8ff',borderRadius:10,flexWrap:'wrap'}}>
 <span><strong>{g.email}</strong><br/><small>{BRAND_INFO[g.brand_id].label} · {g.role==='owner'?'Propriétaire':g.role==='viewer'?'Lecture seule':'Éditeur'}</small></span>
 {(g.role!=='owner'||access?.isSuperadmin)&&<button type="button" className="btn btn-outline" onClick={()=>void revokeGrant(g)}>Retirer</button>}
 </div>)}
 {!grantRows.length&&<p>Aucun accès individuel ajouté pour les marques administrées.</p>}
 </div>
 </div>}
 <div className="setting-section"><h3>Notes internes</h3><textarea className="settings-notes" rows={6} value={ws.notes} onChange={e=>modifyWs(brand,w=>({...w,notes:e.target.value}))} placeholder="Ajoutez vos consignes, décisions et rappels pour cette marque..."/><small>Enregistrement automatique dans la base Supabase</small></div><div className="setting-section"><h3>Compte connecté</h3><p>{user.email} · {access?.isSuperadmin?'Super-administrateur':access?.roles[brand]==='owner'?'Propriétaire':access?.roles[brand]==='viewer'?'Lecture seule':'Éditeur'}</p><button type="button" className="btn btn-outline" onClick={()=>studioClient?.auth.signOut()}>Se déconnecter</button></div><div className="setting-section"><h3>Sauvegarde et restauration</h3><p>Données synchronisées via Supabase et accessibles aux membres autorisés. Gardez aussi une sauvegarde JSON.</p><div className="toolbar-buttons"><button className="btn btn-primary" onClick={exportBackup}><Download size={17}/> Exporter toute la sauvegarde</button><button className="btn btn-outline" onClick={()=>importInput.current?.click()}><Upload size={17}/> Importer une sauvegarde</button><input ref={importInput} accept="application/json,.json" type="file" style={{display:'none'}} onChange={e=>importBackup(e.target.files?.[0])}/></div></div></section><aside className="panel security-panel"><div className="security-symbol"><AlertTriangle size={27}/></div><h3>Avant de travailler à plusieurs</h3><p>Supabase synchronise les documents et la médiathèque. Les permissions sont contrôlées dans PostgreSQL par des politiques RLS propres à chaque marque.</p><p>Le déploiement public ne doit pas être considéré comme un espace sécurisé sans protection d'accès.</p><div className="detail-line"><span>Publication auto</span><Badge tone="orange">Non connectée</Badge></div><div className="detail-line"><span style={{display:'inline-flex',alignItems:'center',gap:7}}><SiWhatsapp size={15} style={{color:'#25d366'}}/> TeloPra / Evolution</span><button type="button" className="btn btn-outline" onClick={()=>setView('whatsapp')}>Gérer la connexion</button></div><div className="detail-line"><span>Synchronisation Supabase</span><Badge tone="mint">Active</Badge></div></aside></div>}

   </main>
  </div>
  <nav className="mobile-bottom-nav" aria-label="Navigation rapide mobile">
   <button type="button" className={'mobile-nav-item'+(view==='overview'?' mobile-nav-active':'')}
    aria-current={view==='overview'?'page':undefined} onClick={()=>{setView('overview');setMobileMenu(false)}}>
     <LayoutDashboard size={21}/><span>Accueil</span>
   </button>
   <button type="button" className={'mobile-nav-item'+(view==='planning'||view==='calendar'?' mobile-nav-active':'')}
    aria-current={view==='planning'||view==='calendar'?'page':undefined} onClick={()=>{setView('planning');setMobileMenu(false)}}>
     <CalendarClock size={21}/><span>Planning</span>
   </button>
   <button type="button" className="mobile-nav-item mobile-nav-create"
    onClick={()=>{if(canEdit(brand))setNewModal(true);else notify('Accès en lecture seule','warning')}} aria-label="Créer un nouveau contenu">
     <span className="mobile-create-circle"><Plus size={24} strokeWidth={2.6}/></span><span>Créer</span>
   </button>
   <button type="button" className={'mobile-nav-item'+(view==='whatsapp'?' mobile-nav-active':'')}
    aria-current={view==='whatsapp'?'page':undefined} onClick={()=>{setView('whatsapp');setMobileMenu(false)}}>
     <SiWhatsapp size={22} style={{color:'#25d366'}}/><span>WhatsApp</span>
   </button>
   <button type="button" className={'mobile-nav-item'+(!['overview','planning','calendar','whatsapp'].includes(view)?' mobile-nav-active':'')}
    aria-expanded={mobileMenu} aria-controls="studio-mobile-drawer" onClick={()=>setMobileMenu(v=>!v)}>
     <Menu size={22}/><span>Modules</span>
   </button>
  </nav>
  {newModal&&<div className="modal-layer" onMouseDown={e=>{if(e.target===e.currentTarget)setNewModal(false)}}><div className="modal-card"><div className="modal-heading"><div><span className="modal-icon"><Plus size={23}/></span><h2>Nouveau contenu</h2><p>Créer une nouvelle idée dans {info.label}</p></div><IconButton onClick={()=>setNewModal(false)}><X size={20}/></IconButton></div><div className="modal-content"><p>Un nouveau brouillon sera ajouté au calendrier éditorial. Tu pourras immédiatement modifier son titre, son texte, les plateformes et sa date.</p><div className="modal-preview"><PenSquare size={21}/><span><strong>Publication · À produire</strong><small>Votre brouillon sera enregistré dans Supabase pour cette marque.</small></span></div></div><footer><button className="btn btn-outline" onClick={()=>setNewModal(false)}>Annuler</button><button className="btn btn-primary" onClick={addPost}>Créer le brouillon <ArrowRight size={15}/></button></footer></div></div>}
  {toast&&<div className={'toast '+(toast.kind||'success')} role="status">{toast.kind==='warning'?<AlertTriangle size={17}/>:<CircleCheck size={17}/>} {toast.message}<button onClick={()=>setToast(null)}><X size={14}/></button></div>}
 </div>;
}
function BookOpenIcon(){return <Library size={19}/>}
function GripIcon(){return <MoreHorizontal size={16}/>}