const fs = require('fs');
const db = require('../config/db.config.js');
const Image = db.images;
const models = require('../models');
var jwtUtils = require('../utils/jwt.utils');

// Upload a Multipart-File then saving it to MySQL database
module.exports = {
  upload: function (req, res, next) {

    // Getting auth header
    var headerAuth = req.headers['authorization'];
    var userId = jwtUtils.getUserId(headerAuth);

    // récupère l'user
    models.User.findOne({
      where: { id: userId }
    })
      .then(function (userFound) {
        if (userFound) {

          // on vérifie s'il y a une image
          if (req.file == undefined) {
            console.log("pas d'image dans la requete");
            next();

          } else {

            // créé l'image dans la bdd
            Image.create({
              type: req.file.mimetype,
              name: req.file.originalname,
              data: fs.readFileSync(__basedir + '/resources/static/assets/uploads/' + req.file.filename)

            }).then(image => {

              try {

                fs.writeFileSync(__basedir + '/resources/static/assets/tmp/' + image.name, image.data);

                //models.Image.findOne({
                //  where: { id: image.id }
                //})
                //  .then(function (imageFound) {
                //    if(imageFound) console.log('youpi');
                //    // update image
                //    imageFound.update({
                //      UserId: (userId ? userId : userId),
                //      PostId: (postId ? postId : postId)
                //    })
                //      .then(function () {
                //        res.status(201).json(imageFound);
                //      })
                //      .catch(function (err) {
                //        res.status(500).json({ 'error': 'cannot update image' });
                //      });
                //
                //
                //  }).catch(function (err) {
                //    res.status(404).json({ 'error': 'Image not found' })
                //  })

                next();

              } catch (e) {
                console.log(e);
                res.json({ 'err': e });
              }
            })
          }
        } else {
          return res.status(404).json({ 'error': 'user not found' });
        }
      })
      .catch(function (err) {
        return res.status(500).json({ 'error': 'unable to verify user' });
      });
  },










  update: function (req, res, next) {

    // Getting auth header
    var headerAuth = req.headers['authorization'];
    var userId = jwtUtils.getUserId(headerAuth);



    // récupère l'user
    models.User.findOne({
      where: { id: userId }
    })
      .then(function (userFound) {
        if (userFound) {

          // on vérifie s'il y a une image
          if (req.file == undefined) {
            console.log("pas d'image dans la requete");
            next();

          } else {

            var type = req.file.mimetype;
            var name = req.file.originalname;
            var data = fs.readFileSync(__basedir + '/resources/static/assets/uploads/' + req.file.filename);

            // update l'image dans la bdd
            Image.upload({

              type: (type ? type : type),
              name: (name ? name : name),
              data: (data ? data : data)

            }).then(image => {

              try {

                fs.writeFileSync(__basedir + '/resources/static/assets/tmp/' + image.name, image.data);

                next();

              } catch (e) {
                console.log(e);
                res.json({ 'err': e });
              }
            })
          }
        } else {
          return res.status(404).json({ 'error': 'user not found' });
        }
      })
      .catch(function (err) {
        return res.status(500).json({ 'error': 'unable to verify user' });
      });


  }








}
