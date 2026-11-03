export type BrandId='bonas'|'lzo';
export type View='overview'|'planning'|'calendar'|'kanban'|'media'|'editor'|'campaigns'|'video'|'whatsapp'|'insights'|'sources'|'research'|'settings';
export type Status='Idée'|'À produire'|'En rédaction'|'À valider'|'Programmé'|'Publié';
export interface ContentPost {
  id:string;date:string;week:string;day:string;time:string;type:string;stage:string;pillar:string;title:string;
  caption:string;cta:string;channels:string[];script:string;duration:string;asset:string;hashtags:string;sources:string;
  production:string;status:string;eventDate:string;proof:string;assignee:string;dmLink:string;groupLink:string;
  coverMediaId?:string; mediaIds?:string[];
}
export interface ChannelVariant {id:string;date:string;week:string;postId:string;channel:string;format:string;time:string;hook:string;caption:string;hashtags:string;cta:string;link:string;dimensions:string;brief:string;stage:string;status:string;kpi:string;sources:string}
export interface StoryScene {time:string;scene:string;spoken:string;onScreen:string;shot:string}
export interface Script {id:string;date:string;week:string;role:string;duration:string;hook:string;tension:string;story:string;realism:string;cta:string;timeline:string;direction:string;sound:string;asset:string;compliance:string;status:string;sources:string;spoken?:string;scenes?:StoryScene[];hookAlternatives?:string[];cover?:string;platformCuts?:Record<string,string>;postCaption?:string;proofNeeded?:string;angle?:string;referenceIds?:string[]}
export interface GroupEvent {id:string;date:string;week:string;theme:string;greeting:string;invitation:string;reminder:string;followUp:string;condition:string;dmLink:string;groupLink:string;flow:string;kpi:string;status:string;sources:string}
export interface Evidence {id:string;type:string;name:string;purpose:string;url:string;status:string;caution:string}
export interface MediaAsset {id:string;name:string;brand:BrandId;kind:'Image'|'Vidéo'|'Document';src:string;format:string;created:string;size?:string;note?:string;storagePath?:string;posterSrc?:string;posterStoragePath?:string;provider?:'supabase'|'external'|'seed';origin?:'upload'|'stock'|'generated'|'seed';credit?:string;licenseUrl?:string}
export interface WorkspaceConfig{brand:string;owner:string;tagline:string;accent:string;whatsapp:string}
export interface CompetitivePattern {name:string;format:string;observation:string;transfer:string;avoid:string;source:string;confidence:string}
export interface ResearchOverview {updatedAt:string;editorialSignature:string;northStar:string;firstParty:{organic:string;ads:string;warning:string};editorialAngles:string[];contentMix:Record<string,number>;testedIdeas:string[];noClaim:string;competitorPatterns:CompetitivePattern[];studyLinks:{id:string;url:string}[];release:string;sourceOfTruth:string}
export interface WorkspaceData {config:WorkspaceConfig;posts:ContentPost[];variants:ChannelVariant[];scripts:Script[];events:GroupEvent[];sources:Evidence[];research:ResearchOverview}
export interface PersistentWorkspace {posts:ContentPost[];variants:ChannelVariant[];media:MediaAsset[];metrics:{messages:number;qualified:number;registrations:number;attendees:number}; notes:string}