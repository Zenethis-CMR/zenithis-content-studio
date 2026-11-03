'use client';

import React, {useState} from 'react';
import {BookOpen, Camera, Clapperboard, Film, Image as ImageIcon, Layers3, Play, Smartphone, Sparkles, Video} from 'lucide-react';
import type {BrandId, ContentPost, MediaAsset} from '@/lib/types';

export type ThumbnailSize='micro'|'compact'|'card'|'wide'|'hero';
export const contentMediaKind=(text:string)=>{
 const t=text.normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase();
 if(/video|reel|tiktok|short|face camera/.test(t))return 'video' as const;
 if(/carrou|carousel|diapositive/.test(t))return 'carousel' as const;
 if(/story|sondage/.test(t))return 'story' as const;
 return 'image' as const;
};
type Theme='travel'|'mobile'|'life'|'career'|'learn'|'talk'|'future'|'creative';
const findTheme=(post:ContentPost):Theme=>{
 const t=(post.title+' '+post.pillar+' '+post.type).normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase();
 if(/voyage|fete|destination|liberte/.test(t))return 'travel';
 if(/telephone|digital|tunnel|numerique|outil|en ligne/.test(t))return 'mobile';
 if(/famille|soir|dimanche|journee|pression|fatigue|temps/.test(t))return 'life';
 if(/carriere|travail|apres|experience|parcours/.test(t))return 'career';
 if(/apprendre|question|formation|comprendre|faq/.test(t))return 'learn';
 if(/conversation|message|temoignage|client|echange|communaute/.test(t))return 'talk';
 if(/reve|projet|choix|possible|ambition|avenir/.test(t))return 'future';
 return 'creative';
};
const palette:Record<Theme,[string,string,string]>={
 travel:['#253e77','#6387c8','#e4e2ff'],
 mobile:['#113d59','#247d96','#aaf4ea'],
 life:['#4a376d','#a1799f','#f9d9a9'],
 career:['#242f58','#5e6caa','#dfd3f2'],
 learn:['#3f4c80','#758cd1','#f7e8ae'],
 talk:['#375c72','#669fb5','#f6dda2'],
 future:['#384e76','#8d99cf','#f9d9ca'],
 creative:['#254b62','#4f94a6','#d5eff0']
};
const graphicLabel:Record<Theme,string>={
 travel:'HORIZONS',mobile:'DIGITAL',life:'QUOTIDIEN',career:'PARCOURS',
 learn:'APPRENDRE',talk:'ÉCHANGER',future:'POSSIBILITÉS',creative:'IDÉES'
};
const Glyph=({kind,size=20}:{kind:ReturnType<typeof contentMediaKind>;size?:number})=>
 kind==='video'?<Play size={size} fill="currentColor"/>:
 kind==='carousel'?<Layers3 size={size}/>:
 kind==='story'?<Smartphone size={size}/>:<ImageIcon size={size}/>;

export function ContentThumbnail({post,assets,brand,size='card',className=''}:{
 post:ContentPost;assets:MediaAsset[];brand:BrandId;size?:ThumbnailSize;className?:string
}){
 const [failed,setFailed]=useState(false);
 const associated=post.coverMediaId?assets.find(a=>a.id===post.coverMediaId):undefined;
 const usable=associated?.kind==='Image'?associated.src:associated?.kind==='Vidéo'?associated.posterSrc:undefined;
 const src=usable?.startsWith('http')||usable?.startsWith('/')?usable:undefined;
 const kind=contentMediaKind(post.type);
 const theme=findTheme(post);
 const colors=palette[theme];
 const linked=!!associated;
 const generated=!src||failed;
 const isTiny=size==='micro'||size==='compact';
 const number=(Array.from(post.id).reduce((n,c)=>n+c.charCodeAt(0),0)%4)+1;
 return <div className={'content-thumbnail content-thumbnail-'+size+' '+(generated?'thumb-concept':'thumb-photo')+' '+className}
  aria-label={linked?'Média associé au contenu : '+associated!.name:'Concept visuel à produire pour : '+post.title}
  role="img" style={{'--thumb-a':colors[0],'--thumb-b':colors[1],'--thumb-c':colors[2]} as React.CSSProperties}>
  {src&&!failed?<img src={src} alt="" loading="lazy" onError={()=>setFailed(true)}/>:
   <div className={'thumb-art thumb-art-'+theme}>
    <div className="thumb-glow"/>
    <svg className="thumb-illustration" viewBox="0 0 320 220" fill="none" aria-hidden="true">
      <circle cx="257" cy="55" r="66" stroke="white" strokeOpacity=".23" strokeWidth="1.5"/>
      <circle cx="257" cy="55" r="43" fill="white" fillOpacity=".07"/>
      <path d="M-35 164 Q80 68 190 163 T356 115" stroke="white" strokeOpacity=".32" strokeWidth="2"/>
      {theme==='mobile'?<>
       <rect x="167" y="31" width="71" height="137" rx="13" fill="#fff" fillOpacity=".13" stroke="white" strokeOpacity=".75" strokeWidth="2"/>
       <path d="M185 50h35M185 72h36M185 94h23" stroke="white" strokeWidth="3" strokeLinecap="round" strokeOpacity=".7"/>
       <circle cx="202" cy="150" r="5" fill="white" fillOpacity=".6"/>
      </>:theme==='travel'?<>
       <path d="M117 177l56-74 29 31 30-53 56 96H117Z" fill="white" fillOpacity=".19"/>
       <path d="M230 49l54 14-45 9 4 20-13-17-19 9 11-18-17-13 25 3Z" fill="white" fillOpacity=".65"/>
      </>:theme==='learn'?<>
       <path d="M135 77l53-17 53 17v98l-53-16-53 16V77Z" stroke="white" strokeOpacity=".78" strokeWidth="3"/>
       <path d="M188 60v99M150 96l22-6M150 113l22-6M203 91l22 7M203 109l22 6" stroke="white" strokeOpacity=".6" strokeWidth="2"/>
      </>:theme==='life'||theme==='career'?<>
       <circle cx="205" cy="73" r="21" fill="white" fillOpacity=".48"/>
       <path d="M164 166c0-32 19-54 41-54s41 22 41 54H164Z" fill="white" fillOpacity=".19" stroke="white" strokeOpacity=".63" strokeWidth="2"/>
      </>:theme==='talk'?<>
       <path d="M148 69h86a15 15 0 0115 15v49a15 15 0 01-15 15h-47l-30 20v-20h-9a15 15 0 01-15-15V84a15 15 0 0115-15Z" fill="white" fillOpacity=".16" stroke="white" strokeOpacity=".7" strokeWidth="2"/>
       <circle cx="164" cy="108" r="5" fill="white"/><circle cx="191" cy="108" r="5" fill="white"/><circle cx="218" cy="108" r="5" fill="white"/>
      </>:<>
       <circle cx="206" cy="105" r="53" fill="white" fillOpacity=".12" stroke="white" strokeOpacity=".5" strokeWidth="2"/>
       <path d="M181 107l17 18 33-44" stroke="white" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round"/>
      </>}
    </svg>
    {!isTiny&&<div className="thumb-art-word">{graphicLabel[theme]}</div>}
   </div>}
  {!isTiny&&<span className="thumb-brand">{brand==='bonas'?'BONAS':'LZO'} <span>STUDIO</span></span>}
  <span className={'thumb-kind '+(kind==='video'?'thumb-kind-video':'')}><Glyph kind={kind} size={isTiny?12:15}/>{!isTiny&&(kind==='video'?'VIDÉO':kind==='carousel'?'CARROUSEL':kind==='story'?'STORY':'VISUEL')}</span>
  {kind==='carousel'&&!isTiny&&<span className="thumb-frames" aria-hidden="true"><i/><i/><i/></span>}
  {kind==='video'&&size==='hero'&&<span className="thumb-bigplay"><Play size={24} fill="currentColor"/></span>}
  {generated&&!isTiny&&<span className="thumb-pending">{linked?'Aperçu en attente':'Visuel à produire'}</span>}
  {src&&!generated&&size==='hero'&&<span className="thumb-ready"><Camera size={12}/> Média lié</span>}
 </div>
}
