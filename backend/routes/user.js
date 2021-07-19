// Imports
const express = require('express');
const router = express.Router();
const usersCtrl = require('../controllers/user');
// Multer
const uploadPhoto = require('../config/uploadPhoto.config.js');
const fileWorker = require('../controllers/image.js');


// Users routes
router.post('/signup', usersCtrl.signup);
router.post('/login', usersCtrl.login);
router.get('/:userId', usersCtrl.getUserProfile);
router.put('/:userId',uploadPhoto.single("avatarUrl"), usersCtrl.updateUserProfile, fileWorker.updatePhoto);
router.delete('/:userId', usersCtrl.deleteUser);

module.exports = router;