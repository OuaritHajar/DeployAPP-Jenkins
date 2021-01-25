const db = require('../models');
//const bcrypt = require('bcrypt');

//const jwt = require('jsonwebtoken');
module.exports = {
  signup: async (req, res, next) => {
    try {
      // Params
      var firstName = req.body.first_name ;
      var lastName = req.body.last_name;
      var email = req.body.email;
      var password = req.body.password;

      if (firstName == null || lastName == null || email == null || password == null) {
        return res.status(400).json({ 'error': 'missing parameters' });
      };

      // verification - regex - mdp etc...
      // verif existance
      // vérif unique
      const newUser = await db.User.create({
        first_name: firstName,
        last_name: lastName,
        email: email,
        password: password
      })
      .then(function(newUser) {
        return res.status(201).json({
          'userId': newUser.id
        })
      })
      .catch(function (error) {
        console.log(error);
        return res.status(500).json({'error': 'cannot add user' });
      });

      //bcrypt.hash(password, 5, async (error, bcryptedPassword) => {
      //  try {
//
      //    console.log("Là c'est ok");
      //    const newUser = await db.user.findOrCreate({
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