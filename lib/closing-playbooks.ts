import type {BrandId} from './types';

/**
 * Réponses rapides manuelles « Closer 2.0 ».
 * Les messages sont des brouillons à adapter avant copie. Aucun envoi automatique.
 * Toute information sur les coûts, commissions, produits et efforts doit être vérifiée.
 */
export type ClosingStep = '1'|'2'|'3'|'4';
export interface ClosingMessage {
 id:string;
 step:ClosingStep;
 keyword:string;
 title:string;
 trigger:string;
 message:string;
 nextAction:string;
}
export const closingPlaybooks:Record<BrandId,ClosingMessage[]> = {
  "bonas": [
    {
      "id": "bonas-planb",
      "step": "1",
      "keyword": "PLAN B",
      "title": "Premier contact · besoin d’un Plan B",
      "trigger": "Au premier message contenant PLAN B",
      "message": "Bonjour 👋 C’est Sandrine. Si tu m’écris « PLAN B », j’imagine que tu aimerais construire quelque chose à toi, en parallèle de ce que tu fais déjà. Et si tu commençais simplement par découvrir une piste concrète, à ton rythme ?\n\nJe peux t’expliquer le principe et te proposer une courte présentation, sans engagement. Qu’aimerais-tu changer en premier : tes options, ton organisation ou tes perspectives ?",
      "nextAction": "Écouter la priorité, puis proposer la présentation adaptée"
    },
    {
      "id": "bonas-liberte",
      "step": "1",
      "keyword": "LIBERTÉ",
      "title": "Premier contact · envie de liberté",
      "trigger": "Quand le prospect répond LIBERTÉ",
      "message": "Je comprends ce mot. 💛 Pour moi, la liberté commence parfois par une chose simple : avoir davantage de choix demain qu’aujourd’hui.\n\nCe que je partage, c’est une activité commerciale digitale à découvrir et à évaluer, pas une recette magique. Tu préfères qu’on parle de ce que tu recherches ou que je t’envoie les grandes étapes pour découvrir le modèle ?",
      "nextAction": "Identifier le désir précis et expliquer le modèle"
    },
    {
      "id": "bonas-decouvrir",
      "step": "1",
      "keyword": "DÉCOUVRIR",
      "title": "Premier contact · curiosité",
      "trigger": "Quand le prospect écrit DÉCOUVRIR",
      "message": "Bienvenue 👋 Tu n’as pas besoin de tout savoir sur le digital pour poser une première question.\n\nJe peux t’expliquer comment le modèle fonctionne, comment on est accompagné et ce qu’il faut vérifier avant de prendre une décision. Qu’est-ce qui t’intrigue le plus : les produits, la vente ou le démarrage ?",
      "nextAction": "Répondre à la question choisie, sans jargon"
    },
    {
      "id": "bonas-presentation",
      "step": "1",
      "keyword": "PRÉSENTATION",
      "title": "Premier contact · intention forte",
      "trigger": "Quand le prospect demande une présentation",
      "message": "Avec plaisir ! 🌿 Le plus simple, c’est une présentation de découverte où tu vois le fonctionnement réel, les étapes et les questions à poser.\n\nJe peux te transmettre les informations du prochain rendez-vous. Avant cela, tu es plutôt disponible en semaine ou le week-end ?",
      "nextAction": "Vérifier la disponibilité puis transmettre une date confirmée"
    },
    {
      "id": "bonas-qualifier",
      "step": "1",
      "keyword": "QUESTION",
      "title": "Qualification courte, naturelle",
      "trigger": "Après une première réponse du prospect",
      "message": "Pour éviter de te noyer d’informations, je te pose juste une question : tu cherches surtout à comprendre une nouvelle activité, à préparer un projet en parallèle ou à explorer des options pour plus tard ? Une réponse suffit 😊",
      "nextAction": "Associer le besoin à un seul message utile"
    },
    {
      "id": "bonas-groupe",
      "step": "2",
      "keyword": "GROUPE",
      "title": "Invitation au groupe, sur consentement",
      "trigger": "Quand une personne souhaite des exemples et des échanges",
      "message": "Je peux aussi te proposer notre groupe d’information WhatsApp. On y partage des réponses, des rendez-vous de découverte et des échanges avec d’autres personnes qui se posent les mêmes questions.\n\nTu veux que je t’envoie le lien ? Rien à rejoindre tant que tu n’en as pas envie.",
      "nextAction": "Envoyer le lien du groupe seulement après accord"
    },
    {
      "id": "bonas-groupe-accueil",
      "step": "2",
      "keyword": "BIENVENUE",
      "title": "Accueil après entrée volontaire",
      "trigger": "Après inscription au groupe",
      "message": "Bienvenue parmi nous 🌷 Ici, tu peux découvrir, poser des questions et avancer sans pression. Pour faire connaissance : qu’aimerais-tu mieux comprendre aujourd’hui — le fonctionnement, l’accompagnement ou les conditions de départ ?",
      "nextAction": "Répondre avec une ressource adaptée"
    },
    {
      "id": "bonas-projection",
      "step": "2",
      "keyword": "PROJECTION",
      "title": "Faire imaginer une évolution concrète",
      "trigger": "Après une question ouverte, avant l’invitation",
      "message": "Imagine dans quelques mois avoir compris un nouveau domaine, savoir présenter une offre clairement et pouvoir décider si cette activité mérite une place dans ta vie. Ce n’est pas une promesse de résultat : c’est un chemin qu’on peut explorer étape par étape.\n\nTu veux voir à quoi ressemble la première étape ?",
      "nextAction": "Proposer la présentation, pas un résultat financier"
    },
    {
      "id": "bonas-confirmation",
      "step": "3",
      "keyword": "INSCRIPTION",
      "title": "Confirmer une place",
      "trigger": "Après avoir réellement confirmé une date",
      "message": "Super, c’est confirmé pour [date] à [heure] 😊\n\nPendant cette présentation, tu découvriras ce qui est proposé, le rôle des produits, l’accompagnement et les points à vérifier avant de décider. Voici le lien : [lien]\n\nTu peux venir avec une question, même toute simple.",
      "nextAction": "Renseigner date, heure et lien réellement confirmés"
    },
    {
      "id": "bonas-rappel-j1",
      "step": "3",
      "keyword": "J-1",
      "title": "Rappel utile la veille",
      "trigger": "Uniquement pour une personne inscrite",
      "message": "Demain, on se retrouve à [heure] 🌿 Garde simplement de quoi noter deux choses : ce que tu aimerais construire pour la suite, et ce que tu veux comprendre du modèle.\n\nVoici ton lien : [lien]. À demain !",
      "nextAction": "Ne pas envoyer aux personnes non inscrites"
    },
    {
      "id": "bonas-rappel-h1",
      "step": "3",
      "keyword": "H-1",
      "title": "Rappel une heure avant",
      "trigger": "Uniquement pour une personne inscrite",
      "message": "Petit rappel 😊 Notre présentation commence à [heure]. Voici le lien : [lien]. Tu peux venir écouter et poser tes questions, sans décision à prendre sur le moment.",
      "nextAction": "Confirmer le créneau avant copie"
    },
    {
      "id": "bonas-suivi-oui",
      "step": "4",
      "keyword": "APRÈS · INTÉRESSÉ",
      "title": "Après présentation · prospect motivé",
      "trigger": "Personne présente et exprimant son intérêt",
      "message": "Merci d’avoir participé 🌟 Qu’est-ce qui t’a le plus parlé : le fonctionnement, l’accompagnement ou la possibilité de développer un projet à côté ?\n\nSi tu veux aller plus loin, je peux organiser un échange pour examiner les produits, les coûts, les conditions et les efforts nécessaires avant toute décision.",
      "nextAction": "Orienter vers une coach et clarifier l’offre complète"
    },
    {
      "id": "bonas-suivi-doute",
      "step": "4",
      "keyword": "APRÈS · HÉSITATION",
      "title": "Après présentation · besoin de réflexion",
      "trigger": "Personne présente qui hésite",
      "message": "Merci pour ton retour. C’est normal de vouloir réfléchir avant de s’engager. Quel point aimerais-tu éclaircir en priorité : le temps, les dépenses, la façon de vendre ou les résultats possibles ?\n\nOn peut regarder ce point avec des informations concrètes, sans précipitation.",
      "nextAction": "Traiter une seule objection à la fois"
    },
    {
      "id": "bonas-absent",
      "step": "4",
      "keyword": "ABSENT",
      "title": "Absence à la présentation",
      "trigger": "Personne inscrite mais absente",
      "message": "Bonjour 😊 On ne s’est pas croisés pendant la présentation. J’espère que tout va bien. Si le sujet t’intéresse encore, je peux te proposer un autre créneau ou un résumé du fonctionnement. Tu préfères quoi ?",
      "nextAction": "Ne pas relancer si absence de réponse après les suivis consentis"
    },
    {
      "id": "bonas-temps",
      "step": "4",
      "keyword": "OBJECTION · TEMPS",
      "title": "Répondre au manque de temps",
      "trigger": "Quand le prospect dit ne pas avoir le temps",
      "message": "Je comprends : tu as déjà beaucoup à gérer. Avant d’imaginer tout bouleverser, le bon réflexe est de regarder ce que l’activité demande réellement : apprentissage, prospection, relation client et régularité.\n\nOn peut commencer par vérifier si cela correspond à ta disponibilité, sans engagement. Quel créneau serait réaliste pour toi ?",
      "nextAction": "Ne pas minimiser le travail requis"
    },
    {
      "id": "bonas-budget",
      "step": "4",
      "keyword": "OBJECTION · BUDGET",
      "title": "Parler des frais avec transparence",
      "trigger": "Quand le prospect demande le prix ou le risque",
      "message": "Tu as raison de demander. Avant de décider, tu dois connaître les frais de départ et récurrents, les éventuels achats, la façon dont les commissions sont calculées et les risques de ne pas rentabiliser les dépenses.\n\nJe peux te mettre en relation avec la coach pour obtenir les conditions exactes par écrit. Tu préfères un récapitulatif ou un échange ?",
      "nextAction": "Ne pas inventer de tarifs, ni promettre un retour sur investissement"
    },
    {
      "id": "bonas-suivi-j3",
      "step": "4",
      "keyword": "J+3",
      "title": "Relance respectueuse",
      "trigger": "Si la personne a autorisé les échanges et n’a pas répondu",
      "message": "Bonjour 👋 Je reviens une dernière fois sur notre échange. Est-ce que tu souhaites toujours recevoir les informations pour évaluer cette activité, ou préfères-tu qu’on en reste là pour le moment ? Les deux réponses me conviennent.",
      "nextAction": "Respecter immédiatement le refus ou le silence"
    }
  ],
  "lzo": [
    {
      "id": "lzo-avenir",
      "step": "1",
      "keyword": "AVENIR",
      "title": "Premier contact · construire son après",
      "trigger": "Au premier message contenant AVENIR",
      "message": "Bonjour 👋 C’est Laurence. Quand je parle d’AVENIR, je pense à cette question : « Et si les années qui viennent nous donnaient plus de choix que celles qui passent ? »\n\nJe partage une piste d’activité commerciale à découvrir et à examiner sérieusement, sans promesse de gains. Qu’aimerais-tu préparer en priorité pour ton après ?",
      "nextAction": "Écouter la projection personnelle avant de présenter"
    },
    {
      "id": "lzo-choix",
      "step": "1",
      "keyword": "PLUS DE CHOIX",
      "title": "Premier contact · liberté de choisir",
      "trigger": "Quand le prospect écrit PLUS DE CHOIX",
      "message": "C’est aussi ce qui m’anime : pouvoir se dire qu’on n’est pas obligé de dépendre d’une seule possibilité pour toujours. 🌱\n\nJe peux te montrer comment fonctionne le modèle que j’explore, ce qu’il implique et comment il se découvre, tranquillement. Tu préfères une explication courte ou les informations de la prochaine présentation ?",
      "nextAction": "Faire choisir le format, pas pousser l’adhésion"
    },
    {
      "id": "lzo-activite",
      "step": "1",
      "keyword": "ACTIVITÉ",
      "title": "Premier contact · activité parallèle",
      "trigger": "Quand le prospect demande une ACTIVITÉ",
      "message": "Bienvenue 👋 Il est possible de s’informer sur une activité digitale sans avoir déjà toutes les compétences.\n\nCela reste un vrai projet commercial : il faut comprendre l’offre, les clients, les coûts et les étapes. Si tu veux, je t’explique simplement comment fonctionne notre parcours de découverte. Tu pars de zéro ou tu as déjà vendu en ligne ?",
      "nextAction": "Adapter les explications à l’expérience"
    },
    {
      "id": "lzo-presentation",
      "step": "1",
      "keyword": "PRÉSENTATION",
      "title": "Premier contact · demande de séance",
      "trigger": "Quand le prospect demande une PRÉSENTATION",
      "message": "Avec plaisir. Le rendez-vous sert à voir l’activité telle qu’elle est : le modèle, les produits, l’accompagnement et les questions importantes avant toute décision.\n\nJe peux t’envoyer le prochain créneau confirmé. Qu’est-ce que tu aimerais absolument comprendre pendant cette présentation ?",
      "nextAction": "Répondre à la question et envoyer le créneau exact"
    },
    {
      "id": "lzo-qualifier",
      "step": "1",
      "keyword": "UNE QUESTION",
      "title": "Qualification centrée sur l’avenir",
      "trigger": "Après prise de contact",
      "message": "Une petite question pour mieux t’aider : tu aimerais surtout préparer la suite de ta carrière, découvrir une activité parallèle ou simplement comprendre les possibilités du digital ? Tu peux me répondre en une phrase 😊",
      "nextAction": "Personnaliser la suite selon le vrai besoin"
    },
    {
      "id": "lzo-groupe",
      "step": "2",
      "keyword": "GROUPE",
      "title": "Inviter au groupe commun avec accord",
      "trigger": "Lorsque le prospect souhaite suivre les échanges",
      "message": "Nous avons aussi un groupe WhatsApp commun où nous partageons des présentations, des réponses et des informations pratiques. C’est un espace pour comprendre avant de décider.\n\nSouhaites-tu recevoir le lien pour y entrer ? Tu peux tout à fait rester en conversation privée.",
      "nextAction": "N’envoyer le lien qu’après accord"
    },
    {
      "id": "lzo-groupe-accueil",
      "step": "2",
      "keyword": "BIENVENUE",
      "title": "Accueillir un nouveau membre",
      "trigger": "À l’entrée volontaire dans le groupe",
      "message": "Bienvenue 🌿 Ici, nous parlons de projets, de questions et d’avenir, sans obligation de se décider. Pour mieux t’orienter, quel sujet voudrais-tu découvrir en premier : comment ça marche, combien de temps cela prend ou quelles sont les conditions ?",
      "nextAction": "Répondre au sujet évoqué"
    },
    {
      "id": "lzo-projection",
      "step": "2",
      "keyword": "PROJECTION",
      "title": "Transformer une curiosité en projet évalué",
      "trigger": "Après qualification, avant présentation",
      "message": "Imagine pouvoir regarder ton avenir avec une compétence nouvelle et une autre piste à évaluer, sans renoncer à ce que tu as déjà construit. C’est cette démarche que j’aime partager : comprendre d’abord, décider ensuite.\n\nVeux-tu voir la première étape du parcours ?",
      "nextAction": "Proposer un échange ou une séance de découverte"
    },
    {
      "id": "lzo-confirmation",
      "step": "3",
      "keyword": "INSCRIPTION",
      "title": "Confirmer un créneau réel",
      "trigger": "Après confirmation d’un rendez-vous",
      "message": "C’est noté pour [date] à [heure] ✅\n\nTu vas découvrir le modèle d’activité, le rôle des produits, l’accompagnement et les conditions à examiner. Ton lien : [lien]\n\nGarde une question sur ton avenir ou tes attentes : elle a toute sa place.",
      "nextAction": "Remplir les informations confirmées avant copie"
    },
    {
      "id": "lzo-rappel-j1",
      "step": "3",
      "keyword": "J-1",
      "title": "Rappel d’avant-séance",
      "trigger": "Personne effectivement inscrite",
      "message": "Demain, place aux réponses 🌿 Rendez-vous à [heure]. Si tu veux, prépare une seule question : « Qu’est-ce que ce modèle pourrait apporter à mon projet, et qu’exigerait-il en échange ? »\n\nLien : [lien]. À demain !",
      "nextAction": "Ne pas envoyer à des contacts non inscrits"
    },
    {
      "id": "lzo-rappel-h1",
      "step": "3",
      "keyword": "H-1",
      "title": "Rappel juste avant",
      "trigger": "Une heure avant le début confirmé",
      "message": "Notre présentation démarre à [heure] 😊 Ton lien : [lien]. Viens surtout pour comprendre et poser tes questions. Aucune décision immédiate n’est attendue.",
      "nextAction": "Vérifier heure et lien"
    },
    {
      "id": "lzo-suivi-oui",
      "step": "4",
      "keyword": "APRÈS · INTÉRESSÉ",
      "title": "Après séance · approfondir",
      "trigger": "Participant intéressé",
      "message": "Merci d’avoir été là 🌟 Quel élément t’a permis de mieux te projeter : le fonctionnement, l’accompagnement ou l’organisation de l’activité ?\n\nSi tu le souhaites, une coach peut préciser les produits, les dépenses, les commissions possibles et les conditions complètes pour décider en connaissance de cause.",
      "nextAction": "Organiser un échange de clarification"
    },
    {
      "id": "lzo-suivi-doute",
      "step": "4",
      "keyword": "APRÈS · HÉSITATION",
      "title": "Après séance · clarifier",
      "trigger": "Participant hésitant",
      "message": "Merci pour ta franchise. Prendre son temps est souvent la meilleure façon d’évaluer un projet. Quel point t’empêche encore de te faire une idée claire : la disponibilité, le coût, l’activité commerciale ou les perspectives de résultats ?",
      "nextAction": "Répondre précisément, sans formule de pression"
    },
    {
      "id": "lzo-absent",
      "step": "4",
      "keyword": "ABSENT",
      "title": "Absence ou empêchement",
      "trigger": "Inscrit absent lors de la séance",
      "message": "Bonjour 👋 Je n’ai pas eu l’occasion de te retrouver à la présentation. Aucun souci. Souhaites-tu recevoir un résumé ou être informé du prochain créneau ? Si ce n’est plus d’actualité pour toi, dis-le-moi simplement.",
      "nextAction": "Ne pas insister sans réponse"
    },
    {
      "id": "lzo-temps",
      "step": "4",
      "keyword": "OBJECTION · TEMPS",
      "title": "Comprendre la charge réelle",
      "trigger": "Question sur la disponibilité",
      "message": "Je sais que nos journées sont déjà remplies. Plutôt que de te dire « ça se fait tout seul », je préfère te montrer les activités à prévoir : se former, parler aux personnes intéressées et suivre les clients.\n\nAprès, tu pourras voir si cela a du sens avec ton rythme. Quelle disponibilité serais-tu prête à consacrer à un apprentissage ?",
      "nextAction": "Faire un diagnostic de faisabilité"
    },
    {
      "id": "lzo-budget",
      "step": "4",
      "keyword": "OBJECTION · BUDGET",
      "title": "Clarifier l’argent nécessaire",
      "trigger": "Question sur les frais",
      "message": "C’est une question essentielle. Aucun projet commercial ne devrait se décider sans connaître les dépenses initiales et récurrentes, les conditions, les achats éventuels et le risque de ne pas générer de recettes.\n\nJe peux solliciter la coach pour les chiffres et documents exacts. Tu préfères une explication par écrit ou à l’oral ?",
      "nextAction": "Fournir les montants réels avant engagement"
    },
    {
      "id": "lzo-suivi-j3",
      "step": "4",
      "keyword": "J+3",
      "title": "Relance finale consentie",
      "trigger": "Sans réponse après échange et avec consentement",
      "message": "Bonjour 🌿 Je voulais simplement savoir si notre échange t’a aidé à y voir plus clair pour ton projet d’avenir. Si tu veux approfondir un point, je suis disponible. Sinon, nous pouvons en rester là sans problème.",
      "nextAction": "Arrêter les relances au refus ou après ce message"
    }
  ]
};
export const closerStageNames:Record<ClosingStep,string>={
 '1':'Accueil, qualification et première confiance',
 '2':'Projection et entrée volontaire dans le groupe',
 '3':'Inscription et rappels utiles',
 '4':'Objections, suivi et décision éclairée'
};
