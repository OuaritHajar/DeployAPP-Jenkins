// Imports
const express = require('express');
const router = express.Router();
const usersCtrl = require('../controllers/user');

// Users routes
router.post('/signup', usersCtrl.signup);
router.post('/login', usersCtrl.login);
router.get('/user', usersCtrl.getUserProfile);
router.put('/user', usersCtrl.updateUserProfile);
router.delete('/:userId', usersCtrl.deleteUser);

module.exports = router;