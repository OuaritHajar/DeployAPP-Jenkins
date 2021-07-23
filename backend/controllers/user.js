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
    const sexe = req.body.sexe
    const isAdmin = false;
    let avatarUrl = ''

    const pathAvatar = `${req.protocol}://${req.get('host')}/images/static/avatar/`
    function getRandomInt(max) {
      return Math.floor(Math.random() * max);
    }

    if (sexe == 0) {
      avatarUrl = pathAvatar + 'avatar' + (getRandomInt(7) + 6) + '.png'
    } else {
      avatarUrl = pathAvatar + 'avatar' + getRandomInt(7) + '.png'
    }
    console.log(avatarUrl)



    if (firstName === null || lastName === null || email === null || password === null) {
      return res.status(400).json({ 'error': 'missing parameters' });
    }
    if (firstName.length >= 30 || firstName.length <= 2) {
      return res.status(400).json({ 'error': 'first name invalid (length : 3 - 19' });
    }
    if (lastName.length >= 30 || lastName.length <= 2) {
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
            isAdmin: isAdmin,
            avatarUrl: avatarUrl,
            sexe: sexe
          })
          if (newUser) {
            console.log(newUser.dataValues);
            return res.status(201).json({
              'id': newUser.id,
            })
          }
        });
      } else {
        return res.status(409).json({ 'error': 'user already exist' })
      }
    } catch (err) {
      console.error(err);
      return res.status(400).json({ 'erreur': err })

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
              'id':          userFound.id,
              'token':       jwtUtils.generateTokenForUser(userFound),
              'first_name' : userFound.first_name,
              'last_name':   userFound.last_name,
              'avatarUrl':   userFound.avatarUrl,
              'sexe':        userFound.sexe,
              'createdAt' :  userFound.createdAt,
              'updatedAt':   userFound.updatedAt,
              'email':       userFound.updatedAt,
              'isAdmin':     userFound.isAdmin,

            })
          } else {
            return res.status(403).json({ 'error': 'Invalide password' })
          }
        })
      } else {
        return res.status(404).json({ 'error': 'user not exist' })
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
        attributes: ['id', 'first_name', 'last_name', 'email', 'createdAt', 'avatarUrl', 'sexe', 'isAdmin'],
        where: { id: req.params.userId },
        include: [{ 
            model: db.Post,
            },{
            model: db.Like,
                include: [{ model: db.Post ,
                    include: [{
                        model: db.User , attributes: ['first_name', 'last_name','id']
                    }] 
                }]
            },{
            model: db.Comment,
                include: [{ model: db.Post ,
                    include:[{
                      model : db.User, attributes: ['first_name', 'last_name','id']
                    }] 
                }]
            }
        ]
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




  updateUserProfile: async (req, res, next) => {
    // Getting auth header
    const headerAuth = req.headers['authorization'];
    const userId = jwtUtils.getUserId(headerAuth);
    const userCibleId = req.params.userId

    //Params
    const firstName = req.body.first_name;
    const lastName = req.body.last_name;
    let avatarUrl
    console.log("req.body est : ",req.body ,"req.file est : ", req.file)


    try {

      // user
      const userFound = await db.User.findOne({
        where: { id: userId }
      })
      if (userFound) {


        // on cherche l'utilisateur ciblé
        const userCible = await db.User.findOne({
          where: { id: userCibleId }
        })
        if (userCible) {

          //légitimité
          if (userCible.id == userId || userFound.isAdmin) {

            // si y a file image
            if(req.file) {

                const updateProfil = await userCible.update({
                  first_name: (firstName ? firstName : userCible.first_name),
                  last_name: (lastName ? lastName : userCible.last_name),
                  avatarUrl: (req.file.path ? `${req.protocol}://${req.get('host')}/images/static/assets/photos/${req.file.filename}` : userCible.avatarUrl)
                })
                if (updateProfil) {
                    res.locals.updateProfil = updateProfil
                    next()
                    //return res.status(201).json(updateProfil)
                }

            // sans file image
            } else {
                // si avatar sélectionné
                if(req.body.avatarUrl != 'http://localhost:3000/images/static/avatar/avatar.png'){
                    const updateProfil = await userCible.update({
                      first_name: (firstName ? firstName : userCible.first_name),
                      last_name: (lastName ? lastName : userCible.last_name),
                      avatarUrl: (req.body.avatarUrl ? req.body.avatarUrl : userCible.avatarUrl)
                    })
                    if (updateProfil) {
                        res.locals.updateProfil = updateProfil
                        next()
                        //return res.status(201).json(updateProfil)
                    }
                
                // sans avatar ni image
                } else  {
                    const updateProfil = await userCible.update({
                      first_name: (firstName ? firstName : userCible.first_name),
                      last_name: (lastName ? lastName : userCible.last_name),
                    })
                    if (updateProfil) {
                      res.locals.updateProfil = updateProfil
                      next()
                      //return res.status(201).json(updateProfil)
                    }
                } 
            }
            
          } else {
            return res.status(404).json({ 'error': 'no authorized, modifier votre propre profil ou augmenter vos privilège' })
          }
        } else {
          res.status(404).json({ 'error': 'user not found' });
        }
      } else {
        return res.status(404).json({ 'error': 'user not found' })
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

    try {

      //user
      const userFound = await db.User.findOne({
        where: { id: userId }
      })
      if (userFound) {


        // on cherche l'utilisateur ciblé
        const userTargetFound = await db.User.findOne({
          where: { id: req.params.userId }
        })
        if (userTargetFound) {

          if (userId === userTargetFound.id || userFound.isAdmin) {

            // on cherche les likes de l'user sur tout les posts
            const likesFound = await db.Like.findAll({
              where: { userId: userTargetFound.id }
            })

            //tout les likes qui m'appartiennent
            if (likesFound) {

              for (like of likesFound) {
                console.log("un like", like)

                //récupère post du like
                const postOuYAvaitLeLike = await db.Post.findOne({
                  where: {
                    id: like.PostId
                  }
                })

                if (postOuYAvaitLeLike) {

                  ////update post
                  //const updateLikePost = await postOuYAvaitLeLike.update({
                  //  likes: postOuYAvaitLeLike.likes = postOuYAvaitLeLike.likes - 1
                  //})

                  //destroy like
                  const destroyLikes = await like.destroy({
                    where: { UserId: userTargetFound.id }
                  })
                }
              }
            }




            // on cherche les comments
            const commentsFound = await db.Comment.findAll({
              where: { userId: userTargetFound.id }
            })

            if (commentsFound) {
              console.log("commentsFound : ", commentsFound)

              for (comment of commentsFound) {
                console.log("un comment", comment)

                // pour chaque commentaire on cherche le post ou y a le comment
                const postOuYAvaitLeComment = await db.Post.findOne({
                  where: {
                    id: comment.PostId
                  }
                })
                console.log("postOuYAvaitLeComment  ", postOuYAvaitLeComment)

                // update le post
                //const updateCommentPost = await postOuYAvaitLeComment.update({
                //  comments: postOuYAvaitLeComment.comments = postOuYAvaitLeComment.comments - 1
                //})


                //destroy comments
                const destroyComments = await db.Comment.destroy({
                  where: { id: comment.id }
                })
              }
            }



            




            // on cherche les images
            const imageFound = await db.Image.findAll({
              where: { userId: userTargetFound.id }
            })
            if (imageFound) {
              console.log( 'images found : ',imageFound)
                // supprime les images
                for ( image in imageFound) {
                  
                  if (`${imageFound[image].url}` != null) {
                    fs.unlink(`${imageFound[image].url}`, (err) => {
                      if (err) {
                        console.error(err)
                      } else {
                        console.log('image ' + `${imageFound[image].name}` + ' supprimé')
                      }
                    })
                  }
                }
                // on supprime l'image de la database
              const destroyImage = await db.Image.destroy({
                where: { userId: userTargetFound.id }
              })
            }
              
            
            // on cherche l'avatar
            const avatarFound = await db.Photo.findOne({
              where: { userId: userTargetFound.id }
            })
            if (avatarFound) {
              console.log('avavar found : ', avatarFound)

              // supprime l'avatar
              fs.unlink(`${avatarFound.url}`, (err) => {
                if (err) {
                  console.error(err)
                } else {
                  console.log('image ' + avatarFound.name + ' supprimé')
                }
              })
                
              // on supprime l'avatar de la database
              const destroyAvatar = await db.Photo.destroy({
                where: { userId: userTargetFound.id }
              })
            }





            // on cherche les posts

            const postsFound = await db.Post.findAll({
              where: { userId: userTargetFound.id },
            })

            if (postsFound) {
              console.log("postsfound lenght", postsFound.length)

              // pour chaque post 
              for (post of postsFound) {
                //console.log('un post', post)



                // on récupère tout les commentaires
                const commentsFromOtherFound = await db.Comment.findAll({
                  where: { PostId: post.id }
                })
                // on supprime tout les commentaires des posts
                if (commentsFromOtherFound != null) {

                  const destroyCommentsOfOthersUsers = await db.Comment.destroy({
                    where: { PostId: post.id }
                  })
                }



                //mtn on cherche les likes des autres gugus
                const likesFromOtherFound = await db.Like.findAll({
                  where: { postId: post.id }
                })
                //on les supprimes
                if (likesFromOtherFound != null) {
                  const destroyLikesFromOtherUsers = await db.Like.destroy({
                    where: { postId: post.id }
                  })
                }



                // on supprime enfin le post
                const destroyPosts = await db.Post.destroy({
                  where: { id: post.id }
                })
                if (destroyPosts) {

                }
              }
            }






            // on supprimer l'utilisateur snif
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


      } else {
        return res.status(404).json({ 'error': 'user not found' })
      }


    }
    catch (err) {
      console.error(err)
    };
  }


};