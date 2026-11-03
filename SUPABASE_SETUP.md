# Supabase — mise en service de Zenithis Content Studio

## État
L'intégration Next.js et le schéma SQL sont présents dans le dépôt. Sans projet Supabase configuré et sans membres autorisés, **l'application n'enregistre rien dans une base distante** et affiche un écran explicite de configuration.

## 1. Créer un projet
Dans https://supabase.com/dashboard/projects, créer un projet intitulé `zenithis-content-studio` dans votre organisation Supabase. Conserver son mot de passe de base dans Supabase uniquement, ne jamais le mettre dans GitHub ni dans un chat.

## 2. Installer la structure
Dans Supabase > SQL Editor, ouvrir le contenu de [supabase/migrations/20261103_zenithis_studio.sql](supabase/migrations/20261103_zenithis_studio.sql), l'exécuter sur le projet voulu. Vérifier que `public.studio_documents`, `public.studio_members` et le bucket privé `studio-media` existent. Les règles RLS empêchent les utilisateurs non autorisés de lire ou modifier les données.

## 3. Variables Vercel
Supabase > Project Settings > API : copier **Project URL** et **Publishable/anon key** (PAS la `service_role`).
Dans https://vercel.com/domera-8841/zenithis-content-studio/settings/environment-variables, ajouter :
- `NEXT_PUBLIC_SUPABASE_URL` = URL Supabase
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` = clé publique anon / publishable

Cibler Production, Preview et Development si nécessaire. Redéployer la branche main après l'enregistrement des variables. Ne jamais enregistrer la clé `service_role` dans `NEXT_PUBLIC_*`.

## 4. Autoriser l'administrateur
Dans Supabase > Authentication > URL Configuration, ajouter l'URL du site `https://zenithis-content-studio-mu.vercel.app/` aux redirections autorisées.

Ouvrir l'application, demander le lien de connexion par courriel, puis cliquer le lien reçu. Lors de la première connexion, l'accès aux documents sera refusé tant que le compte n'est pas autorisé.

Dans Supabase > SQL Editor, exécuter **en remplaçant l'adresse d'exemple par l'email autorisé** :

```sql
insert into public.studio_members (user_id, brand_id, role)
select u.id, brands.brand_id, 'admin'
from auth.users u
cross join (values ('bonas'), ('lzo')) brands(brand_id)
where u.email = 'VOTRE_EMAIL@example.com'
on conflict (user_id,brand_id) do update set role = 'admin';
```

Actualiser l'application : les deux espaces sont chargés depuis PostgreSQL. Les nouvelles images sont téléversées dans le bucket privé Supabase.

## 5. Vérifier (indispensable)
1. Se connecter en tant qu'administrateur.
2. Modifier le titre d'une publication BONAS-INC, attendre le message **« enregistrées dans Supabase »**, recharger et vérifier le titre.
3. Importer une image JPG de petite taille dans la médiathèque de LZO Empire, recharger et vérifier que l'image est encore visible.
4. Vérifier dans Supabase > Table Editor que `studio_documents` contient les deux marques et que `version` augmente.
5. Vérifier dans Supabase > Storage > `studio-media` que le nouveau fichier existe sous `lzo/...`.
6. Tester un autre navigateur : seul un utilisateur connecté et autorisé doit accéder au contenu.

## Points d'attention
- Le site s'ouvre désormais avec une page de connexion au lieu d'un faux mode « sauvegarde locale » lorsque Supabase est configuré.
- Le premier chargement peut importer les anciens brouillons du navigateur où le compte était utilisé, uniquement si aucun document distant n'existe. N'écrasez pas les données d'un collaborateur sans sauvegarde.
- Les URL signées des médias expirent et sont renouvelées au chargement. Le bucket reste privé.
- Le stockage est en JSONB par marque : adapté à cette première version, mais une future évolution vers des tables normalisées par publication facilitera l'historique et l'édition simultanée.
- La création du projet Supabase et l'exécution SQL doivent réellement être faites avant d'annoncer l'application « opérationnelle ».
