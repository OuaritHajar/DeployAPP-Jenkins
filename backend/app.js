// Imports
const express = require('express');
const bodyParser = require('body-parser');
const { Sequelize } = require('sequelize');
require('dotenv').config();
const app = express();
global.__basedir = __dirname;
//const db = require('./config/db.config.js');
const db = require('./models/index.js');
const path = require('path')

// Body Parser config 
app.use(bodyParser.urlencoded({ extended: true }));  //force le parse dans les objet imbriqué
app.use(bodyParser.json());
const helmet = require("helmet");

//const initRoutes = require("./routes/web");
const userRoutes = require('./routes/user');
const postRoutes = require('./routes/post');



//connect au cluster - base de donnée
const sequelize = new Sequelize(process.env.DB_HOST, process.env.DB_USER, process.env.DB_PASS, {
    host: 'localhost',
    dialect: 'mysql',
    //define:{
    //    freezeTableName: true
    //}
});

// test de connection
const testConnection = async () => {
    try {
        await sequelize.authenticate();
        console.log('Connection has been established successfully.');
    }catch (error) {
        console.error('Unable to connect to the database:', error);
    }
};
testConnection();

//rajoute entete a l'objet response qu'on renvoi au navigateur - CORS
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
    next();
});

//securisation des headers
app.use(helmet());

//Image
app.use('/images', express.static('resources'));

//Route user
app.use('/api/users', userRoutes);
app.use('/api/posts', postRoutes);  


//db.sequelize.sync();
//db.sequelize.sync({ alter: true }).then(() => {
// console.log("Drop and re-sync db.");
//});


//exporter cette application pour etre asccessible depuis servernode
module.exports = app;