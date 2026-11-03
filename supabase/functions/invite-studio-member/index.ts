import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import {createClient} from "npm:@supabase/supabase-js@2.57.0";

const siteUrl="https://zenithis-content-studio-mu.vercel.app";
const cors={
  "Access-Control-Allow-Origin":siteUrl,
  "Access-Control-Allow-Headers":"authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods":"POST, OPTIONS",
  "Content-Type":"application/json",
  "Cache-Control":"no-store",
  "Vary":"Origin",
};
const output=(status:number,body:Record<string,unknown>)=>
  new Response(JSON.stringify(body),{status,headers:cors});
type InviteError={code?:string;status?:number;message?:string};
const classifyAuthError=(error:InviteError)=>{
  const code=error.code||"";
  const message=(error.message||"").toLowerCase();
  if(code==="over_email_send_rate_limit"||error.status===429)return {
    status:429,code:"EMAIL_RATE_LIMIT",
    error:"Le quota d’e-mails Supabase est atteint. Les droits sont conservés. Configurez un SMTP personnalisé, puis réessayez depuis la fiche du membre."
  };
  if(code==="email_address_not_authorized")return {
    status:424,code:"SMTP_REQUIRED",
    error:"L’e-mail du destinataire n’est pas autorisé avec le service Supabase intégré. Configurez un SMTP personnalisé avant de renvoyer."
  };
  if(code==="user_already_exists"||/already|registered|exists/.test(message))return {
    status:200,code:"ACCOUNT_EXISTS",
    error:"Ce compte existe déjà. Il peut se connecter avec ses identifiants ou utiliser « Mot de passe oublié »."
  };
  return {status:502,code:"EMAIL_DELIVERY_FAILED",
    error:"L’invitation n’a pas pu être envoyée. Vérifiez SMTP et les journaux Supabase Auth avant de retenter."};
};

Deno.serve(async(req:Request)=>{
  if(req.method==="OPTIONS")return new Response(null,{status:204,headers:cors});
  if(req.method!=="POST")return output(405,{code:"METHOD_NOT_ALLOWED",error:"Méthode non autorisée"});
  const origin=req.headers.get("origin");
  if(origin!==siteUrl)return output(403,{code:"ORIGIN_DENIED",error:"Origine non autorisée"});
  const authorization=req.headers.get("authorization")||"";
  if(!authorization.startsWith("Bearer "))return output(401,{code:"AUTH_REQUIRED",error:"Session requise"});

  const url=Deno.env.get("SUPABASE_URL")||"";
  const anon=Deno.env.get("SUPABASE_ANON_KEY")||"";
  const service=Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")||"";
  if(!url||!anon||!service)return output(500,{code:"SERVER_CONFIG",error:"Service d’authentification indisponible"});

  const token=authorization.slice(7);
  const memberClient=createClient(url,anon,{
    auth:{persistSession:false,autoRefreshToken:false},
    global:{headers:{Authorization:authorization}},
  });
  const {data:{user},error:userError}=await memberClient.auth.getUser(token);
  if(userError||!user?.email||!user.email_confirmed_at)return output(401,{code:"VERIFIED_SESSION_REQUIRED",error:"Compte de gestionnaire vérifié requis"});

  let payload:{email?:unknown;brand?:unknown;role?:unknown;action?:unknown};
  try{payload=await req.json()}catch{return output(400,{code:"INVALID_PAYLOAD",error:"Corps de requête invalide"})}
  const email=typeof payload.email==="string"?payload.email.trim().toLowerCase():"";
  const brand=payload.brand;
  const role=payload.role;
  const action=payload.action===undefined?"send":payload.action;
  if(!/^[^\s@]{1,64}@[^\s@]{1,190}\.[^\s@]+$/.test(email)||
     !["bonas","lzo"].includes(String(brand))||
     !["owner","editor","viewer"].includes(String(role))||
     !["send","manual_link"].includes(String(action))){
    return output(400,{code:"INVALID_FIELDS",error:"Champs d’invitation invalides"});
  }
  if(email===user.email.toLowerCase())return output(400,{code:"SELF_INVITE",error:"Impossible de s’inviter soi-même"});
  const {data:allowed,error:permissionError}=await memberClient.rpc("studio_may_invite",{
    p_brand:brand,p_role:role,
  });
  if(permissionError)return output(403,{code:"PERMISSION_CHECK_FAILED",error:"Permission de gestion non vérifiée"});
  if(allowed!==true)return output(403,{code:"FORBIDDEN",error:"Seul un propriétaire autorisé ou super-administrateur peut inviter"});

  const admin=createClient(url,service,{auth:{persistSession:false,autoRefreshToken:false}});
  const {data:grant,error:grantError}=await admin.from("studio_brand_access")
    .select("email,role").eq("brand_id",brand).eq("email",email).maybeSingle();
  if(grantError||!grant||grant.role!==role)return output(409,{code:"GRANT_MISSING",error:"Attribuez d’abord la marque et le rôle exacts"});

  try{
    // Explicit admin action only. Never log or persist the tokenized link.
    if(action==="manual_link"){
      const {data,error}=await admin.auth.admin.generateLink({
        type:"invite",email,options:{redirectTo:siteUrl+"/?mode=setup"},
      });
      if(error){
        const detail=classifyAuthError(error);
        return output(detail.status===200?409:detail.status,{
          ok:false,code:detail.code,error:detail.error
        });
      }
      const link=data?.properties?.action_link;
      if(!link||!link.startsWith("https://"))return output(502,{code:"LINK_UNAVAILABLE",error:"Lien sécurisé indisponible"});
      return output(200,{ok:true,status:"manual-link",link,
        notice:"Lien sensible à usage individuel. Ne le partagez qu’avec le destinataire prévu et ne le stockez pas dans un outil public."});
    }

    const {error:invitationError}=await admin.auth.admin.inviteUserByEmail(email,{
      redirectTo:siteUrl+"/?mode=setup",
    });
    if(!invitationError)return output(200,{ok:true,status:"invited"});
    const detail=classifyAuthError(invitationError);
    if(detail.code==="ACCOUNT_EXISTS")
      return output(200,{ok:true,status:"existing-account",notice:detail.error});
    return output(detail.status,{ok:false,code:detail.code,error:detail.error});
  }catch{
    return output(500,{ok:false,code:"INVITATION_UNAVAILABLE",error:"Service d’invitation momentanément indisponible. Les droits restent attribués."});
  }
});
