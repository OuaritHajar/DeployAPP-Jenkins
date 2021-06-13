// Imports
const express = require('express');
const router = express.Router();
const usersCtrl = require('../controllers/user');

// Users routes
router.post('/signup', usersCtrl.signup);
router.post('/login', usersCtrl.login);
router.get('/:userId', usersCtrl.getUserProfile);
router.put('/:userId', usersCtrl.updateUserProfile);
router.delete('/:userId', usersCtrl.deleteUser);

module.exports = router;