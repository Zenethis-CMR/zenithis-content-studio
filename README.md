# Zenithis Content Studio

Éditeur éditorial BONAS-INC et LZO Empire, hébergé sur Vercel. **La version sécurisée enregistre les modifications côté serveur**, et les médias dans un bucket privé.

## Infrastructure

- **Interface** : Next.js 15, React.
- **Accès** : mot de passe fort, session HTTP-only, cookie signé HMAC ; aucune clé de stockage dans le navigateur.
- **Images** : Vercel Blob privé, chaque image sous `media/{bonas|lzo}/{uuid}.{extension}` ; téléchargements via un endpoint authentifié.
- **Données éditoriales** : l'API `/api/workspaces` stocke les contenus, déclinaisons, scripts éditables, notes et KPI. En l'absence de PostgreSQL, un snapshot JSON est conservé dans Vercel Blob, durable mais **ce n'est pas une base de données relationnelle**.
- **Base PostgreSQL** : le projet prend en charge Supabase en priorité. Lorsque les variables `SUPABASE_URL` et `SUPABASE_SERVICE_ROLE_KEY` sont définies et la migration SQL appliquée, l'application transfère automatiquement les données du dernier snapshot Blob dans PostgreSQL si le workspace est absent. Aucune modification manuelle du contenu n'est nécessaire.

## Activer et sécuriser le studio

1. Sur Vercel, connecter un store **Blob privé** au projet ; vérifier que `BLOB_READ_WRITE_TOKEN` existe dans les environnements de production.
2. Configurer `STUDIO_ADMIN_PASSWORD` (mot de passe robuste) et `STUDIO_SESSION_SECRET` (secret aléatoire indépendant, min. 32 octets) dans **Vercel → Settings → Environment Variables**. Ne jamais écrire ces valeurs dans GitHub ni dans un fichier client.
3. Redéployer depuis `main`. L'écran de connexion protège tous les contenus modifiables et les téléchargements.
4. Pour PostgreSQL : créer un projet Supabase, appliquer [`supabase/migrations/20261103_studio_workspaces.sql`](supabase/migrations/20261103_studio_workspaces.sql) dans l'éditeur SQL Supabase. Ajouter `SUPABASE_URL` et `SUPABASE_SERVICE_ROLE_KEY` en tant que variables **serveur** Vercel (ne jamais utiliser le préfixe `NEXT_PUBLIC_` pour la clé service-role). Redéployer.

La migration SQL active RLS et révoque l'accès direct public aux tables. Le service-role Supabase est utilisé **uniquement** par des route handlers authentifiés côté serveur. Toute requête de modification concurrente incorrecte reçoit un conflit explicite plutôt que d'écraser silencieusement les données.

## Fonctionnalités enregistrées

- Édition / création de publications et de déclinaisons par réseau.
- Modification des **scripts vidéo** (accroche, narration et légende).
- Statuts, dates, notes internes, indicateurs de conversion.
- Upload d'images JPEG, PNG, WEBP ou GIF jusqu'à 4 Mo. Les fichiers sont privés et restent disponibles après rafraîchissement et entre navigateurs connectés.
- Export et import JSON de sauvegarde. Si un ancien navigateur possède les données du prototype V2, les documents et médias locaux compatibles sont migrés lors de la première connexion.

## Limitations explicites

- Une connexion d'équipe partagée par mot de passe, **pas encore de comptes individuels ni de rôles par marque**. Supabase Auth + permissions utilisateurs serait une évolution ultérieure.
- En stockage JSON Blob de secours, les écritures concurrentes sont contrôlées par un ETag, mais PostgreSQL est préférable pour un travail simultané intensif.
- **Aucune publication automatique** sur les réseaux sociaux ni envoi WhatsApp. Le calendrier est une programmation éditoriale, pas un outil de publication native.
- Vercel impose une limite de requête ~4,5 Mo aux uploads serveur. Les vidéos volumineuses nécessiteront une route de téléversement direct multipart, à ajouter.

## Développement local

```bash
npm install
cp .env.example .env.local
npm run dev
```

Les secrets restent uniquement dans `.env.local` ou les variables Vercel. `npm run typecheck` et `npm run build` vérifient le projet.
