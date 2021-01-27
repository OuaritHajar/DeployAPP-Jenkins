// Imports
const express = require('express');
const router = express.Router();

const postsCtrl = require('../controllers/post');
const commentCtrl = require('../controllers/comment');

// Posts routes
router.post('/newpost', postsCtrl.createPost);
router.get('/allposts', postsCtrl.listPosts);
router.get('/:id', postsCtrl.selectOnePost);

// Comment routes
router.post('/:id/newcomment', commentCtrl.createComment);
router.get('/:id/postcomments', commentCtrl.listPostComments);

module.exports = router;