import { NextRequest, NextResponse } from 'next/server';
import { put } from '@vercel/blob';
import { authenticated } from '@/lib/session';
import { validBrand } from '@/lib/persistence';
export const runtime='nodejs';
export async function POST(req:NextRequest){
 if(!await authenticated())return NextResponse.json({error:'Connexion requise'},{status:401});
 const data=await req.formData().catch(()=>null);
 const file=data?.get('file');const brand=String(data?.get('brand')||'');
 if(!validBrand(brand)||!(file instanceof File))return NextResponse.json({error:'Fichier ou marque invalide'},{status:400});
 const types:Record<string,string>={'image/png':'png','image/jpeg':'jpg','image/webp':'webp','image/gif':'gif'};
 if(!types[file.type])return NextResponse.json({error:'Formats acceptés : PNG, JPG, WEBP, GIF'},{status:415});
 if(file.size>4_000_000)return NextResponse.json({error:'Image de plus de 4 Mo : compressez-la avant import'},{status:413});
 const magic=new Uint8Array(await file.slice(0,16).arrayBuffer());
 const isPng=file.type==='image/png'&&magic[0]===137&&magic[1]===80&&magic[2]===78&&magic[3]===71;
 const isJpeg=file.type==='image/jpeg'&&magic[0]===255&&magic[1]===216;
 const isGif=file.type==='image/gif'&&String.fromCharCode(...magic.slice(0,3))==='GIF';
 const isWebp=file.type==='image/webp'&&String.fromCharCode(...magic.slice(0,4))==='RIFF'&&String.fromCharCode(...magic.slice(8,12))==='WEBP';
 if(![isPng,isJpeg,isGif,isWebp].some(Boolean))return NextResponse.json({error:'Le fichier ne correspond pas à son format déclaré'},{status:415});
 const pathname=`media/${brand}/${crypto.randomUUID()}.${types[file.type]}`;
 try {
  await put(pathname,file,{access:'private',contentType:file.type});
  return NextResponse.json({media:{id:`uploaded-${crypto.randomUUID()}`,name:file.name,brand,kind:'Image',src:`/api/media/file?pathname=${encodeURIComponent(pathname)}`,format:types[file.type].toUpperCase(),created:new Date().toISOString().slice(0,10),size:`${Math.round(file.size/1024)} Ko`}});
 }catch(e){console.error('upload:',e);return NextResponse.json({error:'Import impossible vers le stockage distant'},{status:500})}
}
