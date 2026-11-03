import type {BrandId,ContentPost,MediaAsset,WorkspaceData,Status} from './types';
// Editorial content is stored in Supabase and never bundled into public JavaScript.
export function emptyLibrary(brandId:BrandId):WorkspaceData{
 const isBonas=brandId==='bonas';
 return {
  config:{brand:isBonas?'BONAS-INC':'LZO Empire',owner:isBonas?'Sandrine Mamiafo':'Laurence Fedjou Zonfack',tagline:'',accent:'',whatsapp:''},
  posts:[],variants:[],scripts:[],events:[],sources:[],
  research:{updatedAt:'',editorialSignature:'',northStar:'',firstParty:{organic:'',ads:'',warning:''},editorialAngles:[],contentMix:{},testedIdeas:[],noClaim:'',competitorPatterns:[],studyLinks:[],release:'',sourceOfTruth:''}
 }
}
export const templates:Record<BrandId,WorkspaceData>={bonas:emptyLibrary('bonas'),lzo:emptyLibrary('lzo')};
export const BRAND_INFO={
 bonas:{code:'BONAS',label:'BONAS-INC',person:'Sandrine Mamiafo',initial:'B',color:'#4768e8',light:'#eaf0ff',positioning:'Marketing digital · ateliers · histoires concrètes'},
 lzo:{code:'LZO',label:'LZO Empire',person:'Laurence Fedjou Zonfack',initial:'L',color:'#b37c51',light:'#fff1e5',positioning:'Découvrir · comprendre · choisir en confiance'}
};
export const navSections=[
 {id:'overview',name:'Vue d’ensemble'},
 {id:'planning',name:'Programmation'},
 {id:'calendar',name:'Calendrier'},
 {id:'kanban',name:'Kanban éditorial'},
 {id:'media',name:'Médiathèque'},
 {id:'editor',name:'Éditeur de contenu'},
 {id:'video',name:'Scripts vidéo'},
 {id:'campaigns',name:'Campagnes éditoriales'},
 {id:'whatsapp',name:'WhatsApp & séminaires'},
 {id:'insights',name:'Analyses'},
 {id:'sources',name:'Sources & veille'},
 {id:'settings',name:'Paramètres'}
] as const;
export const statuses:Status[]=['Idée','À produire','En rédaction','À valider','Programmé','Publié'];
export const labelForType=(type:string)=>type.toLowerCase().includes('video')?'Vidéo':type.toLowerCase().includes('story')?'Story':type.toLowerCase().includes('carrou')?'Carrousel':type.toLowerCase().includes('whatsapp')?'WhatsApp':type.toLowerCase().includes('post')?'Publication':'Visuel';
export function normalizeStatus(s:string):Status{
 const v=s.toLowerCase();
 if(v.includes('publi')) return 'Publié';if(v.includes('programm')||v.includes('planifi'))return 'Programmé';if(v.includes('valid'))return 'À valider';if(v.includes('rédac'))return 'En rédaction';if(v.includes('idée'))return 'Idée';return 'À produire';
}
export function createPosts(brand:BrandId):ContentPost[]{return templates[brand].posts.map(p=>({...p,status:normalizeStatus(p.status)}))}
export const seededMedia:MediaAsset[]=[
 {id:'m-bonas-01',name:'Plan B · campagne BONAS',brand:'bonas',kind:'Image',src:'/media/bonas-plan-b.jpg',format:'PNG · 4:5',created:'2026-10-23',note:'Visuel de campagne approuvé'},
 {id:'m-bonas-02',name:'Miniature vidéo Sandrine',brand:'bonas',kind:'Image',src:'/media/bonas-miniature.jpg',format:'JPG · 9:16',created:'2026-10-23'},
 {id:'m-bonas-03',name:'Visuel Facebook Feed',brand:'bonas',kind:'Image',src:'/media/bonas-feed.jpg',format:'JPG · 4:5',created:'2026-10-23'},
 {id:'m-lzo-01',name:'Construis ton Plan B · LZO',brand:'lzo',kind:'Image',src:'/media/lzo-plan-b.jpg',format:'PNG · 4:5',created:'2026-10-23'},
 {id:'m-lzo-02',name:'Visuel Facebook Feed · LZO',brand:'lzo',kind:'Image',src:'/media/lzo-feed.jpg',format:'PNG · 4:5',created:'2026-10-23'},
 {id:'m-lzo-03',name:'Format Story · LZO',brand:'lzo',kind:'Image',src:'/media/lzo-story.jpg',format:'PNG · 9:16',created:'2026-10-23'},
];
export function asDate(s:string){return new Date(s+'T12:00:00')}
export function longDate(s:string){return asDate(s).toLocaleDateString('fr-FR',{day:'numeric',month:'short',year:'numeric'})}
export function shortDate(s:string){return asDate(s).toLocaleDateString('fr-FR',{day:'2-digit',month:'short'})}
export function byDate(a:ContentPost,b:ContentPost){return (a.date+a.time).localeCompare(b.date+b.time)}
export function downloadJson(data:unknown,name:string){const b=new Blob([JSON.stringify(data,null,2)],{type:'application/json'});const href=URL.createObjectURL(b);const anchor=document.createElement('a');anchor.href=href;anchor.download=name;document.body.appendChild(anchor);anchor.click();anchor.remove();setTimeout(()=>URL.revokeObjectURL(href),1500)}
export const socialChannels=['Facebook','Instagram','TikTok','YouTube Shorts','LinkedIn','Pinterest','WhatsApp'];