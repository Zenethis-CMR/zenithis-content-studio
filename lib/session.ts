import { createHash, createHmac, timingSafeEqual } from 'node:crypto';
import { cookies } from 'next/headers';

const cookieName = 'zenithis_studio_session';
export function authConfigured() {
  return Boolean(process.env.STUDIO_ADMIN_PASSWORD && process.env.STUDIO_SESSION_SECRET);
}
function getToken() {
  const key=process.env.STUDIO_SESSION_SECRET;
  if (!key) return '';
  return createHmac('sha256', key).update('zenithis-content-studio/session/v1').digest('base64url');
}
export async function authenticated() {
  if (!authConfigured()) return false;
  const received=(await cookies()).get(cookieName)?.value || '';
  const expected=getToken();
  return received.length === expected.length && received.length>0 && timingSafeEqual(Buffer.from(received),Buffer.from(expected));
}
export function passwordMatches(candidate: string) {
  const actual=process.env.STUDIO_ADMIN_PASSWORD;
  if (!actual || typeof candidate!=='string') return false;
  const left=createHash('sha256').update(candidate).digest();
  const right=createHash('sha256').update(actual).digest();
  return timingSafeEqual(left,right);
}
export async function establishSession(){
  (await cookies()).set(cookieName,getToken(),{httpOnly:true,sameSite:'strict',secure:process.env.NODE_ENV==='production',path:'/',maxAge:7*24*60*60});
}
export async function clearSession(){(await cookies()).delete(cookieName)}
