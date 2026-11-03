# Invitations d’équipe — Zenithis Studio

## Diagnostic vérifié, 3 novembre 2026

Les accès des deux marques sont déjà enregistrés. Les profils de Laurence et Sandrine existent dans Supabase Auth comme comptes invités non confirmés. L'erreur observée dans les journaux du projet est HTTP 429 — over_email_send_rate_limit. Le quota a été atteint au moment de l'envoi. Il ne faut pas supprimer les attributions ni recréer les comptes.

Le fournisseur Supabase intégré est limité actuellement à 2 e-mails par heure et à des destinataires préautorisés du projet. Pour un usage normal, configurer un SMTP personnalisé : https://supabase.com/docs/guides/auth/auth-smtp

## Fonction invite-studio-member

- Authentification vérifiée, autorisation studio_may_invite et correspondance exacte marque + rôle en base obligatoires.
- Action send : renvoie des codes explicites (EMAIL_RATE_LIMIT, SMTP_REQUIRED, EMAIL_DELIVERY_FAILED, ACCOUNT_EXISTS). Une erreur d'envoi ne supprime pas l'attribution.
- Action manual_link : génère après clic explicite un lien à usage individuel via Supabase Auth, avec magiclink de secours si le compte existe déjà. Aucun envoi mail, ni stockage ni journalisation du lien.
- Le lien est un accès sensible à transmettre uniquement au destinataire visé. Il expire selon la configuration OTP Supabase.

## Interface

- Renvoyer une invitation depuis une ligne de permission déjà créée, sans changer les droits.
- Générer et copier un lien privé dans la même interface, sur action explicite.
- Différencier accès attribué, demande d'e-mail acceptée par Supabase et compte réellement activé.

## Configuration côté administrateur

1. Configurer Custom SMTP dans Supabase Authentication (fournisseur Brevo, Resend, Postmark, etc.), adresse expéditrice et paramètres SPF/DKIM/DMARC.
2. Vérifier Authentication → Rate Limits et Authentication → URL Configuration.
3. Dans Paramètres du Studio, utiliser Renvoyer sur les attributions existantes.
4. Faire vérifier la réception et l'activation du compte par les destinataires.

Ne jamais copier de secrets SMTP, service_role ou liens d'activation dans GitHub, une discussion publique ou un navigateur tiers. L'origine de la fonction reste strictement limitée à l'application autorisée.