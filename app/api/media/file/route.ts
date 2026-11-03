import { get } from '@vercel/blob';
import { NextRequest, NextResponse } from 'next/server';
import { authenticated } from '@/lib/session';
export const runtime='nodejs';
export const dynamic='force-dynamic';
export async function GET(req:NextRequest){
 if(!await authenticated())return NextResponse.json({error:'Connexion requise'},{status:401});
 const pathname=req.nextUrl.searchParams.get('pathname')||'';
 if(!/^media\/(bonas|lzo)\/[0-9a-f-]{36}\.(png|jpg|gif|webp)$/i.test(pathname))return NextResponse.json({error:'Fichier invalide'},{status:400});
 try {const blob=await get(pathname,{access:'private'});
  if(!blob||blob.statusCode!==200||!blob.stream)return new NextResponse('Introuvable',{status:404});
  return new NextResponse(blob.stream,{headers:{'Content-Type':blob.blob.contentType,'Cache-Control':'private, no-store','X-Content-Type-Options':'nosniff'}});
 }catch{ return new NextResponse('Introuvable',{status:404})}
}
