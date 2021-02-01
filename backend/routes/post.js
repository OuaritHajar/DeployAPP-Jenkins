// Imports
const express = require('express');
const router = express.Router();

const postsCtrl = require('../controllers/post');
const commentCtrl = require('../controllers/comment');
const likesCtrl = require('../controllers/like');

// Multer
const upload = require('../config/upload.config.js');
const fileWorker = require('../controllers/upload.controller.js');

// Posts routes
router.post('/', upload.single("img_url"), fileWorker.upload, postsCtrl.createPost);
router.get('/', postsCtrl.listPosts);
router.get('/:postId', postsCtrl.selectOnePost);
router.put('/:postId',upload.single("img_url"),  fileWorker.update, postsCtrl.updateOnePost);
router.delete('/:postId', postsCtrl.removeOnePost);

// Comment routes
router.post('/:postId/comment', commentCtrl.createComment);
router.get('/:postId/comments', commentCtrl.listPostComments);
router.put('/:postId/comment/:commentId', commentCtrl.updateOneComment);
router.delete('/:postId/comments/:commentId', commentCtrl.deleteOneComment);

// Like routes
router.post('/:postId/like', likesCtrl.likePost);
router.post('/:postId/removelike', likesCtrl.removeLike);

module.exports = router;