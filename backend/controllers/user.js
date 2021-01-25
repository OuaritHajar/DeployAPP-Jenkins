const UserModel = require('../models/User');
const bcrypt = require('bcrypt');
//const jwt = require('jsonwebtoken');
module.exports = {
  signup: async (req, res, next) => {
    try {
      console.log(req.body);
      // Params
      var firstName = req.body.first_name;
      var lastName = req.body.last_name;
      var email = req.body.email;
      var password = req.body.password;

      if (email == null || password == null) {
        return res.status(400).json({ 'error': 'missing parameters' });
      };

      // verification - regex - mdp etc...
      // verif existance

      const newUser = await UserModel.create({
        first_Name: firstName,
        last_Name: lastName,
        email: email,
        password: password
      })
      .then(function (newUser) {
        return res.status(201).json({
          'userId': newUser.id
        })
      })
      .catch(function (error) {
        return res.status(500).json({ 'error': 'cannot add user' });
      });
      //bcrypt.hash(password, 5, async (error, bcryptedPassword) => {
      //  try {
//
      //    console.log("Là c'est ok");
      //    const newUser = await UserModel.findOrCreate({
      //      first_Name: firstName,
      //      last_Name: lastName,
      //      email: email,
      //      password: bcryptedPassword
      //    })
      //      .then(function (newUser) {
      //        console.log('haaaaaaaaaaaaaaaaaa!!!');
      //        return res.status(201).json({
      //          'userId': newUser.id
      //        })
      //      })
      //      .catch(function (error) {
      //        console.log('haaaaaaaaaaaaaaaaaa!!!!!!!!!!!!!!!!!!!!!!!!');
      //        return res.status(500).json({ 'error': 'cannot add user' });
      //        
      //      });
//
      //  } catch (err) {
      //    console.error(err)
      //  }
      //});
    } catch (err) {
      console.error(err);
    }
  },
};


//module.exports = {
//  login: async (req, res, next) => {
//    try {
//      
//    } catch (err) {
//      console.error(err);
//    }
//  },
//};