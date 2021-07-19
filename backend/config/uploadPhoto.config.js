const multer = require('multer');
 
var storagePhoto = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, __basedir + '/resources/static/assets/photos/')
  },
  filename: (req, file, cb) => {
    cb(null, file.fieldname + "-" + Date.now() + "-" + file.originalname)
  }
});

var uploadPhoto = multer({storage : storagePhoto})
 
module.exports = uploadPhoto;