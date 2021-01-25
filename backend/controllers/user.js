const db = require('../models');
const bcrypt = require('bcrypt');
const jwtUtils = require('../utils/jwt.utils');

//const jwt = require('jsonwebtoken');
module.exports = {
  signup: async (req, res, next) => {
    try {

      // Params
      var firstName = req.body.first_name;
      var lastName = req.body.last_name;
      var email = req.body.email;
      var password = req.body.password;

      db.User.findOne({
        attributes: ['email'],
        where: { email: email }
      })
        .then(function (userFound) {
          if (!userFound) {
            bcrypt.hash(password, 5, async (error, bcryptedPassword) => {
              try {
                const newUser = await db.User.create({
                  first_name: firstName,
                  last_name: lastName,
                  email: email,
                  password: bcryptedPassword
                })
                  .then(function (newUser) {
                    return res.status(201).json({
                      'userId': newUser.id
                    })
                  })
                  .catch(function (error) {
                    return res.status(500).json({ 'error': 'cannot add user' });
                  });
              } catch (err) {
                console.error(err)
              }
            });
          } else {
            return res.status(409).json({ 'error': 'user already exist' })
          }
        })
        .catch(function (error) {
          return res.status(500).json({ 'error': 'unable to verify user' })
          
        });
    } catch (err) {
      console.error(err);
    }
  },



  login: async (req, res, next) => {
    try {

      // Params
      var email = req.body.email;
      var password = req.body.password;

      if (email == null || password == null) {
        return res.status(400).json({'error' : 'missing parameters'});
      }

      // TODO

      db.User.findOne({
        where: { email: email}
      })
      .then(function(userFound) {
        if (userFound) {

          bcrypt.compare(password, userFound.password, function(errBycrypt, resBycrypt) {
            if(resBycrypt) {
              return res.status(200).json({
                'userId': userFound.id,
                'token': jwtUtils.generateTokenForUser(userFound)
              });
            } else {
              return res.status(403).json({'error' : 'Invalide password'});
            }
          });

        } else {
          return res.status(404).json({'error' : 'user not exist'});
        }
      })
      .catch(function(err) {
        return res.status(500).json({'error' : 'unable to verify user'});
      });







    } catch (err) {
      console.error(err);
    }
  }



};