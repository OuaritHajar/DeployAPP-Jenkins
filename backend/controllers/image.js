const fs = require('fs');
const { type } = require('os');
//const Image = require('../config/db.config.js').images;
const db = require('../models');
var jwtUtils = require('../utils/jwt.utils');

// Upload a Multipart-File then saving it to MySQL database
module.exports = {

  upload: async (req, res) => {

    // Getting auth header
    var headerAuth = req.headers['authorization'];
    var userId = jwtUtils.getUserId(headerAuth);

    console.log("response locale : ",res.locals.newPost.dataValues)

    try {
      // récupère l'user
      const userFound = await db.User.findOne({
        where: { id: userId }
      })
      if (userFound) {

        //on vérifie s'il y a une image
        if (req.file == undefined) {
          console.log("pas d'image dans la requete")
          const createImageVide = await db.Image.create({
            type: '',
            name: 'no image',
            data: '',
            url: null,
            UserId: userFound.id,
            PostId: res.locals.newPost.dataValues.id

          })
          if(createImageVide) {
            return res.status(200).json(res.locals.newPost.dataValues);
          }
        } else {
          console.log("image dans la requete")
        // créé l'image dans la bdd
          const createImage = await db.Image.create({
            type: req.file.mimetype,
            name: req.file.originalname,
            data: fs.readFileSync(__basedir + '/resources/static/assets/uploads/' + req.file.filename),
            url: req.file.path,
            UserId: userFound.id,
            PostId: res.locals.newPost.dataValues.id 
          })
          if (createImage) {
            fs.writeFileSync(__basedir + '/resources/static/assets/tmp/' + createImage.name, createImage.data);
  
            return res.status(200).json(res.locals.newPost.dataValues);
          }
        }
      } else {
        return res.status(404).json({ 'error': 'user not found' });
      }
     
    } catch (err) {
      console.error(err)
    };
  },

  update: async (req, res) => {

    // Getting auth header
    var headerAuth = req.headers['authorization'];
    var userId = jwtUtils.getUserId(headerAuth);
    const postId = req.params.postId;

    console.log("response local update : ",res.locals.postUpdate)
    
    
    try {
      // récupère l'user
      const userFound = await db.User.findOne({
        where: { id: userId }
      })
      if (userFound) {

        // récupère le post
        const postFound = await db.Post.findOne({
          where: { id: postId }
        })
        if (postFound) {
            
            // on vérifie s'il y a une image dans la requete
            if (req.file == null) {
              console.log("pas d'image dans la requete");
              return res.status(201).json(res.locals.postUpdate);



            // image dans la requete
            } else {
              // vérifie si il y a déjà une image
              const imageFound = await db.Image.findOne({
                where: {postId: postId}
              })
              if(imageFound.url != null) {

                  
                    // supprime ancienne image
                      fs.unlink(imageFound.url,(err) =>{
                        if (err) {
                          console.error(err)
                        } else {
                          console.log('image supprimé')
                        }
                      })
                  

                  // update image dans la bdd
                  const updateImage = await imageFound.update({              
                    type: (req.file.mimetype? req.file.mimetype : imageFound.mimetype) ,
                    name: (req.file.originalname? req.file.originalname : imageFound.originalname) ,
                    data: (req.body.data ? fs.readFileSync(__basedir + '/resources/static/assets/uploads/' + req.file.filename) : imageFound.data),
                    url: (req.file.path? req.file.path : imageFound.path),
                    UserId: userFound.id,
                  })
                  if (updateImage) {
                    return res.status(201).json(res.locals.postUpdate);
                  }

              } else {
                console.log('Created new image')
                // update image dans la bdd
                const updateImage = await imageFound.update({              
                  type: (req.file.mimetype? req.file.mimetype : imageFound.mimetype) ,
                  name: (req.file.originalname? req.file.originalname : imageFound.originalname) ,
                  data: (req.body.data ? fs.readFileSync(__basedir + '/resources/static/assets/uploads/' + req.file.filename) : imageFound.data),
                  url: (req.file.path? req.file.path : imageFound.path),
                  
                })

                if (updateImage) {
                  return res.status(201).json(res.locals.postUpdate);
                  
                }
              }
            }
        } else {
          return res.status(404).json({ 'error': 'post not found' });
        }
      } else {
        return res.status(404).json({ 'error': 'user not found' });
      }
    }
    catch (err) {
      console.error(err)
    }
  },


  
  updatePhoto: async (req, res) => {

    // Getting auth header
    var headerAuth = req.headers['authorization'];
    var userId = jwtUtils.getUserId(headerAuth);
    const userCibleId = req.params.userId;
    console.log("response local update profil : ",res.locals.updateProfil)

    //console.log("response local update : ",res.locals.postUpdate)
    
    try {
      // récupère l'user
      const userFound = await db.User.findOne({
        where: { id: userId }
      })
      if (userFound) {

        // récupère l'user cible
        const userCibleFound = await db.User.findOne({
          where: { id: userCibleId }
        })
        if (userCibleFound) {
            
            // on vérifie s'il y a une image dans la requete
            if (req.file == null) {
              console.log("pas d'image dans la requete");
              return res.status(201).json(res.locals.updateProfil);


            // image dans la requete
            } else {
              // vérifie si il y a déjà une image
              const photoFound = await db.Photo.findOne({
                where: {userId : userCibleId}
              })
              if(photoFound) {

                  
                    // supprime ancienne image
                      fs.unlink(photoFound.url,(err) =>{
                        if (err) {
                          console.error(err)
                        } else {
                          console.log('ancienne photo supprimé si existe')
                        }
                      })
                  

                  // update image dans la bdd
                  const updatePhoto = await photoFound.update({              
                    type: (req.file.mimetype? req.file.mimetype : photoFound.mimetype) ,
                    name: (req.file.originalname? req.file.originalname : photoFound.originalname) ,
                    data: (req.body.data ? fs.readFileSync(__basedir + '/resources/static/assets/photos/' + req.file.filename) : photoFound.data),
                    url:  (req.file.path? req.file.path : photoFound.path)
                  })
                  if (updatePhoto) {
                    return res.status(201).json(res.locals.updateProfil);
                  }

              } else {
                console.log('Created new photo')
                // update image dans la bdd
                const createPhoto = await db.Photo.create({

                  type: req.file.mimetype,
                  name: req.file.originalname,
                  data: fs.readFileSync(__basedir + '/resources/static/assets/photos/' + req.file.filename),
                  url:  req.file.path,
                  UserId: userCibleId
                })

                if (createPhoto) {
                  return res.status(201).json(res.locals.updateProfil);
                  
                }
              }
            }
        } else {
          return res.status(404).json({ 'error': 'post not found' });
        }
      } else {
        return res.status(404).json({ 'error': 'user not found' });
      }
    }
    catch (err) {
      console.error(err)
    }
  }





  
}
