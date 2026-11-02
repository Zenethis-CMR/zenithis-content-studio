# Zenithis Content Studio

**Studio de production et de programmation éditoriale pour BONAS-INC et LZO Empire.**

Interface originale inspirée de conventions d'outils SaaS modernes : tableau de bord, calendrier, flux de programmation, Kanban, médiathèque, éditeur, scripts vidéo, campagnes éditoriales, séminaires WhatsApp, analyses et sources.

## Démarrer

```bash
npm install
npm run dev
```

Ouvrir `http://localhost:3000`.

## Déployer sur Vercel

1. Créer un dépôt GitHub privé et y pousser le contenu du projet.
2. Dans Vercel : `Add New → Project → Import Git Repository`.
3. Choisir ce dépôt. Framework détecté : **Next.js**. Aucune variable d'environnement nécessaire au prototype.
4. Activer **Deployment Protection** avant de partager le lien : les calendriers contiennent des données professionnelles.

## Données et limitations de la V1

- Les contenus sont importés de deux classeurs Excel distincts et versionnés dans `data/*.json`.
- Les modifications, les statuts, les médias personnels de petite taille et les notes persistent **localement dans le navigateur** (`localStorage`). Il n'y a **pas encore de synchronisation entre les membres de l'équipe**, de gestion des comptes ni de base de données serveur. Ne pas utiliser le prototype comme source de vérité unique sans exporter une sauvegarde JSON.
- La section « Programmation » gère un calendrier **éditorial** ; elle ne publie pas automatiquement sur Facebook, Instagram ou TikTok. Aucune API de publication réseau n'est connectée.
- Les analytics reflètent le suivi éditorial renseigné dans l'application, et non un flux de métriques Meta en temps réel.
- La médiathèque comprend des supports fournis par l'utilisateur. Les captures d'écran d'interface tierce ne sont pas incluses ni réutilisées comme création de l'application.
- Les échanges et messages WhatsApp ne sont pas envoyés automatiquement.

## Préparation production

Pour collaborer entre équipes, ajouter une base de données (ex. PostgreSQL), un système d'identité et de permissions, un stockage média durable (Blob/S3) et les API officielles des réseaux. L'application doit être protégée par authentification avant d'exposer des données privées.

## Organisation

- `app/` : Next.js App Router
- `components/Studio.tsx` : interface client et fonctionnalités
- `lib/` : modèles de données et utilitaires
- `data/` : 56 contenus / 184 variantes / 16 scripts / 8 séquences WhatsApp par marque
- `public/media/` : supports utilisateur approuvés
