// Imports
const db = require('../models');
var jwtUtils = require('../utils/jwt.utils');

// Routes
module.exports = {
    likePost: function (req, res) {

        // Getting auth header
        var headerAuth = req.headers['authorization'];
        var userId = jwtUtils.getUserId(headerAuth);
        var postId = parseInt(req.params.postId);
        console.log(postId);

        // condition
        if (postId <= 0) {
            return res.status(400).json({ 'error': 'invalid parameters' });
        }

        // récupère le post
        db.Post.findOne({
            where: { id: postId }
        })
        .then(function (postFound) {
            if (postFound) {

                // récupère l'utilisateur
                db.User.findOne({
                    where: { id: userId }
                })
                .then(function (userFound) {
                    if (userFound) {
                        
                        // vérifie si l'user a déja like
                        db.Like.findOne({
                            where: {
                                userId: userId,
                                postId: postId
                            }
                        })
                        .then(function(isUserAlreadyLiked) {
                            if(!isUserAlreadyLiked) {

                                // truc un peu chelou ici
                                postFound.addUser(userFound)
                                .then(function(alreadyLikeFound) {

                                    // update du like
                                    postFound.update({
                                        like: postFound.like + 1,
                                    })
                                    .then(function() {
                                      return res.status(201).json(postFound);
                                        
                                    })
                                    .catch(function(err) {
                                         res.status(500).json({'error': 'cannot update post like counter'});
                                    });
                                })
                                .catch(function(err) {
                                     res.status(500).json({'error': 'unable to set user reaction'});
                                });
                            } else {
                                res.status(409).json({'error':' le post a déja été liké'});
                            }                                       
                        })
                        .catch(function(err) {
                             res.status(500).json({'error': 'unable to verify is user already liked'});
                        });
                    } else {
                        return res.status(404).json({ 'error': 'user not exist' });
                    }
                })
                .catch(function (err) {
                     res.status(500).json({ 'error': 'unable to verify user' });
                })
            } else {
                return res.status(404).json({ 'error': 'cannot found post' })
            }
        })
        .catch(function (err) {
             res.status(404).json(err);
        });
        }
    }