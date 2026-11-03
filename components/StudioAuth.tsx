'use client';
import {useState, type CSSProperties, type FormEvent} from 'react';
import {Layers, ShieldCheck, Mail, LockKeyhole, Eye, EyeOff, ArrowRight, CheckCircle2, KeyRound, Loader2, CircleHelp} from 'lucide-react';
import {studioClient} from '@/lib/studio-db';

type Mode='login'|'forgot';
type SetupMode='setup'|'reset';
const normalized=(email:string)=>email.trim().toLowerCase();
const input:CSSProperties={
 display:'block',width:'100%',boxSizing:'border-box',border:'1px solid #dbe4f4',
 background:'#f8faff',borderRadius:12,padding:'14px 15px',fontSize:15,color:'#12224c',
 outlineColor:'#3467ff',fontFamily:'inherit'
};
const btn:CSSProperties={
 width:'100%',border:'none',borderRadius:12,padding:'15px 18px',
 background:'linear-gradient(120deg,#2659ed,#488aff)',color:'white',
 fontWeight:750,fontSize:14,cursor:'pointer',display:'flex',gap:9,
 justifyContent:'center',alignItems:'center',boxShadow:'0 10px 22px #235ef13b'
};

function Shell({children}:{children:React.ReactNode}){
 return <main className="studio-auth-shell">
  <div className="studio-auth-layout">
   <aside className="studio-auth-aside">
    <div className="studio-auth-logo"><Layers size={25} strokeWidth={2.8}/><span>Zenithis<span>Studio</span></span></div>
    <div className="studio-auth-visual"><span className="studio-auth-mini">ESPACE DE TRAVAIL SÉCURISÉ</span>
     <h1>Une plateforme.<br/>Des marques.<br/><em>Le bon accès.</em></h1>
     <p>Organisez vos contenus, médias et équipes sans mélanger les espaces BONAS-INC et LZO Empire.</p>
     <div className="studio-auth-features"><span><ShieldCheck size={18}/> Données sécurisées</span><span><CheckCircle2 size={18}/> Session conservée</span></div>
    </div>
    <small>Zenithis Content Studio · Accès réservé aux équipes autorisées</small>
   </aside>
   <section className="studio-auth-form-panel">{children}</section>
  </div>
 </main>;
}

export function StudioLogin(){
 const [mode,setMode]=useState<Mode>('login');
 const [email,setEmail]=useState('');
 const [password,setPassword]=useState('');
 const [reveal,setReveal]=useState(false);
 const [busy,setBusy]=useState(false);
 const [message,setMessage]=useState('');
 const [error,setError]=useState(false);
 const submit=async(e:FormEvent)=>{
  e.preventDefault();if(!studioClient||busy)return;
  const value=normalized(email);
  if(!value){setMessage('Renseigne ton adresse e-mail.');setError(true);return}
  if(mode==='login'&&!password){setMessage('Renseigne ton mot de passe.');setError(true);return}
  setBusy(true);setMessage('');setError(false);
  try{
   if(mode==='login'){
    const {error:err}=await studioClient.auth.signInWithPassword({email:value,password});
    if(err)throw err;
   }else{
    const redirectTo=window.location.origin+'/?mode=reset';
    const {error:err}=await studioClient.auth.resetPasswordForEmail(value,{redirectTo});
    if(err)throw err;
    setMessage('Si ce compte existe, un e-mail de réinitialisation a été envoyé. Vérifie ta boîte de réception.');
   }
  }catch(ex){
   setError(true);
   const msg=ex instanceof Error?ex.message:'Erreur de connexion';
   setMessage(mode==='login'?
    (msg.toLowerCase().includes('invalid login')?'Identifiants incorrects. Vérifie ton e-mail et ton mot de passe.':msg):'Envoi impossible : '+msg);
  }finally{setBusy(false)}
 };
 return <Shell><div className="studio-auth-panel">
   <span className="studio-auth-kicker"><ShieldCheck size={15}/> Accès privé</span>
   <h2>{mode==='login'?'Bienvenue sur votre studio':'Définir un mot de passe'}</h2>
   <p className="studio-auth-intro">{mode==='login'?'Connectez-vous avec votre adresse e-mail professionnelle et votre mot de passe.':'Première connexion ou mot de passe oublié ? Recevez un lien sécurisé pour définir votre mot de passe.'}</p>
   <form onSubmit={submit} className="studio-auth-fields">
    <label htmlFor="login-email"><Mail size={16}/> Adresse e-mail</label>
    <input id="login-email" type="email" autoComplete="username" required placeholder="exemple@entreprise.com" value={email} onChange={e=>setEmail(e.target.value)} style={input}/>
    {mode==='login'&&<>
      <div className="studio-auth-label-between"><label htmlFor="login-password"><LockKeyhole size={16}/> Mot de passe</label><button type="button" className="studio-auth-link" onClick={()=>{setMode('forgot');setMessage('')}}>Mot de passe oublié ?</button></div>
      <div className="studio-password-input"><input id="login-password" type={reveal?'text':'password'} required autoComplete="current-password" placeholder="Votre mot de passe" value={password} onChange={e=>setPassword(e.target.value)} style={{...input,paddingRight:48}}/><button type="button" title={reveal?'Masquer le mot de passe':'Afficher le mot de passe'} onClick={()=>setReveal(x=>!x)}>{reveal?<EyeOff size={19}/>:<Eye size={19}/>}</button></div>
    </>}
    {message&&<div role="status" className={'studio-auth-feedback '+(error?'studio-auth-error':'studio-auth-ok')}>{message}</div>}
    <button type="submit" disabled={busy} style={{...btn,opacity:busy?.7:1}}>{busy?<Loader2 className="studio-spin" size={19}/>:mode==='login'?<ArrowRight size={19}/>:<Mail size={19}/>} {mode==='login'?'Se connecter':'Envoyer le lien de configuration'}</button>
   </form>
   {mode==='forgot'&&<button type="button" className="studio-auth-back" onClick={()=>{setMode('login');setMessage('');setError(false)}}>Retour à la connexion</button>}
   <div className="studio-auth-foot"><CircleHelp size={17}/><span>Une fois connecté, votre session reste active sur cet appareil tant que vous ne vous déconnectez pas ou que la session n’est pas révoquée.</span></div>
 </div></Shell>;
}

export function StudioOnboarding({mode,email,onComplete,firstName='',lastName=''}:{mode:SetupMode;email:string;onComplete:()=>void;firstName?:string;lastName?:string}){
 const [first,setFirst]=useState(firstName);
 const [last,setLast]=useState(lastName);
 const [password,setPassword]=useState('');
 const [confirmation,setConfirmation]=useState('');
 const [reveal,setReveal]=useState(false);
 const [busy,setBusy]=useState(false);
 const [message,setMessage]=useState('');
 const [success,setSuccess]=useState(false);
 const submit=async(e:FormEvent)=>{
  e.preventDefault();
  if(!studioClient||busy)return;
  if(mode==='setup'&&(!first.trim()||!last.trim())){setMessage('Renseigne ton nom et ton prénom.');return}
  if(password.length<12){setMessage('Choisis un mot de passe de 12 caractères minimum.');return}
  if(password!==confirmation){setMessage('Les deux mots de passe ne correspondent pas.');return}
  setBusy(true);setMessage('');
  try{
   const {error}=await studioClient.auth.updateUser({password,data:mode==='setup'?{first_name:first.trim(),last_name:last.trim()}:{}});
   if(error)throw error;
   setSuccess(true);
   window.history.replaceState({},'',window.location.pathname);
   onComplete();
  }catch(ex){setMessage(ex instanceof Error?ex.message:'Échec de la configuration. Réessaie.')}
  finally{setBusy(false)}
 };
 return <Shell><div className="studio-auth-panel">
  <span className="studio-auth-kicker"><KeyRound size={15}/> {mode==='setup'?'Activation du compte':'Sécurité du compte'}</span>
  <h2>{mode==='setup'?'Bienvenue dans votre espace':'Créer votre nouveau mot de passe'}</h2>
  <p className="studio-auth-intro">{mode==='setup'?'Finalisez votre profil. Votre marque a déjà été attribuée par un administrateur.':'Choisissez votre nouveau mot de passe pour retrouver votre espace.'}</p>
  <form onSubmit={submit} className="studio-auth-fields">
   {mode==='setup'&&<div className="studio-onboarding-names">
    <div><label htmlFor="setup-first">Prénom</label><input id="setup-first" required value={first} onChange={e=>setFirst(e.target.value)} autoComplete="given-name" style={input}/></div>
    <div><label htmlFor="setup-last">Nom</label><input id="setup-last" required value={last} onChange={e=>setLast(e.target.value)} autoComplete="family-name" style={input}/></div>
   </div>}
   <label htmlFor="setup-email"><Mail size={16}/> Adresse e-mail vérifiée</label>
   <input id="setup-email" type="email" readOnly value={email} style={{...input,background:'#edf2fa',color:'#52617c'}}/>
   <label htmlFor="setup-password"><LockKeyhole size={16}/> Nouveau mot de passe (12 caractères minimum)</label>
   <div className="studio-password-input"><input id="setup-password" type={reveal?'text':'password'} required value={password} onChange={e=>setPassword(e.target.value)} autoComplete="new-password" style={{...input,paddingRight:48}}/>
    <button type="button" title="Afficher / masquer" onClick={()=>setReveal(x=>!x)}>{reveal?<EyeOff size={18}/>:<Eye size={18}/>}</button></div>
   <label htmlFor="setup-confirm">Confirmer le mot de passe</label>
   <input id="setup-confirm" type={reveal?'text':'password'} required value={confirmation} onChange={e=>setConfirmation(e.target.value)} autoComplete="new-password" style={input}/>
   {message&&<div role="alert" className="studio-auth-feedback studio-auth-error">{message}</div>}
   {success&&<div role="status" className="studio-auth-feedback studio-auth-ok">Compte configuré.</div>}
   <button type="submit" disabled={busy} style={{...btn,opacity:busy?.7:1}}>{busy?<Loader2 className="studio-spin" size={18}/>:<CheckCircle2 size={18}/>} {mode==='setup'?'Activer mon compte':'Enregistrer mon mot de passe'}</button>
  </form>
  <div className="studio-auth-foot"><ShieldCheck size={17}/><span>Vos identifiants sont protégés par Supabase Auth. L’accès aux marques dépend de l’autorisation définie par l’administrateur.</span></div>
 </div></Shell>;
}
