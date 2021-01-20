const UserModel = require('../models/User');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

module.exports = {
  signup: async (req, res, next) => {

    // Params
    var firstName = req.body.first_name;
    var lastName = req.body.last_name;
    var email = req.body.email;
    var password = req.body.password;

    if (email == null || password == null) {
      return res.status(400).json({'error':'missing parameters'});
    }

    // verification - regex - mdp etc...


    // verif existance
    await UserModel.findAll({
      attributes: ['email'],
      where: { email: email}
    })
    .then(function(userFound) {
      if (!userFound) {

        bcrypt.hash(password, 5, function( err, bcryptedPassword ) {
          var newUser = UserModel.create({
            firstName: firstName,
            lastName: lastName,
            email: email,
            password: bcryptedPassword 
          })
          .then(function(newUser){
            return res.status(201).json({
              'userId': newUser.id
            })
          })
          .catch(function(err) {
            return res.status(500).json({'error':'cannot add user'});
          });
        });

      }else{
        return res.status(409).json({'error':'user already exist'});
      }
    })
    .catch(function(error){
      return res.status(500).json({'error':'unable to verify user'});
    });

  },

  login: function(req, res, next) {

  }
}
