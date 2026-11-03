import type {BrandId,View} from './types';

/** URL-driven navigation: every module and selected resource has a stable, shareable address. */
export type StudioRoute={
 brand?:BrandId;view:View;post?:string;media?:string;script?:string;
 date?:string;month?:string;calendar?:'month'|'week';tab?:'contenu'|'declinaisons';stage?:'1'|'2'|'3'|'4';event?:string;week?:string;status?:string;channel?:string;
};
export const STUDIO_VIEWS:View[]=[
 'overview','planning','calendar','kanban','media','editor','video',
 'campaigns','whatsapp','insights','research','sources','settings'
];
const allowed=(value:string|null,max=160):string|undefined=>
 value && value.length<=max && /^[\w.:-]+$/.test(value) ? value : undefined;
export function parseStudioRoute(search:string):StudioRoute{
 const params=new URLSearchParams(search);
 const requested=params.get('view');
 const brand=params.get('brand');
 const view:View=STUDIO_VIEWS.includes(requested as View)?requested as View:'overview';
 const date=params.get('date');
 const tab=params.get('tab');
 const stage=params.get('stage');
 const week=params.get('week');
 return {
  brand:brand==='bonas'||brand==='lzo'?brand:undefined,
  view,
  post:allowed(params.get('post')),
  media:allowed(params.get('media')),
  script:allowed(params.get('script')),
  date:date && /^\d{4}-\d{2}-\d{2}$/.test(date) ? date : undefined,
  month:params.get('month') && /^\d{4}-(0[1-9]|1[0-2])$/.test(params.get('month')!)?params.get('month')!:undefined,
  calendar:params.get('calendar')==='week'?'week':'month',
  tab:tab==='declinaisons'?'declinaisons':'contenu',
  stage:stage==='1'||stage==='2'||stage==='3'||stage==='4'?stage:undefined,
  event:allowed(params.get('event')),
  week:week && /^S[1-8]$/.test(week)?week:undefined,
  status:params.get('status')||undefined,
  channel:params.get('channel')||undefined
 };
}
export function serializeStudioRoute(route:StudioRoute,existingSearch=''):string{
 const params=new URLSearchParams(existingSearch);
 for(const key of ['brand','view','post','media','script','date','month','calendar','tab','stage','event','week','status','channel'])params.delete(key);
 if(route.brand)params.set('brand',route.brand);
 params.set('view',route.view);
 if(route.view==='editor' && route.post){
  params.set('post',route.post);
  if(route.tab==='declinaisons')params.set('tab','declinaisons');
 }
 if(route.view==='media' && route.media)params.set('media',route.media);
 if(route.view==='video' && route.script)params.set('script',route.script);
 if(route.view==='calendar'){
  if(route.date)params.set('date',route.date);
  if(route.month)params.set('month',route.month);
  if(route.calendar==='week')params.set('calendar','week');
 }
 if(route.view==='whatsapp'){
  if(route.stage && route.stage!=='2')params.set('stage',route.stage);
  if(route.event)params.set('event',route.event);
 }
 if((route.view==='planning'||route.view==='kanban'||route.view==='campaigns')&&route.week&&/^S[1-8]$/.test(route.week))params.set('week',route.week);
 if(route.view==='planning'||route.view==='kanban'){
  if(route.status && route.status!=='Tous les statuts')params.set('status',route.status);
  if(route.channel && route.channel!=='Tous les canaux')params.set('channel',route.channel);
 }
 const query=params.toString();
 return query?'?'+query:'';
}
