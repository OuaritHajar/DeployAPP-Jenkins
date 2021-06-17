const db = require('../models');
const bcrypt = require('bcrypt');
const jwtUtils = require('../utils/jwt.utils');

const EMAIL_REGEX = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
const PASSWORD_REGEX = /^(?=.*\d).{4,8}$/;

//const jwt = require('jsonwebtoken');
module.exports = {
  signup: async (req, res, next) => {

    // Params
    console.log(req.body);
    const firstName = req.body.first_name;
    const lastName = req.body.last_name;
    const email = req.body.email;
    const password = req.body.password;
    const isAdmin = false;

    if (firstName === null || lastName === null || email === null || password === null) {
      return res.status(400).json({ 'error': 'missing parameters' });
    }
    if (firstName.length >= 20 || firstName.length <= 2) {
      return res.status(400).json({ 'error': 'first name invalid (length : 3 - 19' });
    }
    if (lastName.length >= 20 || lastName.length <= 2) {
      return res.status(400).json({ 'error': 'last name invalid (length : 3 - 19' });
    }
    if (!EMAIL_REGEX.test(email)) {
      return res.status(400).json({ 'error': 'email is not valid' });
    }
    if (!PASSWORD_REGEX.test(password)) {
      return res.status(400).json({ 'error': 'password is not valid : length 4-8 include number' });
    }

    try {
      const userFound = await db.User.findOne({
        attributes: ['email'],
        where: { email: email }
      })
      if (!userFound) {
        bcrypt.hash(password, 5, async (error, bcryptedPassword) => {
          const newUser = await db.User.create({
            first_name: firstName,
            last_name: lastName,
            email: email,
            password: bcryptedPassword,
            isAdmin: isAdmin
          })
          if (newUser) {
            console.log(newUser.dataValues);
            return res.status(201).json({
              'userId': newUser.id,
            })
          }
        });
      } else {
        return res.status(409).json({ 'error': 'user already exist' })
      }
    } catch (err) {
      console.error(err);
    }
  },








  login: async (req, res, next) => {

    const email = req.body.email;
    const password = req.body.password;

    if (email === null || password === null) {
      return res.status(400).json({ 'error': 'missing parameters' });
    }

    try {
      const userFound = await db.User.findOne({
        where: { email: email }
      })
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

    } catch (err) {
      console.error(err);
    }
  },






  getUserProfile: async (req, res) => {

    const headerAuth = req.headers['authorization'];
    const userId = jwtUtils.getUserId(headerAuth);

    if (userId < 0)
      return res.status(400).json({ 'error': 'wrong token' });

    try {
      const userFound = await db.User.findOne({
        attributes: ['id', 'first_name', 'last_name', 'email', 'createdAt'],
        where: { id: req.params.userId }
      })
      if (userFound) {
        res.status(201).json(userFound);
      } else {
        res.status(404).json({ 'error': 'user not found' });
      }
    } catch (err) {
      console.error(err)
    }
  },




  updateUserProfile: async (req, res) => {
    // Getting auth header
    const headerAuth = req.headers['authorization'];
    const userId = jwtUtils.getUserId(headerAuth);

    //Params
    const firstName = req.body.first_name;
    const lastName = req.body.last_name;

    try {

      // on cherche l'utilisateur ciblé
      const userCible = await db.User.findOne({
        attributes: ['id', 'first_name', 'last_name'],
        where: { id: req.params.userId }
      })

      //const UserPrivilege = await db.User.findOne({
      //  where: { id: userId }
      //})

      if (userCible) {

        //son propre profil 
        if (userCible.id == userId) {

          // si on le trouve on met a jour la base de donnée
          const updateProfil = await userCible.update({
            first_name: (firstName ? firstName : userCible.first_name),
            last_name: (lastName ? lastName : userCible.last_name)
          })

          if (updateProfil) {
            res.status(201).json(updateProfil)
          }
        } else {
          return res.status(404).json({ 'error': 'no authorized, modifier votre propre profil ou augmenter vos privilège' })
        }
      } else {
        res.status(404).json({ 'error': 'user not found' });
      }

    }
    catch (err) {
      console.error(err)
    };
  },







  deleteUser: async (req, res) => {
    // Getting auth header
    const headerAuth = req.headers['authorization'];
    const userId = jwtUtils.getUserId(headerAuth);

    try{
    // on cherche l'utilisateur ciblé
    const userTargetFound = await db.User.findOne({
      where: { id: req.params.userId }
    })
        if (userTargetFound) {

          if (userId === userTargetFound.id ) {

            const deleteUserTarget = await db.User.destroy({
              where: { id: userTargetFound.id }
            })

            if (deleteUserTarget)
                res.status(201).json({ 'message': 'User ' + req.params.userId + ' deleted' })


                // suprimer contenu

                
          } else {
            return res.status(404).json({ 'error': 'no permission' })
          }
        } else {
          return res.status(404).json({ 'error': 'user not found' });
        }
      }
      catch(err) {
        console.error(err)
      };
  }


};