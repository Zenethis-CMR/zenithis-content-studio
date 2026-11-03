import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import {createClient} from "npm:@supabase/supabase-js@2.57.0";

const siteUrl="https://zenithis-content-studio-mu.vercel.app";
const cors={
  "Access-Control-Allow-Origin":siteUrl,
  "Access-Control-Allow-Headers":"authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods":"POST, OPTIONS",
  "Content-Type":"application/json",
  "Vary":"Origin",
};
const output=(status:number,body:Record<string,unknown>)=>
  new Response(JSON.stringify(body),{status,headers:cors});

Deno.serve(async(req:Request)=>{
  if(req.method==="OPTIONS")return new Response(null,{status:204,headers:cors});
  if(req.method!=="POST")return output(405,{error:"Method not allowed"});
  const origin=req.headers.get("origin");
  if(origin!==siteUrl)return output(403,{error:"Origin not allowed"});
  const authorization=req.headers.get("authorization")||"";
  if(!authorization.startsWith("Bearer "))return output(401,{error:"Session required"});

  const url=Deno.env.get("SUPABASE_URL")||"";
  const anon=Deno.env.get("SUPABASE_ANON_KEY")||"";
  const service=Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")||"";
  if(!url||!anon||!service)return output(500,{error:"Server auth unavailable"});

  const token=authorization.slice(7);
  const memberClient=createClient(url,anon,{
    auth:{persistSession:false,autoRefreshToken:false},
    global:{headers:{Authorization:authorization}},
  });
  const {data:{user},error:userError}=await memberClient.auth.getUser(token);
  if(userError||!user?.email||!user.email_confirmed_at)return output(401,{error:"Verified session required"});

  let payload:{email?:unknown;brand?:unknown;role?:unknown};
  try{payload=await req.json()}catch{return output(400,{error:"Invalid payload"})}
  const email=typeof payload.email==="string"?payload.email.trim().toLowerCase():"";
  const brand=payload.brand;
  const role=payload.role;
  if(!/^[^\s@]{1,64}@[^\s@]{1,190}\.[^\s@]+$/.test(email)||
     !["bonas","lzo"].includes(String(brand))||
     !["owner","editor","viewer"].includes(String(role))){
    return output(400,{error:"Invalid invitation fields"});
  }
  if(email===user.email.toLowerCase())return output(400,{error:"Cannot invite yourself"});
  const {data:allowed,error:permissionError}=await memberClient.rpc("studio_may_invite",{
    p_brand:brand,p_role:role,
  });
  if(permissionError)return output(403,{error:"Unable to verify manager permission"});
  if(allowed!==true)return output(403,{error:"Only an authorized brand owner or superadministrator can send this invitation"});

  const admin=createClient(url,service,{auth:{persistSession:false,autoRefreshToken:false}});
  const {data:grant,error:grantError}=await admin.from("studio_brand_access")
    .select("email,role").eq("brand_id",brand).eq("email",email).maybeSingle();
  if(grantError||!grant||grant.role!==role)return output(409,{error:"Save the brand assignment first"});
  try{
    const {error:invitationError}=await admin.auth.admin.inviteUserByEmail(email,{
      redirectTo:siteUrl+"/?mode=setup",
    });
    if(!invitationError)return output(200,{ok:true,status:"invited"});
    // Existing confirmed accounts do not need a new signup invitation.
    const message=invitationError.message||"";
    if(/already|registered|exists/i.test(message)){
      const {error:resetError}=await admin.auth.resetPasswordForEmail(email,{
        redirectTo:siteUrl+"/?mode=reset",
      });
      if(resetError)return output(502,{error:"Access granted but email could not be sent; retry from the studio"});
      return output(200,{ok:true,status:"existing-account-reset"});
    }
    return output(502,{error:"Access granted but invitation email failed. Check mail quotas and Supabase SMTP configuration"});
  }catch{
    return output(500,{error:"Invitation delivery unavailable; access grant remains saved"});
  }
});
