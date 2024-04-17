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

### Télécharger l'application Docker
1. Télécharger l'application Docker
2. Après le téléchargement, veuillez ouvrir 'cmd'
Lors de votre première utilisation, il faut mettre à jour WSL pour permettre d’exécuter des conteneurs Linux sur l’ordinateur. Lancer la commande :
```terminal
wsl --update
```
3. Télécharger MySQL sur l'application Docker
Pour créer le conteneur (instance de l’image) qui exécutera mysql dans docker, ouvrir un invite de commande et lancer la commande :
```terminal
docker run -d -p 3306:3306 --name mysql-server -e MYSQL_ROOT_PASSWORD=oracle -e MYSQL_DATABASE=scott -e MYSQL_USER=scott -e MYSQL_PASSWORD=oracle mysql/mysql-server:latest
```
4. Démarrer le server MySQL du Docker
Ceci devrait créer un conteneur mysql-server dans votre Docker Desktop. Vous pouvez ouvrir le terminal en cliquant sur les trois points à droite de celui-ci et Open in terminal.
![image](https://github.com/Ricieus/All-Nighter-s/assets/118473501/0a7b4105-0ff1-440b-87e0-6480a7d29470)
5. Connecter à MySQL
Vous pourrez vous connecter à mysql avec la ligne de commande mysql et le mot de passe est "oracle"
```terminal
mysql -u root -p
```
![image](https://github.com/Ricieus/All-Nighter-s/assets/118473501/fb964e39-16c7-41b8-a52e-3073e65dfd22)


### Création de la base de doonée
1. Créer un database
```mysql
CREATE DATABASE mybd;

USE mybd;
```
2. Créer les tableaux
Veuillez utiliser le script.sql (copier et coller le code) pour faire les création des tableaux.

> [!WARNING]
> IL EST IMPORTANT DE COPIER ET COLLER LE SCRIPT SELON LA COUPURE AVEC "---". NE PAS RESPECTER CETTE COUPURE PEUT AMENER

![image](https://github.com/Ricieus/All-Nighter-s/assets/118473501/3ac517a5-e892-4bcc-bdd3-5780bd311a6b)

3. Vérification des insertions (Optionnel)
Pour faire des vérifications des insertions, vous pouvez faire le code suivant:
```sql
SELECT * FROM (nomTable);
```

### Installation du Node.js
1. Télécharger l'application Node.js
2. Suivre les étapes demandés dans l'application de Node.js

### Installation de l'application Visual Studio Code
1. Télécharger l'application Visual Studio Code
2. Exécutez le fichier de téléchargement.
3. Acceptez les termes et conditions.
4. Cliquez sur le bouton Installer.
5. Attendez la fin de l'installation.
6. Cliquez sur le bouton Lancer pour le démarrer.

### Démarrer le serveur nécessaire
1. Veuillez télécharger le fichier direct ou par Github
![image](https://github.com/Ricieus/All-Nighter-s/assets/118473501/c323be0d-733d-4391-b979-154175692c16)

3. Ouvrir le fichier "Site(Client+Serveur)"
![image](https://github.com/Ricieus/All-Nighter-s/assets/118473501/6e567148-2201-4b43-9849-f9b799897002)
![image](https://github.com/Ricieus/All-Nighter-s/assets/118473501/cc7b84e1-822f-4b44-9b42-545793f865aa)

4. Démarrer les containers des Docker
![image](https://github.com/Ricieus/All-Nighter-s/assets/118473501/df84d772-ce06-481c-b09c-ef34770e8027)

6. Ouvrir un terminal dans le VS
![image](https://github.com/Ricieus/All-Nighter-s/assets/118473501/38dff9f0-ce06-451a-b6e4-5b7a8eb9eaaf)


8. Faire rouler le serveur avec le code :
```cmd
npx nodemon server.js
        OU
node server.js
```
![image](https://github.com/Ricieus/All-Nighter-s/assets/118473501/75ab24f3-e31a-43e2-9bf9-5f526d8e7ec7)
