// Imports
const express = require('express');
const router = express.Router();

const postsCtrl = require('../controllers/post');
const commentCtrl = require('../controllers/comment');

// Posts routes
router.post('/newpost', postsCtrl.createPost);
router.get('/allposts', postsCtrl.listPosts);
router.get('/:postId', postsCtrl.selectOnePost);

// Comment routes
router.post('/:postId/newcomment', commentCtrl.createComment);
router.get('/:postId/postcomments', commentCtrl.listPostComments);

module.exports = router;