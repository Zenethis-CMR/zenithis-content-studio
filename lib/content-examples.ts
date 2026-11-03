import type {BrandId,ContentPost} from './types';
import {editorialAlternatives} from './editorial-closer-v2';
export interface ContentExample{title:string;caption:string;cta:string;hashtags:string;visualBrief:string;format:string;productionAdvice:string;statusNote:string}
type ScenePack={test:string;bonas:string[];lzo:string[]};
const packs:ScenePack[] = [
  {
    "test": "photo|images?|journal|carnet|scene|derriere|minute|spontan",
    "bonas": [
      "UNE PHOTO NE RACONTE JAMAIS TOUTE LA JOURNÉE.",
      "Sur la photo, tu vois le sourire et le café. Tu ne vois pas les tâches qui attendent, les comptes du mois et cette question qu’on repousse : « Quand est-ce que je fais enfin quelque chose pour moi ? »",
      "Ce qui me touche, c’est ce décalage entre ce qu’on montre et ce qu’on porte. Une petite conversation pour découvrir une compétence nouvelle peut être un premier pas, sans tout quitter ni croire aux miracles.",
      "Femme noire active à une table près d’une fenêtre, téléphone, carnet et café, moment de vie crédible"
    ],
    "lzo": [
      "UNE PHOTO NE DIT PAS TOUT CE QUE NOUS AVONS TRAVERSÉ.",
      "Une photo tient en une seconde. Derrière elle, il peut y avoir des années de carrière, de responsabilités, d’envies reportées, mais aussi l’énergie de découvrir autre chose.",
      "J’aime penser que l’expérience accumulée n’empêche pas un nouveau chapitre. On peut explorer un domaine digital avec curiosité, en prenant le temps d’en comprendre les règles.",
      "Femme noire mature consultant de vieux clichés à la lumière du jour, téléphone posé près d’elle"
    ]
  },
  {
    "test": "question|faq|objection|mythe|piege|preuve|chiffre|promesse|legal|doute|verifier|offre serieuse",
    "bonas": [
      "LA QUESTION LA PLUS SIMPLE EST PARFOIS CELLE QUI CHANGE TOUT.",
      "Quand tu vois une nouvelle activité en ligne, tu as le droit de demander : « Qu’est-ce qu’on vend ? Combien ça coûte ? Qui sont les clients ? » Ces questions ne cassent pas un rêve : elles évitent de décider dans le flou.",
      "Avant de s’engager, il faut pouvoir comprendre les produits, les dépenses possibles, la prospection et le temps à prévoir. C’est exactement le genre de questions que j’aime prendre au sérieux.",
      "Mains d’une femme noire écrivant trois questions sur un carnet, smartphone neutre à côté"
    ],
    "lzo": [
      "LE RESPECT COMMENCE QUAND ON PEUT POSER TOUTES LES QUESTIONS.",
      "Après des années de responsabilités, on apprend que les décisions importantes ne se prennent pas à partir d’un slogan. On demande les coûts, les conditions, les produits et le temps réellement nécessaire.",
      "Ce qui m’intéresse, c’est de partager des informations vérifiables et de laisser chacun se faire un avis. Une belle projection n’a de valeur que si elle reste ancrée dans le réel.",
      "Femme noire mature avec carnet de questions en réunion de découverte, ambiance chaleureuse et sobre"
    ]
  },
  {
    "test": "telephone|ecran|digital|numerique|outil|connexion|automat|stock|plateforme|reseau|informati",
    "bonas": [
      "ET SI TON TÉLÉPHONE TE SERVAIT AUSSI À DÉCOUVRIR UN NOUVEAU MÉTIER ?",
      "Dans les transports, à la pause, le soir, on a presque toujours son téléphone à portée de main. Et si une partie de ce temps servait à comprendre comment fonctionne une activité de commerce digital ?",
      "Pour commencer à se renseigner, une connexion et quelques questions suffisent. Développer une activité demande ensuite des compétences, de la régularité et un vrai travail commercial.",
      "Femme noire dans un intérieur camerounais simple avec smartphone et carnet, sans écran de gains"
    ],
    "lzo": [
      "LE NUMÉRIQUE N’EST PAS RÉSERVÉ À CEUX QUI ONT GRANDI AVEC.",
      "On peut avoir un parcours riche et se sentir débutante devant certains outils. Ce n’est pas un obstacle pour commencer à apprendre, poser des questions et découvrir d’autres façons de travailler.",
      "Un téléphone peut suffire pour assister à une présentation. Ensuite, il reste indispensable de comprendre les produits, les clients, les coûts et les efforts nécessaires.",
      "Femme noire mature apprenant sur smartphone à une table lumineuse, rendu documentaire"
    ]
  },
  {
    "test": "presentation|atelier|live|seminaire|session|groupe|rendez-vous|invitation|programme",
    "bonas": [
      "ET SI TU T’ACCORDAIS UN RENDEZ-VOUS POUR TES PROPRES PROJETS ?",
      "Ton agenda est plein de rendez-vous pour les autres. Mais quand as-tu pris un moment pour comprendre une possibilité qui pourrait t’intéresser personnellement ?",
      "Je propose une présentation simple pour découvrir une activité commerciale digitale, son fonctionnement, ses produits et les questions à vérifier. Personne n’a besoin de décider sur-le-champ.",
      "Deux femmes noires échangeant calmement autour d’une table, téléphones et carnet, pas de scène commerciale luxueuse"
    ],
    "lzo": [
      "TRENTE MINUTES POUR TE FAIRE UNE IDÉE, PAS POUR TE PRÉCIPITER.",
      "On peut rêver de plus de temps pour ses proches, de voyages, de découvertes. Mais une décision importante mérite mieux qu’une promesse.",
      "Une présentation permet de regarder le modèle, ses produits, ses conditions et les activités qu’il suppose. Le premier pas consiste simplement à comprendre.",
      "Femme noire mature préparant une rencontre en visioconférence, bureau simple et carnet de notes"
    ]
  },
  {
    "test": "temps|journee|dimanche|semaine|travail|vente|prospect|audience|conversation|liberte",
    "bonas": [
      "TU TIENS LE RYTHME TOUTE LA SEMAINE. MAIS QUI PREND SOIN DE TES ENVIES ?",
      "Les urgences, les transports, les obligations : tout trouve une place dans ton agenda, sauf parfois ce qui te tient à cœur. Une formation, une sortie en famille, une idée que tu gardes dans un coin de la tête.",
      "Tu n’as pas besoin de tout changer pour te renseigner. Une première conversation peut t’aider à comprendre une activité parallèle et à vérifier si elle correspond à ton temps disponible.",
      "Femme noire rentrant chez elle en fin de journée, sac posé et carnet ouvert, lumière chaude naturelle"
    ],
    "lzo": [
      "DES ANNÉES À DONNER LE MEILLEUR DE SOI. ET POUR SOI, QUAND ?",
      "Une carrière peut apporter beaucoup. Elle peut aussi laisser peu de place aux voyages, aux proches et aux projets personnels qu’on remet à plus tard.",
      "Je crois qu’on peut réfléchir à la suite sans renier ce qu’on a déjà construit. Découvrir une activité numérique peut commencer avec une simple question.",
      "Femme noire mature quittant son lieu de travail au coucher du soleil, attitude contemplative"
    ]
  },
  {
    "test": "voyage|projet|avenir|plan|possibilit|activite|choix|ambition|changement|objectif|reve",
    "bonas": [
      "ET SI TU ARRÊTAIS DE METTRE TES ENVIES TOUT EN BAS DE LA LISTE ?",
      "Il y a le voyage qu’on remet à l’année prochaine, la formation qu’on repousse, le week-end qu’on n’ose pas programmer. Souvent, ce n’est pas l’envie qui manque : c’est la marge de manœuvre.",
      "Personne ne peut promettre qu’une activité commerciale apportera la liberté souhaitée. En revanche, tu peux explorer un modèle, comprendre ce qu’il demande et décider si tu veux apprendre davantage.",
      "Femme noire regardant un carnet de projets et une photo de destination, décor domestique simple"
    ],
    "lzo": [
      "LE PROCHAIN CHAPITRE N’EST PAS OBLIGÉ DE RESSEMBLER AU PRÉCÉDENT.",
      "À un certain moment, on ne pense plus seulement à son poste ou à son titre. On pense aux expériences à vivre, aux proches à retrouver, aux choses qu’on aimerait transmettre.",
      "Je partage une piste commerciale à examiner librement, sans promettre qu’elle donnera des revenus ou du temps. La découverte, elle, est accessible.",
      "Femme noire mature avec carnet de voyage à la fenêtre, lumière douce, style naturel"
    ]
  },
  {
    "test": "message|phrase|ecrire|legende|commentaire|publier|publication|apprendre|formation|produit",
    "bonas": [
      "UNE QUESTION SINCÈRE VAUT MIEUX QU’UN DISCOURS PARFAIT.",
      "« Je ne sais pas par où commencer. » Beaucoup de personnes pourraient prononcer cette phrase, surtout quand leur journée est déjà pleine.",
      "On peut d’abord apprendre à présenter une idée, puis examiner le commerce digital, les produits et les efforts nécessaires. Ce n’est pas magique, mais on peut poser une première question dès aujourd’hui.",
      "Femme noire écrivant une phrase sur carnet près de son smartphone, espace de travail réaliste"
    ],
    "lzo": [
      "ON PEUT POSER UNE QUESTION SANS AVOIR TOUTES LES RÉPONSES.",
      "Même après des années d’expérience, changer de domaine peut impressionner. Pourtant, apprendre quelque chose ne demande pas d’effacer ce qu’on sait déjà.",
      "Je préfère expliquer avec des mots simples : les produits, les tâches concrètes, les coûts et les conditions. Le premier échange sert à comprendre, pas à s’engager.",
      "Femme noire mature écrivant une phrase dans un carnet près de son téléphone"
    ]
  },
  {
    "test": ".*",
    "bonas": [
      "IL RESTE PEUT-ÊTRE UNE PETITE PLACE POUR UN PROJET QUI T’APPARTIENT.",
      "Le quotidien peut remplir toutes les cases : travailler, s’occuper des autres, gérer les imprévus. Et au milieu, cette envie de ne pas laisser toutes tes idées en attente.",
      "Je propose de découvrir une activité commerciale à travers une conversation et une présentation. Tu pourras examiner ce qu’elle demande et te faire ton propre avis.",
      "Femme noire active dans un cadre quotidien camerounais, carnet et téléphone, expression naturelle"
    ],
    "lzo": [
      "TON EXPÉRIENCE A DE LA VALEUR, MÊME QUAND TU EXPLORES AUTRE CHOSE.",
      "On peut avoir beaucoup construit et garder l’envie d’apprendre, de transmettre et de découvrir de nouveaux horizons.",
      "Une première présentation peut éclairer les possibilités d’une activité digitale, ses conditions et son fonctionnement. Elle ne remplace pas une décision réfléchie.",
      "Femme noire mature dans un cadre sobre, téléphone et carnet, attitude ouverte et confiante"
    ]
  }
];
const featured:Record<string,{title:string;caption:string;cta:string;visual:string}>= {
  "BONAS-01-06": {
    "title": "LE SOURIRE SUR LA PHOTO, ET TOUT CE QU’ON NE VOIT PAS.",
    "caption": "Un sourire en photo ne raconte pas les trajets, les factures qui arrivent, ni le moment où l’on se demande si l’on aura un jour plus de temps pour soi.\n\nCette scène, beaucoup peuvent s’y reconnaître. On ne peut pas résoudre toutes ses préoccupations d’un claquement de doigts. Mais on peut prendre vingt minutes pour regarder une possibilité nouvelle et comprendre ce qu’elle demanderait vraiment.\n\nAujourd’hui, je partage une idée simple : ta curiosité mérite aussi une place dans ton agenda. Et si tu veux découvrir comment fonctionne une activité commerciale digitale, on peut en parler sans pression.",
    "cta": "Quel projet personnel repousses-tu depuis trop longtemps ? Dis-le-moi en privé.",
    "visual": "Sandrine souriante près d’une fenêtre dans un intérieur de vie ordinaire, pas de luxe, téléphone posé sur la table, ambiance du quotidien réel. Aucun témoignage ni résultat financier ajouté."
  }
};

const normalize=(text:string)=>text.normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase();
const hashtags:Record<BrandId,string>={
 bonas:'#BONASINC #ChoixDeVie #CommerceDigital #ProjetPersonnel',
 lzo:'#LZOEmpire #NouvellePerspective #Experience #CommerceDigital'
};
const action=[
 'Écris-moi ce que tu aimerais mieux comprendre.',
 'Dis-moi quel projet tu repousses depuis trop longtemps.',
 'Pose-moi une question en message privé.',
 'Si tu veux connaître les étapes, parlons-en.',
 'Demande-moi les informations de la prochaine présentation.',
 'Tu peux m’écrire simplement « Je suis curieuse ».'
];
const briefSuffix='Photo documentaire réaliste, lumière naturelle, peau noire fidèle, sans texte incrusté, sans fausse capture de revenus, ni marque inventée. Visuel à produire ou générer pour la médiathèque.';
export function createContentExample(post:ContentPost,brand:BrandId):ContentExample{
 const first=featured[post.id];
 const v3=editorialAlternatives[post.id];
 const match=packs.find(p=>new RegExp(p.test,'i').test(normalize(post.title)))||packs[packs.length-1];
 const pack=match[brand];
 const n=Array.from(post.id).reduce((total,c)=>total+c.charCodeAt(0),0);
 const title=first?.title||v3?.title||pack[0];
 const intro=pack[1];
 const connection=pack[2];
 const bridge=brand==='bonas'
 ?'Si tu veux, Sandrine peut te montrer comment découvrir le modèle commercial, les produits et les conditions avant tout engagement.'
 :'Si tu veux, Laurence peut t’expliquer le modèle commercial, les produits et les conditions avant toute décision.';
 const caption=first?.caption||v3?.caption||[intro,connection,bridge].join('\n\n');
 const cta=first?.cta||v3?.cta||action[n%action.length];
 const format=/vidéo|reel|tiktok/i.test(post.type+' '+post.title)?'Vidéo verticale 9:16 (20–35 s)':/story|sondage/i.test(post.type+' '+post.title)?'Story 9:16 (2–3 écrans)':'Portrait photo 4:5';
 const visualBrief=(first?.visual||pack[3])+' '+briefSuffix;
 const productionAdvice='Sujet initial du calendrier : « '+post.title+' ». '+(post.asset?'Support demandé : '+post.asset+'. ':'')+'Illustrer la scène sans prétendre qu’une mise en scène fictive est un témoignage réel. Demander les preuves avant toute affirmation sur le produit ou un résultat.';
 return {title,caption,cta,hashtags:hashtags[brand],visualBrief,format,productionAdvice,
 statusNote:first||v3?'Proposition originale V3, non enregistrée.':'Exemple scénarisé original à adapter. Ce n’est pas le témoignage vérifié d’un client.'};
}
