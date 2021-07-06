const fs = require('fs');
const { type } = require('os');
//const Image = require('../config/db.config.js').images;
const db = require('../models');
var jwtUtils = require('../utils/jwt.utils');

// Upload a Multipart-File then saving it to MySQL database
module.exports = {

  upload: async (req, res, next) => {

    // Getting auth header
    var headerAuth = req.headers['authorization'];
    var userId = jwtUtils.getUserId(headerAuth);

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
            // PostId: 

          })
          if(createImageVide) {
            next();
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
            // PostId: 
          })
          if (createImage) {
            fs.writeFileSync(__basedir + '/resources/static/assets/tmp/' + createImage.name, createImage.data);
  
            next();
          }
        }
      } else {
        return res.status(404).json({ 'error': 'user not found' });
      }
     
    } catch (err) {
      console.error(err)
    };
  },







  update: async (req, res, next) => {

    // Getting auth header
    var headerAuth = req.headers['authorization'];
    var userId = jwtUtils.getUserId(headerAuth);
    const postId = req.params.postId;
    
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
            if (req.file == undefined) {
              console.log("pas d'image dans la requete");
              next();



            // image dans la requete
            } else {
              // vérifie si il y a déjà une image
              const imageFound = await db.Image.findOne({
                where: {id: postId}
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
                    // PostId: 
                  })
                  if (updateImage) {
                    next()
                  }

              } else {
                console.log('Created new image')
                // update image dans la bdd
                const updateImage = await imageFound.update({              
                  type: (req.file.mimetype? req.file.mimetype : imageFound.mimetype) ,
                  name: (req.file.originalname? req.file.originalname : imageFound.originalname) ,
                  data: (req.body.data ? fs.readFileSync(__basedir + '/resources/static/assets/uploads/' + req.file.filename) : imageFound.data),
                  url: (req.file.path? req.file.path : imageFound.path),
                  UserId: userFound.id,
                  // PostId: 
                })

                if (updateImage) {
                  next()
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
