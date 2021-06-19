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

        // on vérifie s'il y a une image
        if (req.file == undefined) {
          console.log("pas d'image dans la requete");
          next();

        } else {

          console.log('là ca marche')
          
          // créé l'image dans la bdd
          const createImage = await db.Image.create({
            type: req.file.mimetype,
            name: req.file.originalname,
            data: fs.readFileSync(__basedir + '/resources/static/assets/uploads/' + req.file.filename),
            UserId: userFound.id,
            // PostId: 
          })

          if (createImage) {
            console.log(createImage);
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










  //update: async (req, res, next) => {
//
  //  // Getting auth header
  //  var headerAuth = req.headers['authorization'];
  //  var userId = jwtUtils.getUserId(headerAuth);
//
  //  try {
  //    // récupère l'user
  //    const userFound = await db.User.findOne({
  //      where: { id: userId }
  //    })
  //    if (userFound) {
//
  //      // on vérifie s'il y a une image
  //      if (req.file == undefined) {
  //        console.log("pas d'image dans la requete");
  //        next();
//
  //      } else {
//
  //        // supprime ancienne image
  //        // récupère l'ancienne image
  //        console.log(req.file)
//
  //        // upload l'image dans la bdd
  //        const updateImage = await db.Image.update({
  //          type: req.file.mimetype? type : type,
  //          name: req.file.originalname? req.file.originalname: req.file.originalname,
  //          data: fs.readFileSync(__basedir + '/resources/static/assets/uploads/' + req.file.filename) ? fs.readFileSync(__basedir + '/resources/static/assets/uploads/' + req.file.filename) : fs.readFileSync(__basedir + '/resources/static/assets/uploads/' + req.file.filename),
  //        })
//
  //        if (updateImage)
  //        
  //          fs.writeFileSync(__basedir + '/resources/static/assets/tmp/' + updateImage.name, updateImage.data);
//
  //        next();
//
  //      }
  //    } else {
  //      return res.status(404).json({ 'error': 'user not found' });
  //    }
  //  }
  //  catch (err) {
  //    console.error(err)
  //  }
  //}
}
