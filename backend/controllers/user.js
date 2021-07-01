const db = require('../models');
const bcrypt = require('bcrypt');
const jwtUtils = require('../utils/jwt.utils');
const fs = require('fs');

const EMAIL_REGEX = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
const PASSWORD_REGEX = /^(?=.*\d).{4,8}$/;

//const jwt = require('jsonwebtoken');
module.exports = {
  signup: async (req, res, next) => {

    // Params
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

            // on cherche les likes
            const likesFound = await db.Like.findAll({
              where: { userId : userTargetFound.id}
            })

            if(likesFound) {
              const destroyLikes = await db.Like.destroy({
                where: { userId : userTargetFound.id }
              })
              if (destroyLikes) {
                  
              }
            }



            // on cherche les comments
            const commentsFound = await db.Comment.findAll({
              where: { userId : userTargetFound.id}
            })

            if(commentsFound) {
              const destroyComments = await db.Comment.destroy({
                where: { userId : userTargetFound.id }
              })
              if (destroyComments) {
                  
              }
            }



            // on cherche les posts
            const postsFound = await db.Post.findAll({
              where: { userId : userTargetFound.id}
            })

            if(postsFound) {
              const destroyPosts = await db.Post.destroy({
                where: { userId : userTargetFound.id }
              })
              if (destroyPosts) {
                  
              }
            }



            // on cherche les images
            const imageFound = await db.Image.findAll({
              where: { userId : userId}
            })
            if(imageFound) {

                // on supprime l'image de la database
                const destroyImage = await db.Image.destroy({
                    where: { userId: userId }
                })
                if (destroyImage) {

                    // supprime les images
                    for( const image in imageFound) {
                      if(`${imageFound[image].url}` != null) {
                        fs.unlink(`${imageFound[image].url}`, (err) =>{
                          if (err) {
                            console.error(err)
                          } else {
                            console.log('image supprimé')
                          }
                        })
                      }
                    }
                    //res.status(202).json({ 'message': ' Image from post deleted' })
                      
                }
            }
            

              //[
              //  Image {
              //    dataValues: {
              //      id: 46,
              //      type: 'image/jpeg',
              //      name: '652a7adb1b_98148_01-intro-773.jpg',
              //      data: <Buffer ff d8 ff e0 00 10 4a 46 49 46 00 01 01 01 00 48 00 48 00 00 ff db 00 43 00 0d 09 0a 0b 0a 08 0d 0b 0a 0b 0e 0e 0d 0f 13 20 15 13 12 12 13 27 1c 1e 17 ... 27804 more bytes>,
              //      url: 'C:\\Users\\michm\\Documents\\rest\\P7_Groupomania\\backend\\resources\\static\\assets\\uploads\\img_url-1625163881325-652a7adb1b_98148_01-intro-773.jpg',
              //      createdAt: 2021-07-01T18:24:41.000Z,
              //      updatedAt: 2021-07-01T18:24:41.000Z,
              //      UserId: 10
              //    },
              //    _previousDataValues: {
              //      id: 46,
              //      type: 'image/jpeg',
              //      name: '652a7adb1b_98148_01-intro-773.jpg',
              //      data: <Buffer ff d8 ff e0 00 10 4a 46 49 46 00 01 01 01 00 48 00 48 00 00 ff db 00 43 00 0d 09 0a 0b 0a 08 0d 0b 0a 0b 0e 0e 0d 0f 13 20 15 13 12 12 13 27 1c 1e 17 ... 27804 more bytes>,
              //      url: 'C:\\Users\\michm\\Documents\\rest\\P7_Groupomania\\backend\\resources\\static\\assets\\uploads\\img_url-1625163881325-652a7adb1b_98148_01-intro-773.jpg',
              //      createdAt: 2021-07-01T18:24:41.000Z,
              //      updatedAt: 2021-07-01T18:24:41.000Z,
              //      UserId: 10
              //    },
              //    _changed: Set(0) {},
              //    _options: {
              //      isNewRecord: false,
              //      _schema: null,
              //      _schemaDelimiter: '',
              //      raw: true,
              //      attributes: [Array]
              //    },
              //    isNewRecord: false
              //  },
              //  Image {
              //    dataValues: {
              //      id: 47,
              //      type: 'image/jpeg',
              //      name: '652a7adb1b_98148_01-intro-773.jpg',
              //      data: <Buffer ff d8 ff e0 00 10 4a 46 49 46 00 01 01 01 00 48 00 48 00 00 ff db 00 43 00 0d 09 0a 0b 0a 08 0d 0b 0a 0b 0e 0e 0d 0f 13 20 15 13 12 12 13 27 1c 1e 17 ... 27804 more bytes>,
              //      url: 'C:\\Users\\michm\\Documents\\rest\\P7_Groupomania\\backend\\resources\\static\\assets\\uploads\\img_url-1625163891928-652a7adb1b_98148_01-intro-773.jpg',
              //      createdAt: 2021-07-01T18:24:51.000Z,
              //      updatedAt: 2021-07-01T18:24:51.000Z,
              //      UserId: 10
              //    },
              //    _previousDataValues: {
              //      id: 47,
              //      type: 'image/jpeg',
              //      name: '652a7adb1b_98148_01-intro-773.jpg',
              //      data: <Buffer ff d8 ff e0 00 10 4a 46 49 46 00 01 01 01 00 48 00 48 00 00 ff db 00 43 00 0d 09 0a 0b 0a 08 0d 0b 0a 0b 0e 0e 0d 0f 13 20 15 13 12 12 13 27 1c 1e 17 ... 27804 more bytes>,
              //      url: 'C:\\Users\\michm\\Documents\\rest\\P7_Groupomania\\backend\\resources\\static\\assets\\uploads\\img_url-1625163891928-652a7adb1b_98148_01-intro-773.jpg',
              //      createdAt: 2021-07-01T18:24:51.000Z,
              //      updatedAt: 2021-07-01T18:24:51.000Z,
              //      UserId: 10
              //    },
              //    _changed: Set(0) {},
              //    _options: {
              //      isNewRecord: false,
              //      _schema: null,
              //      _schemaDelimiter: '',
              //      raw: true,
              //      attributes: [Array]
              //    },
              //    isNewRecord: false
              //  },
              //  Image {
              //    dataValues: {
              //      id: 48,
              //      type: 'image/jpeg',
              //      name: '652a7adb1b_98148_01-intro-773.jpg',
              //      data: <Buffer ff d8 ff e0 00 10 4a 46 49 46 00 01 01 01 00 48 00 48 00 00 ff db 00 43 00 0d 09 0a 0b 0a 08 0d 0b 0a 0b 0e 0e 0d 0f 13 20 15 13 12 12 13 27 1c 1e 17 ... 27804 more bytes>,
              //      url: 'C:\\Users\\michm\\Documents\\rest\\P7_Groupomania\\backend\\resources\\static\\assets\\uploads\\img_url-1625163909422-652a7adb1b_98148_01-intro-773.jpg',
              //      createdAt: 2021-07-01T18:25:09.000Z,
              //      updatedAt: 2021-07-01T18:25:09.000Z,
              //      UserId: 10
              //    },
              //    _previousDataValues: {
              //      id: 48,
              //      type: 'image/jpeg',
              //      name: '652a7adb1b_98148_01-intro-773.jpg',
              //      data: <Buffer ff d8 ff e0 00 10 4a 46 49 46 00 01 01 01 00 48 00 48 00 00 ff db 00 43 00 0d 09 0a 0b 0a 08 0d 0b 0a 0b 0e 0e 0d 0f 13 20 15 13 12 12 13 27 1c 1e 17 ... 27804 more bytes>,
              //      url: 'C:\\Users\\michm\\Documents\\rest\\P7_Groupomania\\backend\\resources\\static\\assets\\uploads\\img_url-1625163909422-652a7adb1b_98148_01-intro-773.jpg',
              //      createdAt: 2021-07-01T18:25:09.000Z,
              //      updatedAt: 2021-07-01T18:25:09.000Z,
              //      UserId: 10
              //    },
              //    _changed: Set(0) {},
              //    _options: {
              //      isNewRecord: false,
              //      _schema: null,
              //      _schemaDelimiter: '',
              //      raw: true,
              //      attributes: [Array]
              //    },
              //    isNewRecord: false
              //  }
              //]





            // on supprimer l'user
            const deleteUserTarget = await db.User.destroy({
              where: { id: userTargetFound.id }
            })

            if (deleteUserTarget)
                res.status(201).json({ 'message': 'User deleted' })
                
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