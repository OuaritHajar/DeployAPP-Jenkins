module.exports = function(app){
    const upload = require('../config/upload.config.js');
    const fileWorker = require('../controllers/upload.controller.js');
    
    app.post('/api/posts/newpost/', upload.single("img_url"), fileWorker.upload);
  }