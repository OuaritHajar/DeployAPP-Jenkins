const multer = require('multer');
 
const storagePhoto = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, __basedir + '/resources/static/assets/photos/')
  },
  filename: (req, file, cb) => {
    cb(null, file.fieldname + "-" + Date.now() + "-" + file.originalname)
  }
});

const uploadPhoto = multer({storage : storagePhoto})
 
module.exports = uploadPhoto;