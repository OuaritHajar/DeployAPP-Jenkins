# P7_Groupomania
Réseau sociaux d'entreprise

![Légende](url vers l'image)


##Prérequis
NodeJs - MySQL Server 


-----------------
### Description
  Réseau sosical d'entreprise comprenant une base de donnée relationnelle MySQL, API Rest, Front-End avec VueJs v3

### Langages utilisés 
  HTML, CSS, JavaScript
  
### Frameworks et outils
   Front : VueJs, VueX
   Back : NodeJs, Express, Sequelize
   BDD : MySQL

### Logiciels
  MySQL WorkBench v8.0 - MAMP v4.2 - PostMan v8.7 - VSC - Suite Git


-----------------
# Installation

## Base de donnée
Connection : `mysql -u root -p` 
Récupération de la base de donnée :
  1. Créer la base de donnée --------- `CREATE DATABASE database_development;`
  2. Utiliser la base de donné --------- `USE database_development`
  3. Récuperer les données ----------- `SOURCE P7_groupomania/sauvegarde_database_groupomania.sql`
  4. Motdepasse? 

## Back-End API Rest
1. Dépendances backend-----------  `cd backend` => `npm install`
2. Lancer le serveur --------------------   `nodemon server`

## Front-End VueJs   
1. Installer les dépendances  ------------------ `cd frontend/groupomania-app` => `npm install`
2. Lancer le serveur --------------------------- `npm run serve`

# Ouvrer l'application
http://localhost:8080/
