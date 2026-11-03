import { NextResponse } from 'next/server';
import { authConfigured, authenticated, establishSession, clearSession, passwordMatches } from '@/lib/session';
import { dbConfigured, storeConfigured } from '@/lib/persistence';
export const runtime='nodejs';
export async function GET(){return NextResponse.json({configured:authConfigured()&&storeConfigured(),authenticated:await authenticated(),provider:dbConfigured()?'PostgreSQL Supabase':'Stockage durable Vercel Blob'},{headers:{'Cache-Control':'no-store'}})}
export async function POST(req:Request){
 if(!authConfigured())return NextResponse.json({error:'Authentification non configurée'},{status:503});
 const {password}=await req.json().catch(()=>({password:''}));
 if(!passwordMatches(password))return NextResponse.json({error:'Mot de passe incorrect'},{status:401,headers:{'Cache-Control':'no-store'}});
 await establishSession();return NextResponse.json({ok:true});
}
export async function DELETE(){await clearSession();return NextResponse.json({ok:true})}
