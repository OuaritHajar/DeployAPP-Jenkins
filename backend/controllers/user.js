const db = require('../models');
const bcrypt = require('bcrypt');
const jwtUtils = require('../utils/jwt.utils');

const EMAIL_REGEX = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
const PASSWORD_REGEX = /^(?=.*\d).{4,8}$/;

//const jwt = require('jsonwebtoken');
module.exports = {
  signup: async (req, res, next) => {
    try {
      // Params
      var firstName = req.body.first_name;
      var lastName = req.body.last_name;
      var email = req.body.email;
      var password = req.body.password;

      if (firstName == null || lastName == null || email == null || password == null) {
        return res.status(400).json({ 'error': 'missing parameters' });
      }

      //if (username.length >= 13 || username.length <= 4) {
      //  return res.status(400).json({'error': 'wrong username (length : 5 - 12'});
      //}

      if (!EMAIL_REGEX.test(email)) {
        return res.status(400).json({ 'error': 'email is not valid' });
      }

      if (!PASSWORD_REGEX.test(password)) {
        return res.status(400).json({ 'error': 'password is not valid : length 4-8 include number' });
      }

      // TODO


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
                    console.log(newUser);
                    return res.status(201).json({
                      'userId': newUser.id,
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
        return res.status(400).json({ 'error': 'missing parameters' });
      }

      // TODO

      db.User.findOne({
        where: { email: email }
      })
        .then(function (userFound) {
          if (userFound) {

            bcrypt.compare(password, userFound.password, function (errBycrypt, resBycrypt) {
              if (resBycrypt) {
                return res.status(200).json({
                  'userId': userFound.id,
                  'token': jwtUtils.generateTokenForUser(userFound)
                });
              } else {
                return res.status(403).json({ 'error': 'Invalide password' });
              }
            });

          } else {
            return res.status(404).json({ 'error': 'user not exist' });
          }
        })
        .catch(function (err) {
          return res.status(500).json({ 'error': 'unable to verify user' });
        });
    } catch (err) {
      console.error(err);
    }
  },






  getUserProfile: function (req, res) {
    // Getting auth header
    var headerAuth = req.headers['authorization'];
    var userId = jwtUtils.getUserId(headerAuth);

    if (userId < 0)
      return res.status(400).json({ 'error': 'wrong token' });

    db.User.findOne({
      attributes: ['id', 'first_name', 'last_name', 'email'],
      where: { id: userId }
    })
      .then(function (user) {
        if (user) {
          res.status(201).json(user);
        } else {
          res.status(404).json({ 'error': 'user not found' });
        }
      }).catch(function (err) {
        res.status(500).json({ 'error': 'cannot fetch user' });
      });
  },




  updateUserProfile: function (req, res) {
    // Getting auth header
    var headerAuth = req.headers['authorization'];
    var userId = jwtUtils.getUserId(headerAuth);

    //Params
    var firstName = req.body.first_name;
    var lastName = req.body.last_name;

    // on cherche l'utilisateur
    db.User.findOne({
      attributes: ['id', 'first_name', 'last_name'],
      where: { id: userId }
    })
      .then(function (userFound) {
        if (userFound) {
          // si on le trouve on met a jour la base de donnée
          userFound.update({
            first_name: (firstName ? firstName : userFound.first_name),
            last_name: (lastName ? lastName : userFound.last_name)
          })
            .then(function () {
              res.status(201).json(userFound) 
            })
            .catch(function (err) {
              res.status(500).json({ 'error': 'cannot update user' });
            });
        } else {
          res.status(404).json({ 'error': 'user not found' });
        }
      }).catch(function (err) {
        return res.status(500).json({ 'error': 'unable to verify user' });
      });
  },







  deleteUser: function (req, res) {
    // Getting auth header
    var headerAuth = req.headers['authorization'];
    var userId = jwtUtils.getUserId(headerAuth);


    // on cherche l'utilisateur
    db.User.findOne({
      where: { id: userId }
    })
      .then(function (userFound) {
        if (userFound && userId) {
          if ( userId == req.params.userId ) {
            db.User.destroy({
              where: { id: req.params.userId }
            })
              .then(function () {
                res.status(201).json({'message': 'User ' + req.params.userId + ' deleted'}) 
              })
              .catch(function (err) {
                res.status(500).json({ 'error': 'cannot update user' });
              });
          } else {
            return res.status(404).json({'error' : 'no permission'})
          }
        } else {
          res.status(404).json({ 'error': 'user not found' });
        }
      }).catch(function (err) {
        return res.status(500).json({ 'error': 'unable to verify user' });
      });
  }
};