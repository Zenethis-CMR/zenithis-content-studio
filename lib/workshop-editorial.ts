import type {BrandId} from './types';
/** Ateliers de découverte - 8 séances par marque. Pas d'envoi automatique, ni d'engagement financier garanti.
 * Les dates des événements sont conservées dans Supabase. Cette bibliothèque n'implique pas que les séances sont confirmées. */
export type WorkshopEditorial = {id:string;theme:string;greeting:string;invitation:string;reminder:string;followUp:string;flow:string;condition:string;status:string};
export const workshopEditorial:Record<BrandId,WorkshopEditorial[]> = {
  "bonas": [
    {
      "id": "WA-01",
      "theme": "Atelier 1 · Tu donnes tout à ta semaine. Et à tes projets, que reste-t-il ?",
      "greeting": "Bonjour 👋 C’est Sandrine. Merci pour ton intérêt pour « Tu donnes tout à ta semaine. Et à tes projets, que reste-t-il ? ». Qu’aimerais-tu pouvoir faire pour toi que tu repousses aujourd’hui ? Si tu veux, je peux t’expliquer le thème de notre prochaine rencontre et les informations à vérifier avant de participer.",
      "invitation": "Tu termines la semaine épuisée, et le dimanche tu penses déjà aux obligations du lundi ? Entre les dépenses, la famille et les urgences, ton propre projet finit souvent tout en bas de la liste.\n\nSandrine ouvre une discussion sur ce sentiment et présente une première façon de découvrir une activité commerciale digitale, à côté de sa vie actuelle. On parlera des premiers pas, mais aussi de ce qu’il faut vérifier avant de se lancer.\n\nSi tu veux regarder cette possibilité sans te précipiter, réponds « JE DÉCOUVRE » pour recevoir les informations du rendez-vous.",
      "reminder": "Ton échange avec Sandrine approche 🌿 Avant de nous retrouver, garde cette question en tête : qu’aimerais-tu avoir davantage de temps pour faire ? Vérifie le lien et l’horaire qui t’ont été confirmés en privé.",
      "followUp": "Merci pour cette discussion. Quand tu regardes ta semaine, qu’est-ce qui te ferait le plus de bien : davantage de souplesse, une nouvelle compétence ou simplement une piste à explorer ? Je peux t’envoyer une explication adaptée à ta réponse.",
      "flow": "Accueil : ce que notre quotidien laisse de côté → Découverte : les bases de l’activité et les produits → Premier pas : comment s’informer avec son téléphone → Questions : disponibilité, coûts et réalité du travail.",
      "condition": "Séance envisagée : date, heure, lien et intervenant à confirmer avant toute invitation. Aucune promesse de revenus ni de changement de vie. Les frais, les produits, les commissions et les efforts commerciaux doivent être précisés et vérifiés avant un engagement. Groupe WhatsApp uniquement avec accord explicite.",
      "status": "À configurer"
    },
    {
      "id": "WA-02",
      "theme": "Atelier 2 · Ton téléphone pourrait-il t’ouvrir une nouvelle compétence ?",
      "greeting": "Bonjour 👋 C’est Sandrine. Merci pour ton intérêt pour « Ton téléphone pourrait-il t’ouvrir une nouvelle compétence ? ». Quel usage professionnel de ton téléphone voudrais-tu mieux comprendre ? Si tu veux, je peux t’expliquer le thème de notre prochaine rencontre et les informations à vérifier avant de participer.",
      "invitation": "On a parfois vingt minutes pour faire défiler des vidéos, mais rarement pour découvrir quelque chose qui nous appartient. Et si ton téléphone servait aussi à comprendre une activité et des échanges avec des clients ?\n\nPendant cette séance de découverte, Sandrine montrera les gestes de départ d’une activité digitale : se renseigner sur une offre, apprendre à la présenter et comprendre le suivi client. Le téléphone facilite l’entrée ; il ne remplace pas l’apprentissage ni la prospection.\n\nTu veux voir les étapes, sans jargon ? Envoie « TÉLÉPHONE » en privé pour connaître le prochain créneau.",
      "reminder": "Pour notre découverte du digital, prévois simplement ton téléphone et, si tu veux, un carnet. Tu peux préparer cette question : à quoi ressemble une première conversation avec un client ? Le lien et l’horaire restent ceux reçus lors de ta confirmation.",
      "followUp": "Après cette présentation, quelle étape te paraît la plus accessible : comprendre les produits, te former ou apprendre à parler d’une offre ? Réponds-moi avec un seul point et je t’orienterai vers les détails utiles.",
      "flow": "Ouverture : du scroll à la curiosité → Démonstration pédagogique : produit, conversation, suivi → Conditions concrètes : temps, frais, compétences → Questions sur l’activité.",
      "condition": "Séance envisagée : date, heure, lien et intervenant à confirmer avant toute invitation. Aucune promesse de revenus ni de changement de vie. Les frais, les produits, les commissions et les efforts commerciaux doivent être précisés et vérifiés avant un engagement. Groupe WhatsApp uniquement avec accord explicite.",
      "status": "À configurer"
    },
    {
      "id": "WA-03",
      "theme": "Atelier 3 · Les sorties et les projets qu’on remet toujours à plus tard",
      "greeting": "Bonjour 👋 C’est Sandrine. Merci pour ton intérêt pour « Les sorties et les projets qu’on remet toujours à plus tard ». Quel projet familial ou personnel aimerais-tu ne plus repousser ? Si tu veux, je peux t’expliquer le thème de notre prochaine rencontre et les informations à vérifier avant de participer.",
      "invitation": "Tu connais cette phrase : « On fera ce voyage plus tard, quand ce sera plus simple » ? Parfois ce sont de petites choses qu’on reporte : une sortie, une formation, une surprise pour les enfants.\n\nSandrine propose un moment pour parler de ces projets sans vendre une recette miracle. Nous verrons une piste de commerce digital, comment se renseigner sur les produits et les conditions, et pourquoi il faut distinguer une aspiration d’un résultat financier garanti.\n\nSi cette discussion te parle, écris « MES PROJETS » et je te partagerai les informations de découverte.",
      "reminder": "Notre échange sur les projets repoussés approche 💛 Prépare, si tu le souhaites, une envie personnelle que tu aimerais voir avancer. Tu n’auras rien à prouver : la rencontre sert à comprendre et à poser des questions.",
      "followUp": "Merci d’avoir partagé ce moment. Quelle idée t’a donné envie de te renseigner davantage ? Et quelle question reste ouverte sur le temps à consacrer, les dépenses ou le fonctionnement ? Je peux t’aider à trouver l’information.",
      "flow": "Discussion : les envies qu’on repousse → Présentation : ce que l’activité propose réellement → Conditions : comment évaluer le modèle sans confusion → Questions libres et décision sans pression.",
      "condition": "Séance envisagée : date, heure, lien et intervenant à confirmer avant toute invitation. Aucune promesse de revenus ni de changement de vie. Les frais, les produits, les commissions et les efforts commerciaux doivent être précisés et vérifiés avant un engagement. Groupe WhatsApp uniquement avec accord explicite.",
      "status": "À configurer"
    },
    {
      "id": "WA-04",
      "theme": "Atelier 4 · D’un simple message à la découverte d’un vrai modèle commercial",
      "greeting": "Bonjour 👋 C’est Sandrine. Merci pour ton intérêt pour « D’un simple message à la découverte d’un vrai modèle commercial ». Quelle étape te paraît aujourd’hui la plus floue ? Si tu veux, je peux t’expliquer le thème de notre prochaine rencontre et les informations à vérifier avant de participer.",
      "invitation": "Beaucoup imaginent qu’il faut un site sophistiqué, un bureau ou des milliers d’abonnés pour commencer à s’intéresser au commerce digital. Pour apprendre de quoi il s’agit, le premier geste peut être beaucoup plus simple.\n\nSandrine expliquera le chemin de découverte : poser une question, comprendre une offre, assister à une présentation, examiner les produits et les règles avant toute décision. Le rendez-vous est conçu pour clarifier, pas pour pousser à acheter.\n\nTu veux voir comment se déroule ce parcours ? Demande-moi « LES ÉTAPES » en privé.",
      "reminder": "C’est bientôt notre atelier sur les premières étapes. Note une question qui t’empêche d’aller plus loin : produits, conditions, clientèle ou accompagnement ? Nous la prendrons en compte pendant l’échange.",
      "followUp": "Tu as découvert les étapes. Laquelle aimerais-tu détailler maintenant : les produits, la relation client, l’accompagnement ou les frais éventuels ? Un seul point suffit pour continuer utilement.",
      "flow": "Vue d’ensemble du parcours → Présentation du modèle et des produits → Exemples de tâches commerciales, sans résultats inventés → Conditions et questions → Prochain échange facultatif.",
      "condition": "Séance envisagée : date, heure, lien et intervenant à confirmer avant toute invitation. Aucune promesse de revenus ni de changement de vie. Les frais, les produits, les commissions et les efforts commerciaux doivent être précisés et vérifiés avant un engagement. Groupe WhatsApp uniquement avec accord explicite.",
      "status": "À configurer"
    },
    {
      "id": "WA-05",
      "theme": "Atelier 5 · Tu n’as pas besoin de tout savoir pour commencer à apprendre",
      "greeting": "Bonjour 👋 C’est Sandrine. Merci pour ton intérêt pour « Tu n’as pas besoin de tout savoir pour commencer à apprendre ». Quelle compétence te semble aujourd’hui la plus intimidante ? Si tu veux, je peux t’expliquer le thème de notre prochaine rencontre et les informations à vérifier avant de participer.",
      "invitation": "« Je ne sais pas vendre », « je ne suis pas à l’aise sur les réseaux », « je n’y connais rien » : ces phrases empêchent parfois de poser la première question.\n\nSandrine consacrera cette présentation aux compétences qu’on peut apprendre progressivement : comprendre un produit, échanger avec respect, expliquer clairement et suivre une personne intéressée. Une compétence se construit, elle ne s’improvise pas.\n\nSi tu pars de zéro et veux comprendre sans te sentir jugée, envoie « J’APPRENDS ».",
      "reminder": "Notre atelier sur les compétences approche. Viens avec ta question la plus simple, même si tu crois qu’elle est évidente. Nous expliquerons les bases, et aussi le travail nécessaire pour progresser.",
      "followUp": "Qu’est-ce qui te semblait compliqué avant l’atelier et paraît plus clair maintenant ? Si tu souhaites approfondir, nous pouvons parler d’un apprentissage concret, sans te demander de prendre une décision immédiatement.",
      "flow": "Départ : les idées qui nous freinent → Compétences : produits, écoute, présentation, suivi → Accompagnement disponible à confirmer → Charge de travail et questions.",
      "condition": "Séance envisagée : date, heure, lien et intervenant à confirmer avant toute invitation. Aucune promesse de revenus ni de changement de vie. Les frais, les produits, les commissions et les efforts commerciaux doivent être précisés et vérifiés avant un engagement. Groupe WhatsApp uniquement avec accord explicite.",
      "status": "À configurer"
    },
    {
      "id": "WA-06",
      "theme": "Atelier 6 · Avant de te lancer : temps, dépenses et vraie réalité du terrain",
      "greeting": "Bonjour 👋 C’est Sandrine. Merci pour ton intérêt pour « Avant de te lancer : temps, dépenses et vraie réalité du terrain ». Quelle information dois-tu absolument vérifier avant d’envisager un engagement ? Si tu veux, je peux t’expliquer le thème de notre prochaine rencontre et les informations à vérifier avant de participer.",
      "invitation": "On voit beaucoup de belles images, mais rarement les questions importantes derrière une activité : combien faut-il apprendre ? Quels frais existent ? Faut-il chercher des clients ?\n\nCette rencontre est réservée aux réponses concrètes. Sandrine présentera les points à éclaircir avec la coach : produits, conditions de départ, commissions, prospection, coûts éventuels et risques de ne pas obtenir de revenus.\n\nTu veux comprendre ce qu’il y a derrière les promesses ? Réponds « QUESTIONS » pour recevoir les détails du rendez-vous.",
      "reminder": "Pour notre échange « les vraies questions », prépare ce qui compte vraiment pour toi : temps, prix, clients ou accompagnement. Si un chiffre ne peut pas être vérifié, nous le signalerons plutôt que de l’inventer.",
      "followUp": "Merci d’avoir posé des questions importantes. Quel point manque encore de documents ou d’explications ? Nous pouvons le transmettre à la coach avant toute décision, notamment sur les frais et les commissions.",
      "flow": "Les idées reçues → Dépenses et risques à documenter → Travail réel : apprentissage, relation client, prospection → Questions et documents à obtenir.",
      "condition": "Séance envisagée : date, heure, lien et intervenant à confirmer avant toute invitation. Aucune promesse de revenus ni de changement de vie. Les frais, les produits, les commissions et les efforts commerciaux doivent être précisés et vérifiés avant un engagement. Groupe WhatsApp uniquement avec accord explicite.",
      "status": "À configurer"
    },
    {
      "id": "WA-07",
      "theme": "Atelier 7 · Pendant les fêtes, qu’est-ce que tu aimerais avoir plus souvent ?",
      "greeting": "Bonjour 👋 C’est Sandrine. Merci pour ton intérêt pour « Pendant les fêtes, qu’est-ce que tu aimerais avoir plus souvent ? ». Quel moment en famille aimerais-tu vivre plus souvent ? Si tu veux, je peux t’expliquer le thème de notre prochaine rencontre et les informations à vérifier avant de participer.",
      "invitation": "Les fêtes nous rappellent parfois que les plus beaux cadeaux ne sont pas forcément des objets : une visite à la famille, une journée sans courir, une sortie qu’on n’a pas besoin de reporter.\n\nSandrine propose une réflexion sur le temps, les envies et les projets personnels, puis une présentation des étapes de découverte d’une activité commerciale digitale. Il ne s’agit pas de promettre que cette activité financera des fêtes ou des voyages.\n\nSi tu veux participer à ce moment de réflexion, écris « CE QUI COMPTE » pour connaître la date effectivement confirmée.",
      "reminder": "Si notre rencontre de fin d’année est confirmée pour toi, prends simplement une minute pour réfléchir à ce qui a compté cette année et à ce que tu voudrais préserver. Je te renvoie le lien si tu en as besoin.",
      "followUp": "Qu’aimerais-tu garder davantage dans ton année à venir : du temps, des apprentissages ou des moments avec les proches ? Nous pouvons ensuite voir si l’activité présentée mérite d’être étudiée à ton rythme.",
      "flow": "Retour personnel : ce qui compte → Découverte : une compétence ou une activité à explorer → Évaluation : temps, produits et coûts → Questions et prochain pas facultatif.",
      "condition": "Séance envisagée : date, heure, lien et intervenant à confirmer avant toute invitation. Aucune promesse de revenus ni de changement de vie. Les frais, les produits, les commissions et les efforts commerciaux doivent être précisés et vérifiés avant un engagement. Groupe WhatsApp uniquement avec accord explicite.",
      "status": "À configurer"
    },
    {
      "id": "WA-08",
      "theme": "Atelier 8 · Une nouvelle année, une décision simple qui t’appartient",
      "greeting": "Bonjour 👋 C’est Sandrine. Merci pour ton intérêt pour « Une nouvelle année, une décision simple qui t’appartient ». Quelle première action te semble réaliste cette année ? Si tu veux, je peux t’expliquer le thème de notre prochaine rencontre et les informations à vérifier avant de participer.",
      "invitation": "Une nouvelle année arrive avec beaucoup de résolutions. Et si, au lieu de te promettre de tout changer, tu décidais simplement de te donner le droit d’explorer une possibilité supplémentaire ?\n\nSandrine fera le point sur le parcours de découverte : ce qu’on a compris du modèle commercial, les compétences à acquérir, les conditions à vérifier et les questions à poser avant de décider. Le premier pas est accessible ; aucun résultat n’est automatique.\n\nPour recevoir le créneau confirmé de cette rencontre de début d’année, écris « MON PREMIER PAS ».",
      "reminder": "Avant notre rencontre de début d’année, demande-toi : quelle petite action réaliste aimerais-tu accomplir dans les trente prochains jours ? Apporte une question sur l’activité, nous la prendrons au sérieux.",
      "followUp": "Merci d’avoir pris ce temps pour toi. Souhaites-tu un résumé des étapes, un échange sur les conditions exactes avec la coach, ou simplement garder les informations pour plus tard ? Choisis ce qui te convient.",
      "flow": "Bilan : ce que nous avons découvert → Une première action réaliste → Les conditions du modèle à vérifier → Échange libre et choix personnel.",
      "condition": "Séance envisagée : date, heure, lien et intervenant à confirmer avant toute invitation. Aucune promesse de revenus ni de changement de vie. Les frais, les produits, les commissions et les efforts commerciaux doivent être précisés et vérifiés avant un engagement. Groupe WhatsApp uniquement avec accord explicite.",
      "status": "À configurer"
    }
  ],
  "lzo": [
    {
      "id": "WA-01",
      "theme": "Atelier 1 · Après des années de carrière, quels choix voulons-nous garder ?",
      "greeting": "Bonjour 👋 C’est Laurence. Merci pour ton intérêt pour « Après des années de carrière, quels choix voulons-nous garder ? ». Après tout ce que tu as construit, que voudrais-tu choisir plus librement ? Si tu veux, je peux t’expliquer le thème de notre prochaine rencontre et les informations à vérifier avant de participer.",
      "invitation": "On a passé des années à répondre présent : réunions, responsabilités, objectifs, famille. À quel moment se donne-t-on le droit de réfléchir à ce qu’on souhaite encore vivre et apprendre ?\n\nLaurence ouvre un échange sur la suite d’une carrière et présente une activité commerciale digitale à examiner, sans renoncer à son expérience. Nous parlerons des produits, des étapes de découverte et de ce qu’il faut vérifier avant de choisir.\n\nSi ce sujet résonne en toi, écris « MON CHAPITRE » pour connaître le prochain créneau confirmé.",
      "reminder": "Pour notre échange sur la carrière et les choix qui restent, pense à une compétence que tu aimerais transmettre ou découvrir. L’objectif est d’échanger librement, pas de décider sur le moment.",
      "followUp": "Quel aspect de notre rencontre t’a le plus parlé : l’expérience accumulée, l’apprentissage d’un nouveau domaine ou la recherche de davantage de choix ? Dis-moi ce que tu aimerais comprendre plus précisément.",
      "flow": "Parcours : ce que nos années de travail nous ont appris → Options à explorer → Modèle commercial et produits → Conditions, temps et questions.",
      "condition": "Séance envisagée : date, heure, lien et intervenant à confirmer avant toute invitation. Aucune promesse de revenus ni de changement de vie. Les frais, les produits, les commissions et les efforts commerciaux doivent être précisés et vérifiés avant un engagement. Groupe WhatsApp uniquement avec accord explicite.",
      "status": "À configurer"
    },
    {
      "id": "WA-02",
      "theme": "Atelier 2 · Ton expérience peut-elle servir dans une activité différente ?",
      "greeting": "Bonjour 👋 C’est Laurence. Merci pour ton intérêt pour « Ton expérience peut-elle servir dans une activité différente ? ». Quelle compétence aimerais-tu valoriser dans un domaine nouveau ? Si tu veux, je peux t’expliquer le thème de notre prochaine rencontre et les informations à vérifier avant de participer.",
      "invitation": "Tu sais écouter, organiser, résoudre des problèmes, accompagner d’autres personnes. Et si certaines de ces compétences avaient aussi de la valeur dans un univers commercial que tu n’as jamais exploré ?\n\nLaurence présentera les compétences transférables dans la vente et le commerce digital : écoute, communication, relation client. Nous verrons ce qu’il reste à apprendre, au lieu de prétendre que l’expérience suffit à garantir une réussite.\n\nTu veux découvrir comment ces compétences se croisent ? Envoie « MES COMPÉTENCES » en privé.",
      "reminder": "Notre échange sur les compétences approche. Note une chose que ton parcours t’a appris et que tu aimerais continuer à utiliser. Nous regarderons ce qu’elle peut apporter, et ce qu’il faut encore apprendre.",
      "followUp": "Quelle compétence de ton parcours as-tu envie de mobiliser autrement ? Et quel aspect de l’activité te demande encore des explications ? Je peux te transmettre les étapes de découverte.",
      "flow": "Inventaire des savoir-faire → Mise en relation avec les tâches commerciales réelles → Apprentissages nécessaires → Conditions et questions.",
      "condition": "Séance envisagée : date, heure, lien et intervenant à confirmer avant toute invitation. Aucune promesse de revenus ni de changement de vie. Les frais, les produits, les commissions et les efforts commerciaux doivent être précisés et vérifiés avant un engagement. Groupe WhatsApp uniquement avec accord explicite.",
      "status": "À configurer"
    },
    {
      "id": "WA-03",
      "theme": "Atelier 3 · Les voyages et les journées qu’on remet toujours à plus tard",
      "greeting": "Bonjour 👋 C’est Laurence. Merci pour ton intérêt pour « Les voyages et les journées qu’on remet toujours à plus tard ». Quel voyage ou moment avec un proche aimerais-tu programmer autrement ? Si tu veux, je peux t’expliquer le thème de notre prochaine rencontre et les informations à vérifier avant de participer.",
      "invitation": "On conserve des photos de lieux qu’on aimerait visiter. On remet une visite à la famille, un voyage, une semaine plus calme. Parfois, ce qu’on recherche vraiment, c’est le pouvoir de choisir son temps.\n\nLaurence parlera de cette aspiration sans en faire une garantie de revenu ni de liberté. La séance permettra de découvrir une piste commerciale, ce qu’elle implique en termes de travail et la manière de vérifier ses conditions.\n\nSi tu veux en parler, réponds « PLUS DE TEMPS » pour recevoir les informations de notre rencontre.",
      "reminder": "Avant notre discussion sur les voyages et le temps choisi, pense à une expérience que tu aimerais ne plus reporter. Viens surtout pour comprendre comment évaluer la piste présentée, sans promesse de résultat.",
      "followUp": "Quelle liberté te touche le plus : apprendre, voyager, passer du temps avec les proches ? Si tu le souhaites, on peut ensuite approfondir les conditions de l’activité avant de décider si elle correspond à tes priorités.",
      "flow": "La liberté telle que chacun l’imagine → Ce qu’une activité digitale permet d’explorer et ce qu’elle ne garantit pas → Produits et charge de travail → Questions.",
      "condition": "Séance envisagée : date, heure, lien et intervenant à confirmer avant toute invitation. Aucune promesse de revenus ni de changement de vie. Les frais, les produits, les commissions et les efforts commerciaux doivent être précisés et vérifiés avant un engagement. Groupe WhatsApp uniquement avec accord explicite.",
      "status": "À configurer"
    },
    {
      "id": "WA-04",
      "theme": "Atelier 4 · Découvrir le commerce digital sans recommencer sa vie à zéro",
      "greeting": "Bonjour 👋 C’est Laurence. Merci pour ton intérêt pour « Découvrir le commerce digital sans recommencer sa vie à zéro ». Qu’est-ce qui te retenait de découvrir une activité numérique ? Si tu veux, je peux t’expliquer le thème de notre prochaine rencontre et les informations à vérifier avant de participer.",
      "invitation": "L’idée d’un nouveau domaine intimide parfois : « Je n’ai pas grandi avec ces outils », « Je n’ai pas envie de quitter tout ce que j’ai construit ». Heureusement, découvrir ne veut pas dire démissionner.\n\nLaurence expliquera comment se déroule une première découverte depuis un téléphone : question, présentation, produits, conditions. Nous aborderons aussi les compétences et la prospection nécessaires si l’on choisit de poursuivre.\n\nTu as envie de comprendre les premières étapes ? Écris « JE M’INFORME » et je t’envoie les détails du rendez-vous.",
      "reminder": "Notre échange sur les débuts dans le digital approche. Un téléphone, un carnet et une question suffisent pour la présentation. Le développement d’une activité, lui, demandera d’en évaluer les conditions.",
      "followUp": "Quelle étape semble plus claire après cet atelier : la découverte, le fonctionnement des produits ou le suivi client ? Si tu as des questions sur le temps ou les coûts, je peux t’orienter vers les documents utiles.",
      "flow": "Les craintes de départ → Premier échange et présentation → Fonctionnement commercial → Travail à prévoir, coûts, questions.",
      "condition": "Séance envisagée : date, heure, lien et intervenant à confirmer avant toute invitation. Aucune promesse de revenus ni de changement de vie. Les frais, les produits, les commissions et les efforts commerciaux doivent être précisés et vérifiés avant un engagement. Groupe WhatsApp uniquement avec accord explicite.",
      "status": "À configurer"
    },
    {
      "id": "WA-05",
      "theme": "Atelier 5 · Activité à distance : qu’est-ce qui est réellement possible ?",
      "greeting": "Bonjour 👋 C’est Laurence. Merci pour ton intérêt pour « Activité à distance : qu’est-ce qui est réellement possible ? ». Quelle partie de ton organisation aimerais-tu rendre plus souple ? Si tu veux, je peux t’expliquer le thème de notre prochaine rencontre et les informations à vérifier avant de participer.",
      "invitation": "Travailler depuis un téléphone, dans un café ou chez soi : l’image est séduisante. Mais la vraie question est plutôt : quelles tâches peut-on réaliser à distance, et qu’est-ce qui reste exigeant ?\n\nLaurence proposera de distinguer la simplicité d’accéder à l’information, les usages numériques possibles et le travail commercial réel : apprendre, présenter une offre, échanger avec les clients et respecter les règles du modèle.\n\nTu veux une explication concrète derrière les belles images ? Réponds « À DISTANCE » en privé.",
      "reminder": "Pour notre atelier sur le travail à distance, prépare cette question : quelles tâches se font réellement avec un téléphone, et lesquelles demandent d’autres moyens ? Tu pourras la poser directement.",
      "followUp": "Après notre échange, quelle partie te paraît réellement compatible avec ton quotidien ? Et quel élément doit encore être vérifié : matériel, disponibilité, conditions contractuelles ou relations clients ?",
      "flow": "Les images qui font rêver → Tâches numériques possibles → Prospection, produits, formation et limites → Questions pratiques et conditions à confirmer.",
      "condition": "Séance envisagée : date, heure, lien et intervenant à confirmer avant toute invitation. Aucune promesse de revenus ni de changement de vie. Les frais, les produits, les commissions et les efforts commerciaux doivent être précisés et vérifiés avant un engagement. Groupe WhatsApp uniquement avec accord explicite.",
      "status": "À configurer"
    },
    {
      "id": "WA-06",
      "theme": "Atelier 6 · Avant d’investir ton temps : les questions qu’il faut poser",
      "greeting": "Bonjour 👋 C’est Laurence. Merci pour ton intérêt pour « Avant d’investir ton temps : les questions qu’il faut poser ». Quelle condition doit être parfaitement claire avant que tu envisages la suite ? Si tu veux, je peux t’expliquer le thème de notre prochaine rencontre et les informations à vérifier avant de participer.",
      "invitation": "Le temps est précieux. Avant de le consacrer à un nouveau projet, on devrait pouvoir obtenir des réponses nettes, pas seulement un discours enthousiasmant.\n\nLaurence animera une séance centrée sur les produits proposés, les dépenses, les modalités de commissions, les risques, l’accompagnement et le temps à prévoir. Une information non vérifiable restera une question ouverte à documenter.\n\nSi tu veux recevoir les thèmes de cette présentation, envoie « EN TOUTE CLARTÉ ».",
      "reminder": "Pour notre échange sur les conditions du modèle, prépare tes questions directes : prix, temps, produits, clients ou rémunération. Aucun chiffre non vérifié ne sera présenté comme une certitude.",
      "followUp": "Merci pour tes questions. Reste-t-il un coût, une condition ou un engagement qui mérite un document précis ? Nous pouvons organiser une clarification avec la coach avant toute décision.",
      "flow": "Évaluer son temps → Examiner produits et mode commercial → Coûts, commissions et risques → Documents nécessaires → Questions et suite facultative.",
      "condition": "Séance envisagée : date, heure, lien et intervenant à confirmer avant toute invitation. Aucune promesse de revenus ni de changement de vie. Les frais, les produits, les commissions et les efforts commerciaux doivent être précisés et vérifiés avant un engagement. Groupe WhatsApp uniquement avec accord explicite.",
      "status": "À configurer"
    },
    {
      "id": "WA-07",
      "theme": "Atelier 7 · À la fin de l’année, que voulons-nous préserver ?",
      "greeting": "Bonjour 👋 C’est Laurence. Merci pour ton intérêt pour « À la fin de l’année, que voulons-nous préserver ? ». Quel moment précieux aimerais-tu protéger davantage ? Si tu veux, je peux t’expliquer le thème de notre prochaine rencontre et les informations à vérifier avant de participer.",
      "invitation": "Les fêtes nous ramènent souvent à l’essentiel : nos proches, notre santé, les moments partagés, les souvenirs que l’on veut créer. Et parfois, elles font naître la question de ce qu’on souhaite changer dans l’organisation de sa vie.\n\nLaurence invite à une réflexion sur les priorités futures, puis présente les bases d’une activité commerciale digitale à examiner lucidement. Aucun voyage, revenu ou changement de vie n’est présenté comme un résultat promis.\n\nSi tu aimerais prendre part à cette conversation, écris « L’ESSENTIEL » pour connaître le créneau confirmé.",
      "reminder": "Si notre rencontre de fin d’année est confirmée, prends une minute pour noter ce qui a le plus compté pour toi. Nous parlerons d’aspirations mais aussi des conditions concrètes d’une activité à explorer.",
      "followUp": "Quel aspect de ton quotidien souhaites-tu préserver davantage dans les années qui viennent ? Si le modèle commercial présenté t’interpelle encore, je peux organiser un échange pour clarifier les points pratiques.",
      "flow": "Ce que l’année nous a appris → Aspirations et priorités → Découverte du modèle et de ses conditions → Questions et choix sans pression.",
      "condition": "Séance envisagée : date, heure, lien et intervenant à confirmer avant toute invitation. Aucune promesse de revenus ni de changement de vie. Les frais, les produits, les commissions et les efforts commerciaux doivent être précisés et vérifiés avant un engagement. Groupe WhatsApp uniquement avec accord explicite.",
      "status": "À configurer"
    },
    {
      "id": "WA-08",
      "theme": "Atelier 8 · Et si le prochain chapitre commençait par une conversation ?",
      "greeting": "Bonjour 👋 C’est Laurence. Merci pour ton intérêt pour « Et si le prochain chapitre commençait par une conversation ? ». Quel nouveau chapitre aimerais-tu explorer sans te mettre de pression ? Si tu veux, je peux t’expliquer le thème de notre prochaine rencontre et les informations à vérifier avant de participer.",
      "invitation": "Une nouvelle année nous donne parfois envie de changer beaucoup de choses. Mais il n’est pas nécessaire d’avoir un grand plan pour se poser une première question : qu’aimerais-je encore apprendre et construire ?\n\nLaurence propose une présentation de synthèse : ce que nous avons exploré, comment fonctionne l’activité, quels savoir-faire peuvent se développer, ce que demandent les conditions et comment avancer sans se précipiter.\n\nPour connaître le prochain rendez-vous confirmé, écris « PREMIER ÉCHANGE ».",
      "reminder": "Notre échange de début d’année approche. Pense à une seule perspective que tu aimerais explorer dans les prochains mois. Le but est d’avoir des informations claires pour choisir, pas de prendre une décision rapide.",
      "followUp": "Merci d’avoir partagé ce moment. Préfères-tu recevoir une synthèse des étapes, approfondir les coûts et les produits, ou laisser mûrir ta réflexion ? Toutes ces options sont possibles.",
      "flow": "Faire le point sur son parcours → Découvrir le modèle et les compétences → Vérifier dépenses et risques → Questions et choix du prochain pas.",
      "condition": "Séance envisagée : date, heure, lien et intervenant à confirmer avant toute invitation. Aucune promesse de revenus ni de changement de vie. Les frais, les produits, les commissions et les efforts commerciaux doivent être précisés et vérifiés avant un engagement. Groupe WhatsApp uniquement avec accord explicite.",
      "status": "À configurer"
    }
  ]
};
