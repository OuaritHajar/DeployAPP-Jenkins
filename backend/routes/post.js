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
router.post('/', auth, upload.single("img_url"),postsCtrl.createPost, fileWorker.upload);
router.get('/allPosts', auth, postsCtrl.postsNumber)
router.get('/', auth, postsCtrl.listPosts);
router.get('/:postId', auth, postsCtrl.selectOnePost);
router.put('/:postId', auth, upload.single("img_url"), postsCtrl.updateOnePost, fileWorker.update);
router.delete('/:postId', auth, postsCtrl.removeOnePost);

// Comment routes
router.post('/:postId/comment', auth, commentCtrl.createComment);
router.get('/:postId/comments', auth, commentCtrl.listPostComments);
router.put('/:postId/comment/:commentId', auth, commentCtrl.updateOneComment);
router.delete('/:postId/comment/:commentId', auth, commentCtrl.deleteOneComment);

// Like routes
router.post('/:postId/like', auth, likesCtrl.likePost);
router.get('/:postId/like', auth, likesCtrl.getUsersLiked);

module.exports = router;