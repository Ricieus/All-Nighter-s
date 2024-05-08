# All-Nighter-s

## Exigences
Les applications nécessaires pour faire fonctionner le site web sont :
- Application de Docker pour la base de données ([Docker](https://www.docker.com/products/docker-desktop/))
- Visual Studio Code ([Visual Studio Code](https://code.visualstudio.com/download))
- Node.js ([Node.js](https://nodejs.org/en))
- GitHub ([Docker](https://github.com/Ricieus/All-Nighter-s)) (Facultatif)

## Installation
Les installations pour le fonctionnement de notre page HTML varient selon votre choix de logiciel (Windows, Linux, Mac). 
Pour faire cette installation, veuillez utiliser Windows comme logiciel principal.
<br />

### Télécharger l'application Docker
1. Télécharger l'application Docker
2. Après le téléchargement, veuillez ouvrir 'cmd'
Lors de votre première utilisation, il faut mettre à jour WSL pour permettre d’exécuter des conteneurs Linux sur l’ordinateur. Lancer la commande :
```terminal
wsl --update
```

#### Télécharger MySQL sur l'application Docker
Pour créer le conteneur (instance de l’image) qui exécutera mysql dans docker, ouvrir un invite de commande et lancer la commande :
```terminal
docker run -d -p 3306:3306 --name mysql-server -e MYSQL_ROOT_PASSWORD=oracle -e MYSQL_DATABASE=scott -e MYSQL_USER=scott -e MYSQL_PASSWORD=oracle mysql/mysql-server:latest
```
<br />

1. Démarrer le server MySQL du Docker
Ceci devrait créer un conteneur mysql-server dans votre Docker Desktop. Vous pouvez ouvrir le terminal en cliquant sur les trois points à droite de celui-ci et Open in terminal.
![image](https://github.com/Ricieus/All-Nighter-s/assets/118473501/0a7b4105-0ff1-440b-87e0-6480a7d29470) <br />
2. Connecter à MySQL
Vous pourrez vous connecter à mysql avec la ligne de commande mysql et le mot de passe est "oracle"
```terminal
mysql -u root -p
```
![image](https://github.com/Ricieus/All-Nighter-s/assets/118473501/fb964e39-16c7-41b8-a52e-3073e65dfd22)<br />

#### Démarrer le server MongoDB sur l'application Docker
Pour créer le conteneur (instance de l’image) qui exécutera mongodb dans docker, ouvrir un invite de commande et lancer la commande :
```terminal
docker run --name mongo -d -p 27017:27017 mongodb/mongodb-community-server:latest
```
<br />

### Création de la base de doonée
1. Créer un database
```mysql
CREATE DATABASE mybd;

USE mybd;
```
<br />

2. Créer les tableaux
Veuillez utiliser le script.sql (copier et coller le code) pour faire les création des tableaux.
<br />

> [!WARNING]
> IL EST IMPORTANT DE COPIER ET COLLER LE SCRIPT SELON LA COUPURE AVEC "---". NE PAS RESPECTER CETTE COUPURE PEUT AMENER À DES ERREURS

![image](https://github.com/Ricieus/All-Nighter-s/assets/118473501/3ac517a5-e892-4bcc-bdd3-5780bd311a6b)
<br />

3. Vérification des insertions (Optionnel)        
Les véfification permmet à voir si les insertions sont correct. Pour faire des vérifications des insertions, vous pouvez faire le code suivant:
```sql
SELECT * FROM (nomTable);
```
<br />

### Installation du Node.js
1. Télécharger l'application Node.js
2. Suivre les étapes demandés dans l'application de Node.js
<br />

### Installation de l'application Visual Studio Code
1. Télécharger l'application Visual Studio Code
2. Exécutez le fichier de téléchargement.
3. Acceptez les termes et conditions.
4. Cliquez sur le bouton Installer.
5. Attendez la fin de l'installation.
6. Cliquez sur le bouton Lancer pour le démarrer.
<br />

### Démarrer le serveur nécessaire
1. Veuillez télécharger le fichier direct ou par Github
<div style="text-align:left"><img src="https://github.com/Ricieus/All-Nighter-s/assets/118473501/c323be0d-733d-4391-b979-154175692c16" /></div> <br />

3. Ouvrir le fichier "Site(Client+Serveur)"
<div style="text-align:left"><img src="https://github.com/Ricieus/All-Nighter-s/assets/118473501/6e567148-2201-4b43-9849-f9b799897002" /></div> <br />
<div style="text-align:left"><img src="https://github.com/Ricieus/All-Nighter-s/assets/118473501/cc7b84e1-822f-4b44-9b42-545793f865aa" /></div> <br />

4. Démarrer les containers des Docker
<div style="text-align:left"><img src="https://github.com/Ricieus/All-Nighter-s/assets/118473501/df84d772-ce06-481c-b09c-ef34770e8027" /></div> <br />

5. Ouvrir un terminal dans le VS
<div style="text-align:left"><img src="https://github.com/Ricieus/All-Nighter-s/assets/118473501/38dff9f0-ce06-451a-b6e4-5b7a8eb9eaaf" /></div> <br />


6. Faire rouler le serveur avec le code :
```cmd
npx nodemon server.js
        OU
node server.js
```
<div style="text-align:left"><img src="https://github.com/Ricieus/All-Nighter-s/assets/118473501/75ab24f3-e31a-43e2-9bf9-5f526d8e7ec7" /></div> <br />

## Stripe API
Dans notre projet, Stripe est une interface de programmation d'application (API), une plateforme de paiement en ligne largement utilisée. Son objectif principal est de permettre aux développeurs d'intégrer facilement les fonctionnalités de traitement des paiements de Stripe dans leurs propres applications et sites web. De plus, il offre d'autres fonctionnalités qui sont utilisés dans noter site:
1. Traitement des paiements
2. Gestion des clients
3. Rapports et analyses

### Création d'un compte Stripe
1. Création d'un compte sur le site ([Stripe API](https://dashboard.stripe.com/register?redirect=https%3A%2F%2Fdocs.stripe.com%2Fdevelopment))
<div style="text-align:left"><img src="https://github.com/Ricieus/All-Nighter-s/assets/118473501/fa1f4820-8469-4486-a79a-e9f0e912f869" /></div> <br />

2. Créer les taxes afin de l'appliquer dans le système de checkout
<div style="text-align:left"><img src="https://github.com/Ricieus/All-Nighter-s/assets/118473501/5c41c2b8-e63c-4857-93c3-9674eb550b24" /></div> <br />
<div style="text-align:left"><img src="https://github.com/Ricieus/All-Nighter-s/assets/118473501/ca3e1b33-4925-4d47-93dc-1713dbfd2c9" /></div> <br />
<div style="text-align:left"><img src="https://github.com/Ricieus/All-Nighter-s/assets/118473501/3b754e7f-76b4-4ec8-8193-ff52acdc68e6" /></div> <br />
<div style="text-align:left"><img src="https://github.com/Ricieus/All-Nighter-s/assets/118473501/34d2d615-fd3c-441f-8494-aa0882c5d679" /></div> <br />
<div style="text-align:left"><img src="https://github.com/Ricieus/All-Nighter-s/assets/118473501/6db95abe-75a6-4454-aee8-c3a708be660a" /></div> <br />
<div style="text-align:left"><img src="https://github.com/Ricieus/All-Nighter-s/assets/118473501/9b96c689-5007-45e1-a0c7-9acf47ddce10" /></div> <br />
<div style="text-align:left"><img src="https://github.com/Ricieus/All-Nighter-s/assets/118473501/42a0e0cc-a769-4bb9-b2c2-5701765e37f8" /></div> <br />
<div style="text-align:left"><img src="https://github.com/Ricieus/All-Nighter-s/assets/118473501/a223a9c0-2d85-48f4-8e6b-c8047614cc8f" /></div> <br />
<div style="text-align:left"><img src="https://github.com/Ricieus/All-Nighter-s/assets/118473501/874b55df-5d9a-4252-9af6-0fcebc4cfff2" /></div> <br />
