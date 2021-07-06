// Imports
const express = require('express');
const router = express.Router();

const auth = require('../middleware/auth');

const postsCtrl = require('../controllers/post');
const commentCtrl = require('../controllers/comment');
const likesCtrl = require('../controllers/like');

// Multer
const upload = require('../config/upload.config.js');
const fileWorker = require('../controllers/image.js');

// Posts routes
router.post('/', upload.single("img_url"), fileWorker.upload, postsCtrl.createPost);
router.get('/', auth, postsCtrl.listPosts);
router.get('/:postId', auth, postsCtrl.selectOnePost);
router.put('/:postId', upload.single("img_url"), fileWorker.update, postsCtrl.updateOnePost);
router.delete('/:postId', postsCtrl.removeOnePost);

// Comment routes
router.post('/:postId/comment', auth, commentCtrl.createComment);
router.get('/:postId/comments', auth, commentCtrl.listPostComments);
router.put('/:postId/comment/:commentId', commentCtrl.updateOneComment);
router.delete('/:postId/comment/:commentId', commentCtrl.deleteOneComment);

// Like routes
router.post('/:postId/like', likesCtrl.likePost);
//router.post('/:postId/removelike', likesCtrl.removeLike);

module.exports = router;