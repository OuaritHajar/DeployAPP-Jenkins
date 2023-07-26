// Imports
const express = require('express');
const bodyParser = require('body-parser');
const { Sequelize } = require('sequelize');

const app = express();
const db = require('./models/index.js');
const path = require('path');

require('dotenv').config();
global.__basedir = __dirname;

// Body Parser config
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

const helmet = require('helmet');

//connect au cluster
const sequelize = new Sequelize(process.env.DB_DB, process.env.DB_USER, process.env.DB_PASS, {
  host: process.env.DB_HOST,
  dialect: 'mysql',
  port: process.env.DB_PORT,
});

// Test database connection
const testConnection = async () => {
  try {
    await sequelize.authenticate();
    console.log('Connection has been established successfully.');
  } catch (error) {
    console.error('Unable to connect to the database:', error);
  }
};
testConnection();

// Add CORS headers
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
  next();
});

// Secure the app with helmet
app.use(helmet());

// Serve static images
app.use('/images', express.static('resources'));

// Route user
const userRoutes = require('./routes/user');
const postRoutes = require('./routes/post');
app.use('/api/users', userRoutes);
app.use('/api/posts', postRoutes);

module.exports = app;