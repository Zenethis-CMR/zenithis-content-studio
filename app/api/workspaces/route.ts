import { NextRequest, NextResponse } from 'next/server';
import { authenticated } from '@/lib/session';
import { loadWorkspace, saveWorkspace, validBrand } from '@/lib/persistence';
import type { PersistentWorkspace } from '@/lib/types';
export const runtime='nodejs';
export const dynamic='force-dynamic';
const denied=()=>NextResponse.json({error:'Connexion requise'},{status:401});
export async function GET(req:NextRequest){
 if(!await authenticated())return denied();
 const brand=req.nextUrl.searchParams.get('brand')||'';
 if(!validBrand(brand))return NextResponse.json({error:'Marque invalide'},{status:400});
 try {return NextResponse.json(await loadWorkspace(brand),{headers:{'Cache-Control':'no-store'}})}
 catch(e){console.error('workspace GET:',e);return NextResponse.json({error:String(e)},{status:503})}
}
export async function PUT(req:NextRequest){
 if(!await authenticated())return denied();
 const size=Number(req.headers.get('content-length')||0);
 if(size>3_500_000)return NextResponse.json({error:'Document trop volumineux'},{status:413});
 const input=await req.json().catch(()=>null) as {brand?:string;revision?:string;state?:PersistentWorkspace}|null;
 if(!input||!validBrand(input.brand||'')||typeof input.revision!=='string'||!input.state||!Array.isArray(input.state.posts)||!Array.isArray(input.state.variants)||!Array.isArray(input.state.scripts)||!Array.isArray(input.state.media)||typeof input.state.notes!=='string')return NextResponse.json({error:'Document non valide'},{status:400});
 try{const saved=await saveWorkspace(input.brand as 'bonas'|'lzo',input.state,input.revision);return NextResponse.json({revision:saved.revision,provider:saved.provider})}
 catch(e){const msg=String(e);console.error('workspace PUT:',msg);return NextResponse.json({error:msg},{status:msg.includes('CONFLIT')?409:500})}
}
