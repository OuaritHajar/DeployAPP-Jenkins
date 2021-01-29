// Imports
const express = require('express');
const bodyParser = require('body-parser');
const { Sequelize } = require('sequelize');

const app = express();
global.__basedir = __dirname;
const db = require('./config/db.config.js');

//const initRoutes = require("./routes/web");
const userRoutes = require('./routes/user');
const postRoutes = require('./routes/post');

const helmet = require("helmet");


// Body Parser config 
app.use(bodyParser.urlencoded({ extended: true }));  //force le parse dans les objet imbriqué
app.use(bodyParser.json());

//connect au cluster - base de donnée
const sequelize = new Sequelize('database_development', 'root', 'motdepasse', {
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



//Route user

app.use('/api/posts', postRoutes);
app.use('/api/users', userRoutes);


db.sequelize.sync();
//db.sequelize.sync({ force: true }).then(() => {
//  console.log("Drop and re-sync db.");
//});
//require('./routes/upload.router.js')(app);




//exporter cette application pour etre asccessible depuis servernode
module.exports = app;