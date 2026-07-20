# Deploiement Hostinger

## 1. Offre necessaire

Utiliser une offre Hostinger qui supporte les applications Node.js, par exemple
Business Web Hosting ou Cloud. Une offre VPS fonctionne aussi, mais demande une
configuration manuelle de Node.js, du proxy web et du SSL.

Documentation Hostinger :

- https://www.hostinger.com/support/how-to-deploy-a-nodejs-website-in-hostinger/
- https://www.hostinger.com/support/connecting-a-hostinger-mysql-database-to-a-node-js-application/

## 2. Preparer MySQL

1. Creer une base MySQL et un utilisateur depuis hPanel.
2. Garder le nom de la base, l'utilisateur, le mot de passe et l'hote MySQL.
3. Construire `DATABASE_URL` avec ce format :

```text
mysql://DB_USER:DB_PASSWORD@DB_HOST:3306/DB_NAME
```

Les caracteres speciaux du mot de passe doivent etre encodes dans l'URL.

## 3. Exporter le catalogue local

Avant de creer l'archive ou de pousser le code, lancer localement :

```bash
npm run db:export-catalog
```

Cette commande actualise `prisma/catalog.snapshot.json`. Le snapshot contient les
reglages, categories, produits, variantes et chemins d'images. Il ne contient ni
comptes clients ni commandes.

Les images actuelles de `public/uploads` doivent rester dans le projet. Le script
de verification confirme que tous les chemins du snapshot correspondent a un fichier.

Si un ancien site en production contient deja des clients ou commandes, utiliser
plutot un export SQL complet via phpMyAdmin et l'importer dans la nouvelle base.

## 4. Creer l'application Node.js

1. Dans hPanel, ajouter une application Node.js depuis GitHub ou envoyer l'archive du projet.
2. Choisir Node.js 22 ou 24.
3. Ne pas envoyer `node_modules`, `.next`, `.env` ou `.env.local`.
4. Utiliser `npm run deploy:build` comme commande de build.
5. Utiliser `npm start` comme commande de demarrage.
6. Ne pas fixer `PORT` a `3005`; Hostinger fournit cette variable automatiquement.

## 5. Variables d'environnement

Ajouter dans hPanel toutes les variables de `.env.example` avec les vraies valeurs :

```text
DATABASE_URL=mysql://...
AUTH_SECRET=une-valeur-aleatoire-de-32-caracteres-minimum
NEXTAUTH_URL=https://votre-domaine.ma
ADMIN_EMAIL=admin
ADMIN_PASSWORD=un-mot-de-passe-fort-et-unique
NEXT_PUBLIC_WHATSAPP_NUMBER=212714516493
UPLOAD_DIR=/home/UTILISATEUR/domains/votre-domaine.ma/persistent-uploads
NEXT_PUBLIC_UPLOAD_URL=/media
```

Creer le dossier indique par `UPLOAD_DIR` dans le gestionnaire de fichiers Hostinger.
Il doit etre accessible en ecriture par l'application et rester en dehors du dossier
remplace lors des redeploiements.

Ne jamais reutiliser `admin` comme mot de passe de production. La commande de build
refuse volontairement les mots de passe faibles et les valeurs d'exemple.

## 6. Ce que fait le build

`npm run deploy:build` execute dans cet ordre :

1. Validation des variables de production.
2. Generation du client Prisma.
3. Application des migrations MySQL avec `prisma migrate deploy`.
4. Creation ou mise a jour du compte administrateur defini dans hPanel.
5. Import du snapshot uniquement si aucun produit n'existe deja.
6. Build Next.js de production.

Les futurs redeploiements ne remplacent donc pas les produits modifies dans l'admin.

## 7. Verification apres deploiement

Verifier les URLs suivantes :

```text
https://votre-domaine.ma/api/health
https://votre-domaine.ma/connexion
https://votre-domaine.ma/admin/login
```

`/api/health` doit retourner `status: ok` et `database: ok`.

Verifier ensuite :

1. Connexion administrateur avec les identifiants definis dans hPanel.
2. Ajout d'une image depuis l'admin, puis affichage de son URL `/media/...`.
3. Ajout au panier, connexion ou inscription client et validation de commande.
4. Affichage de la nouvelle commande dans l'administration.
5. Bascule FR/AR sur ordinateur et telephone.

## 8. Sauvegardes

Sauvegarder regulierement la base MySQL et le dossier persistent indique par
`UPLOAD_DIR`. Une sauvegarde de la base seule ne contient pas les fichiers images.
