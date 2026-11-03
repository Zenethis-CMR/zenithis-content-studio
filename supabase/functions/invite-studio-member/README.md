# Inviter un membre — Supabase Edge Function

La fonction `invite-studio-member` est déployée sur Supabase (JWT requis). Le code source serveur est géré dans Supabase.

1. Le propriétaire d'une marque ou le super-administrateur autorise d'abord l'e-mail dans `studio_brand_access` (politiques RLS).
2. L'application appelle la fonction avec le JWT de l'utilisateur : `{email, brand, role}`.
3. La fonction vérifie le JWT, l'autorisation `studio_may_invite`, ainsi que l'attribution enregistrée.
4. Elle appelle `auth.admin.inviteUserByEmail` côté serveur et redirige vers `https://zenithis-content-studio-mu.vercel.app/?mode=setup`.
5. Si l'e-mail a déjà un compte confirmé, la fonction envoie un lien de récupération de mot de passe.

Aucune clé `service_role` n'est exposée au navigateur. Les emails peuvent être limités par les quotas Supabase; configurez un SMTP adapté avant un usage intensif.

**Configuration obligatoire** : Supabase Authentication > URL Configuration : Site URL `https://zenithis-content-studio-mu.vercel.app`, et Redirect URLs avec `https://zenithis-content-studio-mu.vercel.app/**`.
