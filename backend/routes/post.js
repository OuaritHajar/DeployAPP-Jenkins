// Imports
const express = require('express');
const postsCtrl = require('../controllers/post');
const router = express.Router();

// Users routes
router.get('/post', postsCtrl.findAll);
//router.post('/login', usersCtrl.login);

module.exports = router;