# P7_Groupomania
Réseau sociaux d'entreprise

![Légende](https://zupimages.net/up/21/28/1k1c.png)



## Description
  Réseau sosical d'entreprise comprenant une base de donnée relationnelle MySQL, API Rest, Front-End avec VueJs v3

## Langages utilisés 
  HTML, CSS, JavaScript
  
## Frameworks et outils
  * Front : VueJs, VueX  
   
   * Back : NodeJs, Express, Sequelize  
   
   * BDD : MySQL  
   

### Logiciels
  MySQL WorkBench v8.0 - MAMP v4.2 - PostMan v8.7 - VSC - Suite Git

# Installation


### Prérequis
* NodeJs 
* MySQL Server 
  
  
  
## Base de donnée
  1. Connection : ---------------------- `mysql -u root -p` 
  2. Créer la base de donnée --------- `CREATE DATABASE database_development;`
  3. Utiliser la base de donné --------- `USE database_development`
  4. Récuperer les données ----------- `SOURCE P7_groupomania/sauvegarde_database.sql`    
  
  
  
  
## Back-End API Rest
Ajouter le fichier '.env' dans le dossier backend:  :`
DB_HOST='database_development'
DB_USER='root'
DB_PASS='motdepasse'
`
1. Dépendances backend -------------  `cd backend` => `npm install`
2. Lancer le serveur -------------------   `nodemon server`

  
  
  
## Front-End VueJs   
1. Installer les dépendances  ---------- `cd frontend` => `npm install`
2. Lancer le serveur ------------------- `npm run serve`
  
  
  
# Ouvrer l'application
http://localhost:8080/
