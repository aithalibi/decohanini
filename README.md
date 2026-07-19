# Deco Hanini

Boutique Next.js 16 avec catalogue FR/AR, panier avec paiement a la livraison,
comptes clients et administration des categories, produits, images et commandes.

## Developpement

1. Copier les variables de `.env.example` dans `.env.local` et utiliser les valeurs locales.
2. Demarrer MySQL.
3. Appliquer les migrations et demarrer le site :

```bash
npm run db:migrate
npm run dev
```

Le site local est disponible sur `http://localhost:3005`.

## Verification

```bash
npm run lint
npm run typecheck
npm run build
```

## Deploiement

Le guide complet pour Hostinger se trouve dans [DEPLOYMENT_HOSTINGER.md](./DEPLOYMENT_HOSTINGER.md).

Commandes de production :

```bash
npm run deploy:build
npm start
```

`npm start` utilise automatiquement la variable `PORT` fournie par l'hebergeur.
