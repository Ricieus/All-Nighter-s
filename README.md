# All-Nighter-s

## Exigences
Les applications nécessaires pour faire fonctionner le site web sont :
- Application de Docker pour la base de données ([Docker](https://www.docker.com/products/docker-desktop/))
- Visual Studio Code ([Visual Studio Code](https://code.visualstudio.com/download))
- GitHub ([Docker](https://github.com/Ricieus/All-Nighter-s)) (Facultatif)

## Installation
Les installations pour le fonctionne de notre page HTML varie selon votre choix de logiciel (Windows, Linux, Mac). 
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

```diff
-- IL EST IMPORTANT DE COPIER ET COLLER LE SCRIPT SELON LA COUPURE AVEC ---. NE PAS RESPECTER CETTE COUPURE PEUT AMENER --
```
![image](https://github.com/Ricieus/All-Nighter-s/assets/118473501/983824bd-3230-498a-b86d-adfaf204f1c6)



1. Télécharger l'application Docker MySQL
2. Création de l'utilisateur SCOTT
3. Suivre les étapes dans le fichier "Script.sql" (Copier coller selon les séparations : --)
4. Télécharger l'application Visual Studio Code
5. Ouvrir le fichier "Site(Client+Serveur)
6. Ouvrir un terminal
7. Faire rouler le serveur avec le code :
    "npx nodemon server.js" OU "node server.js"






   <a name="headers"/>
## Headers
