// Imports
const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const { Sequelize } = require('sequelize');
const userRoutes = require('./routes/user');
const postRoutes = require('./routes/post');

// Body Parser config 
app.use(bodyParser.urlencoded({ extended: true }));  //force le parse dans les objet imbriqué
app.use(bodyParser.json());

//const helmet = require("helmet");
//const path = require('path');
//require('dotenv').config();

//connect au cluster - base de donnée
const sequelize = new Sequelize('database_development', 'root', 'motdepasse', {
    host: 'localhost',
    dialect: 'mysql',
    //define:{
    //    freezeTableName: true
    //}
});

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
//app.use(helmet());

//sers un dossier static (chemin : )
//app.use('/images', express.static(path.join(__dirname, 'images')));
//Route 
//app.use('/api/', );
//Route user
app.get('/', function(req,res) {
    res.setHeader('Content-Type','text/html');
    res.status(200).send('<h1>Yeah ca fonctionne</h1>')
});

app.use('/api/', postRoutes);
app.use('/api/users', userRoutes);

app.post('/users', async(req,res) => {
    const { first_name, last_name, email, password } = req.body;

    try{
        const user = await User.create({first_name, last_name, email, password});
        return res.json(user);
    }catch(err){
        console.log(err).json(err);
    }
})

//exporter cette application pour etre asccessible depuis servernode
module.exports = app;