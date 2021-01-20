// Imports
const express = require('express');
const usersCtrl = require('../controllers/user');

// Router
exports.router = (function() {
    var router = express.Router();

    // Users routes
    router.route('/users/signup/').post(usersCtrl.signup);
    router.route('/users/login/').post(usersCtrl.login);

    return router;
})();