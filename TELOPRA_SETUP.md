# TeloPra → Zenithis Content Studio

## État et architecture

L'intégration utilise **Evolution API, déjà hébergée par TeloPra**, en lecture seule.

```text
TeloPra / Evolution API (WhatsApp connecté)
          │ API HTTPS + clé de l'instance
          ▼
Supabase Edge Function telopra-bridge
          │ autorisation JWT + permission de marque
          ├── Supabase Vault (clé chiffrée, accès service_role uniquement)
          └── Supabase PostgreSQL
               ├── studio_telopra_status
               ├── studio_telopra_chats
               └── studio_telopra_messages
          ▼
Zenithis Content Studio → WhatsApp & présentations
```

L'hébergement Evolution existant est décrit dans le dépôt d'infrastructure privé `Zenethis-CMR/zenithis-automation-platform` (LXC 1400, n8n, Evolution API et PostgreSQL). Aucune modification du conteneur TeloPra ni aucune reconnexion par QR code n'est nécessaire **si le point d'accès API et une clé d'instance restent opérationnels**. Aucune requête d'envoi WhatsApp n'est exécutée par cette intégration.

### Étape indispensable — autoriser l'origine TeloPra côté serveur

Dans **Supabase > Edge Functions > Secrets**, définir :

```text
TELOPRA_ALLOWED_ORIGINS=https://api.exemple-telopra.tld
```

Remplacer la valeur illustrative par **l'origine HTTPS exacte**, sans chemin, où Evolution API est accessible depuis Supabase Edge. Pour plusieurs hôtes, séparer les origines autorisées par des virgules. **Ne jamais ajouter localhost, une adresse IP privée, une URL HTTP ou une origine arbitraire**.

L'URL est **inconnue dans ce dépôt** et n'a pas été devinée. Sans cette configuration, le formulaire renvoie une erreur explicite et aucun secret n'est enregistré.

Si TeloPra n'est accessible que depuis un réseau interne LXC, ne pas ouvrir sans authentification sa base ni ses endpoints. Prévoir un reverse proxy HTTPS authentifié ou un petit connecteur sortant TeloPra → Supabase, avec contrat d'API validé. La base et les sessions WhatsApp de TeloPra ne doivent pas être copiées ni exposées.

### Connexion des marques

1. Se connecter à Zenithis Studio comme super-administrateur ou propriétaire de la marque.
2. Ouvrir **WhatsApp & présentations**.
3. Cliquer **Connecter TeloPra**.
4. Saisir l'URL HTTPS de l'API Evolution, le **nom exact de l'instance** et **sa clé API limitée à cette instance**.
5. **Tester et connecter** vérifie `GET /instance/connectionState/{instance}`, puis enregistre la clé via Supabase Vault.
6. Si l'accès est valide, une première synchronisation est déclenchée.
7. Répéter pour l'autre marque, en associant bien chaque instance à son espace.

La clé ne doit pas être collée dans un chat, une issue GitHub, une variable `NEXT_PUBLIC_*` ou un fichier du dépôt.

### Synchronisation

Le Studio lit `POST /chat/findChats/{instance}` puis `POST /chat/findMessages/{instance}` (Evolution API v2), sans appeler les endpoints d'envoi. Une synchronisation importe **au maximum 60 conversations**, et jusqu'à **15 messages dans 20 conversations** parmi ces 60. Les lignes sont mises à jour par clés uniques : les synchronisations répétées n'ajoutent pas de doublons.

Les utilisateurs disposant des droits d'édition peuvent synchroniser manuellement. Tant que ce module reste ouvert sur un navigateur, il déclenche également un rafraîchissement toutes les 15 minutes. **Il n'y a pas encore de synchronisation 24 h/24 lorsque personne n'a ouvert le Studio** ; cela nécessitera une tâche planifiée côté serveur ou un webhook TeloPra.

### Confidentialité et autorisations

- **Super-administrateur et propriétaire :** configuration de la connexion, synchronisation, lecture.
- **Éditeur :** synchronisation et lecture, sans accès à la clé.
- **Lecteur :** consultation des conversations autorisées uniquement.
- Les politiques PostgreSQL RLS isolent les discussions des marques BONAS-INC et LZO Empire.
- La clé est chiffrée dans **Supabase Vault**, jamais exposée dans les réponses de l'API de données.

### Limites contractuelles à lever

Le dépôt d'infrastructure documente **Evolution API**, mais aucun contrat métier TeloPra n'a été découvert dans les dépôts accessibles. Pour alimenter automatiquement les étapes de qualification, les inscriptions, les groupes, les relances, les résultats des workflows n8n et les statuts des prospects, il faudra un endpoint ou un webhook **TeloPra métier** ainsi que le mapping des instances. Les valeurs affichées par le nouveau panneau sont pour l'instant des conversations et messages récents : ne pas les confondre avec des inscriptions ni des ventes.

### Vérifications avant validation

- [ ] Origine HTTPS et clé de chaque instance configurées sans clé globale partagée
- [ ] Instance BONAS-INC reconnue comme connectée ; import de vraies conversations
- [ ] Rechargement de la page : données conservées
- [ ] Instance LZO Empire connectée indépendamment
- [ ] Utilisateur Laurence ne peut lire ni connecter la marque BONAS-INC
- [ ] Utilisateur Sandrine ne peut lire ni connecter la marque LZO Empire
- [ ] Un lecteur peut lire mais pas relancer la synchronisation
- [ ] Les messages lus correspondent aux données affichées dans TeloPra
- [ ] Aucune clé sensible n'apparaît dans le navigateur, GitHub ou les réponses publiques

Les scripts SQL sont dans `supabase/migrations/20261103_telopra_connector.sql` et la fonction source dans `supabase/functions/telopra-bridge/index.ts`.
