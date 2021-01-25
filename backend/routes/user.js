// Imports
const express = require('express');
const usersCtrl = require('../controllers/user');
const router = express.Router();

// Users routes
router.post('/signup', usersCtrl.signup);
router.post('/login', usersCtrl.login);

module.exports = router;