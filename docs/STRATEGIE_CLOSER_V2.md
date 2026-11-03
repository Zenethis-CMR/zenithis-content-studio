# Zenithis Content Studio — Reconstitution stratégique et programme « Closer 2.0 » (03/11/2026)

## Projet et périmètre réel
- Référentiel : `Zenethis-CMR/zenithis-content-studio`.
- Marques : **LZO Empire** (Laurence Fedjou Zonfack, mot-clé `AVENIR`) et **BONAS-INC** (Sandrine Mamiafo, mot-clé `PLAN B`).
- Canal principal : des contenus sociaux vers un DM WhatsApp individuel, puis présentation, réponses, éventuel accompagnement et décision éclairée.
- Groupe de découverte partagé entre Laurence et Sandrine. L'entrée est volontaire; chaque discussion privée demeure propre à sa marque.
- TeloPra héberge les sessions WhatsApp existantes et l'automatisation via Evolution API / n8n. Le Studio est l'outil de préparation, d'observation et de suivi humain, **sans envoi automatique**.
- Architecture actuelle : Next.js, Supabase (bibliothèques privées, documents éditables, rôles, stockage privé, RLS), panneau de synchronisation TeloPra en lecture seule. Les données de conversations TeloPra ne doivent pas être confondues avec des ventes ou inscriptions.

## Diagnostic de l'audit
- 56 publications, 184 déclinaisons de réseau, 16 scénarios vidéo et 8 présentations par marque.
- Dans chaque marque, les **8 messages d'accueil** des événements sont rigoureusement identiques; les rappels et suivis le sont également. La duplication vient du schéma `GroupEvent` par semaine et du rendu de l'étape « Conversation privée » sur l'ensemble des événements.
- Les textes du calendrier sont distincts, mais plusieurs sont pédagogiques ou défensifs dès le premier contact, avec un CTA quasi uniforme « PRÉSENTATION ». Ils expliquent avant d'avoir suscité l'envie.
- L'interface ne distinguait pas les réponses d'accueil pérennes, la qualification, l'invitation facultative au groupe, les rappels datés et les réponses aux objections.

## Proposition de valeur, émotion et exactitude
**Promesse directrice** : « Découvre une nouvelle piste pour préparer ton après, sans avoir à tout bouleverser aujourd'hui. Tu verras le fonctionnement, les étapes et les conditions pour décider en connaissance de cause. »
- Faire naître une image du futur : plus de choix, un projet personnel, une compétence nouvelle, un Plan B à évaluer.
- Rendre **la première étape facile** : écrire un mot, poser une question, recevoir un résumé, participer à une présentation accessible.
- Ne jamais faire paraître le **résultat financier** facile ou certain. Une activité commerciale peut demander dépenses, temps, compétences, prospection et comporte un risque de revenu nul.
- Ni gains chiffrés non prouvés, ni témoignages inventés, ni fausses urgences ou rareté artificielle, ni effacement des conditions substantielles.

## Positionnement distinct

### LZO Empire
- Identité : **« Je construis mon après »** ; expérience de vie, passage du temps, transition, sérénité, avenir et choix.
- Expérience éditoriale : « 9 ans de leçons » ; voix posée, mature, digne de confiance.
- Mots-clés : `AVENIR`, `PLUS DE CHOIX`, `ACTIVITÉ`, `PRÉSENTATION`.
- CTA principal : « Écris AVENIR et je t'explique le premier pas. »

### BONAS-INC
- Identité : **« Mon Plan B commence par une décision simple : m'informer. »**
- Valeur : une femme active, du concret, des explications directes, le sentiment d'agir aujourd'hui sur ses options de demain.
- Mots-clés : `PLAN B`, `LIBERTÉ`, `DÉCOUVRIR`, `PRÉSENTATION`.
- CTA principal : « Écris PLAN B pour découvrir par où commencer. »

## Parcours commercial humain
| Étape | Intention du prospect | Action et message | Critère de passage |
| --- | --- | --- | --- |
| 1. Curiosité | « Et si ? » | Une histoire reconnaissable + un bénéfice désiré + un mot-clé | DM entrant |
| 2. Accueil | « Est-ce pour moi ? » | Réponse rapide selon mot-clé, puis **une seule** question de qualification | Besoin formulé |
| 3. Projection | « Je pourrais peut-être » | Décrire une évolution possible sans revenu garanti | Demande d'information |
| 4. Groupe | « Je veux observer » | Demander le consentement avant de partager le lien | Entrée volontaire |
| 5. Présentation | « Comment ça marche ? » | Date/heure/lien confirmés, présentation réelle du modèle, des produits et des obligations | Participation |
| 6. Objections | « Quels risques et conditions ? » | Temps, coût, niveau de compétence, vente, résultats, confiance; réponse documentée | Questions résolues |
| 7. Décision | « Est-ce adapté à moi ? » | Coach pour les conditions exactes, temps de réflexion sans pression | Choix éclairé |
| 8. Relation | « Et maintenant ? » | Onboarding adapté ou clôture respectueuse, jamais de relance illimitée | Prochaine étape consentie |

**Règle anti-duplication** : un seul accueil canonique par intention, réutilisable pendant les 8 semaines. Les événements hebdomadaires ne contiennent que les éléments spécifiques à la présentation : thème, invitation, rappel, suite. Les réponses ne sont pas copiées-collées automatiquement : la personne qui répond vérifie le contexte.

## Calendrier éditorial de 8 semaines

| Semaine | Émotion centrale | LZO Empire | BONAS-INC | Transition WhatsApp |
| --- | --- | --- | --- | --- |
| S1 | Se reconnaître | « Le prochain chapitre peut commencer par une question » | « Ma vie est remplie; et si je me laissais une option ? » | Intention et envie |
| S2 | Possibilité | « Pas besoin d'avoir 20 ans pour apprendre autre chose » | « Une petite porte d'entrée, pas un changement brutal » | Expliquer le premier pas |
| S3 | Prise de conscience | « Le futur ne se prépare pas toujours tout seul » | « Le jour où je cesse de repousser mes questions » | Qualifier le besoin |
| S4 | Accessibilité | « Un carnet, un téléphone, une question » | « Comprendre en 30 minutes avant de décider » | Inscription à la présentation |
| S5 | Identification | « Une conversation change une perspective » | « Je n'ai pas besoin d'être experte pour m'informer » | Groupe facultatif |
| S6 | Confiance | « Les questions importantes avant de s'engager » | « Un vrai projet mérite de vrais détails » | Présenter les conditions |
| S7 | Projection | « Ce que je veux pouvoir choisir demain » | « Et si mon Plan B avait un premier rendez-vous ? » | Invitation personnelle |
| S8 | Décision | « L'avenir se construit avec des choix informés » | « Mon prochain chapitre commence par une conversation » | Coaching / décision |

### Matrice des sept prises de parole hebdomadaires
1. **Lundi — histoire / question forte** : une situation familière, puis une image désirable du futur.
2. **Mardi — premier pas accessible** : montrer une action concrète et peu complexe pour découvrir le modèle.
3. **Mercredi — interaction** : question binaire ou mot-clé sur le besoin du public.
4. **Jeudi — vidéo verticale** : une transformation de perspective, et non une promesse de revenu.
5. **Vendredi — conversation communautaire** : objection ou question avec une réponse utile.
6. **Samedi — confiance / preuve** : démonstration, processus ou expérience authentique vérifiée.
7. **Dimanche — invitation** : offre claire de présentation, objectif et conditions, un seul CTA.

Ne pas réutiliser exactement le même CTA dans les 7 contenus. Alterner commentaire simple, question DM, ressource et inscription suivant le niveau d'intention. Chaque contenu doit avoir un hook unique et un argument de fond distinct. Les scripts vidéo doivent prolonger l'histoire racontée par la publication correspondante.

## Bibliothèque WhatsApp V2
Source code : `lib/closing-playbooks.ts`.
- 17 situations par marque, réparties sur 4 étapes.
- 5 accueils / qualifications, 3 messages de groupe et de projection, 3 confirmations / rappels, 6 réponses de suivi et d'objection.
- Chaque fiche contient une intention d'entrée (mot-clé ou situation), un texte personnalisable et une prochaine action.
- Champs `[date]`, `[heure]` et `[lien]` restent des placeholders : **ne pas envoyer sans les renseigner avec une information confirmée**.
- Une clôture ne doit pas transformer des messages en harcèlement : respecter l'absence de consentement et la réponse négative.

## Priorités et contrôle qualité
1. Donner aux opératrices des messages **différents selon l'étape réelle**, pas des duplications par semaine.
2. Enrichir les accroches du calendrier en trois couches : désir → preuve/pratique → invitation, sans remplacer l'information réelle par des affirmations non documentées.
3. Synchroniser le statut via TeloPra seulement après définition d'un contrat métier fiable; TeloPra demeure maître des automatisations.
4. Tableau de bord commercial : messages entrants, réponses qualifiées, inscriptions confirmées, présences, rendez-vous coach et engagements **vérifiés**, avec attribution par marque. Ne pas calculer des ventes à partir des messages.
5. Prévisualisation mobile et desktop, vérifier copie, navigation directe, absence de relance automatique et isolation des données entre marques.

## Protection des données éditoriales en place
La base Supabase contient les bibliothèques source dans `studio_libraries` et les copies de travail dans `studio_documents`. **Modifier uniquement la bibliothèque source ne suffit pas à modifier une copie de travail déjà créée.** Une opération de migration éditoriale doit protéger les modifications existantes, vérifier l'égalité de départ, conserver une possibilité de retour et incrémenter les versions correctement. Cette branche apporte une interface éditoriale réutilisable; elle ne déclenche ni campagne, ni publication, ni envoi WhatsApp.
