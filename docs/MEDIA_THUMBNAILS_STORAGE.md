# Zenithis Studio — Miniatures, médiathèque et stratégie de stockage

## Fonctionnalité V5

- Une vignette adaptée au format est montrée dans les listes de contenu, le planning, les cellules du calendrier, l’agenda, le Kanban et l’éditeur.
- Si aucun média n’est encore lié, une composition vectorielle sémantique sert d’aperçu provisoire, avec le libellé **Visuel à produire**. Ce n’est ni un fichier prêt à publier ni un faux photomontage de Sandrine/Laurence.
- L’éditeur permet d’associer un média de la médiathèque via `coverMediaId` (simple champ optionnel dans le JSON de `studio_documents`). Les contenus existants restent compatibles.
- Pour les carrousels, l’éditeur permet de sélectionner plusieurs images dans `mediaIds` et de choisir une couverture. Les exports finaux de carrousel et le rendu vidéo ne sont pas générés automatiquement.
- Les médias sont isolés par marque et protégés par RLS/stockage Supabase privé.

## Import et prévisualisation

- Images JPEG/PNG/WebP/GIF, MP4, WebM et PDF. Les vidéos sont prévisualisées dans un lecteur HTML5 avec contrôles.
- Pour les vidéos locales, une image d’aperçu JPEG est capturée dans le navigateur lorsque le codec et l’appareil le permettent; en cas d’échec, un visuel vidéo de remplacement est montré.
- Les vignettes d’aperçu sont stockées dans le même bucket privé, sous `bonas/posters` ou `lzo/posters`, et livrées par URL signée.
- Les images provenant de banques libres sont saisies via l’URL directe de `images.unsplash.com` ou `images.pexels.com`, plus la fiche source et le crédit. Le studio ne prétend pas vérifier automatiquement les droits de tiers.
- Ajouter un média réel à la médiathèque n’entraîne **aucune publication sur les réseaux**.

## Limites actuellement observées (3 novembre 2026)

- Bucket privé `studio-media`; accepte déjà `video/mp4` et `video/webm` en plus des images et PDF.
- Limite spécifique du bucket : 26 214 400 octets, soit **25 Mio**. La V5 conserve cette limite, cohérente avec le fournisseur actuel. Ne pas annoncer de support de vidéos longues au-delà.
- Pour les fichiers supérieurs à environ **6 Mo**, Supabase recommande **TUS resumable upload** pour fiabiliser les transferts, en particulier avec une connexion mobile instable : https://supabase.com/docs/guides/storage/uploads/resumable-uploads
- Les performances et le quota de stockage total dépendent de l’abonnement. Un stockage saturé ne doit pas déclencher une bascule silencieuse vers une URL externe non sécurisée.

## Extension future : Proxmox et stockage objet

Proxmox VE est une plate-forme d’infrastructure, pas directement un service d’objets S3. Pour stocker de gros volumes de médias, la solution privilégiée est un service compatible S3 **MinIO** ou **Ceph RADOS Gateway** hébergé sur un nœud/VM Proxmox, ou bien un stockage objet managé.

Modèle recommandé :

1. **Métadonnées neutres** : `mediaId`, `brandId`, `kind`, `provider`, `objectKey`, `posterKey`, `mimeType`, `size`, `origin`, `licenseUrl`, `credit`. Les publications ne référencent que le `mediaId`.
2. **Fournisseur** : `supabase` aujourd’hui; un adaptateur `s3-proxmox` ou `s3-managed` sera ajouté derrière une API serveur authentifiée.
3. **Permissions** : vérifier les rôles de marque avec l’identité Supabase côté serveur avant de créer un lien de chargement ou de lecture. Les liens signés doivent être courts et exclusivement individuels. Ne jamais exposer des credentials S3 dans le navigateur.
4. **Gros fichiers** : initier des sessions multipart/résumables directement vers le fournisseur objet pour éviter le transit par les fonctions Vercel; suivre les quotas, mettre en place une politique d’expiration des transferts incomplets.
5. **Dérivés** : queue de traitement asynchrone, capture des frames, formats 4:5 / 9:16 / 16:9, génération de versions compressées et de vignettes, sauvegardes et réplication hors site.
6. **Migration sans rupture** : déplacer les objets et afficher les deux fournisseurs en lecture jusqu’à vérification de chaque objet; conserver leurs identifiants stables. Ne pas modifier les documents éditoriaux lors de la bascule.

## Futur module de génération média

Pour des vidéos et images générées avec IA, prévoir une file de jobs avec : prompt, brief, marque, format, coût, fournisseur, états `queued / generating / review / ready / rejected`, stockage dans la médiathèque et validation humaine avant diffusion. Ce module **n’est pas activé** dans la V5; l’interface actuelle fournit le brief et le parcours d’association.

## Vérifications avant diffusion

- Test image, MP4, WebM, dépassement de 25 Mio; navigateur qui ne sait pas créer de poster; remplacement et suppression de couverture; association aux bons rôles et marques.
- Tester l’isolation Supabase RLS, les signed URLs après reconnexion, la conservation des médias après sauvegarde et le rendu responsive.
- Pour les images de banques, contrôler la licence, les droits des personnes reconnaissables, et mentionner le crédit s’il est dû.
