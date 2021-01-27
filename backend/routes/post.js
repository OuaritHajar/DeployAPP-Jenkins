// Imports
const express = require('express');
const router = express.Router();

const postsCtrl = require('../controllers/post');
const commentCtrl = require('../controllers/comment');
const likesCtrl = require('../controllers/like');

// Posts routes
router.post('/newpost', postsCtrl.createPost);
router.get('/allposts', postsCtrl.listPosts);
router.get('/:postId', postsCtrl.selectOnePost);
router.put('/:postId/updatepost', postsCtrl.updateOnePost);
router.delete('/:postId/delete', postsCtrl.removeOnePost);

// Comment routes
router.post('/:postId/newcomment', commentCtrl.createComment);
router.get('/:postId/postcomments', commentCtrl.listPostComments);
router.put('/:postId/:commentId', commentCtrl.updateOneComment);
router.delete('/:postId/:commentId/delete', commentCtrl.deleteOneComment)

// Like routes
router.post('/:postId/like', likesCtrl.likePost);

module.exports = router;