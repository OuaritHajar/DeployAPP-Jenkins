// Imports
const db = require('../models');
var jwtUtils = require('../utils/jwt.utils');

// Routes
module.exports = {
    createComment: function (req, res) {

        // Getting auth header
        var headerAuth = req.headers['authorization'];
        var userId = jwtUtils.getUserId(headerAuth);

        // Params
        var description = req.body.description;

        // condition
        if (description == null) {
            return res.status(400).json({ 'error': 'missing parameters' });
        }
        if (description.length <= 4) {
            return res.status(400).json({ 'error': 'titre ou description trop cour' });
        }

        // récupère l'user
        db.User.findOne({
            where: { id: userId }
        })
            .then(function (userFound) {
                if (userFound) {

                    // récupère le post
                    db.Post.findOne({
                        where: { id: req.params.postId }
                    })
                        .then(function (postFound) {
                            if (postFound) {

                                // créer le commentaire
                                db.Comment.create({
                                    description: description,
                                    PostId: postFound.id,
                                    UserId: userFound.id,
                                })
                                    .then(function (newComment) {
                                        if (newComment) {

                                            // met a jour le compteur de commentaire
                                            postFound.comments++;

                                            postFound.update()
                                            .then(function(){

                                                // renvoie le nouveau commentaire
                                            return res.status(201).json(newComment);




                                            }).catch(function(err) {
                                                return res.status(500).json({error: 'cannot update count comment'})
                                            })

                                        } else {
                                            return res.status(500).json({ 'error': 'cannot create comment' })
                                        }
                                    })
                                    .catch(function (err) {
                                        return res.status(404).json(err)
                                    })
                            } else {
                                return res.status(500).json({ 'error': 'cannot found post' })
                            }
                        })
                        .catch(function (err) {
                            return res.status(404).json(err)
                        })
                } else {
                    res.status(404).json({ 'error': 'user not found' });
                }
            })
            .catch(function (err) {
                return res.status(500).json({ 'error': 'unable to verify user' });
            });
    },




    listPostComments: function (req, res) {

        // Getting auth header
        var headerAuth = req.headers['authorization'];
        var userId = jwtUtils.getUserId(headerAuth);

        // Params
        var ITEMS_LIMIT = 10;
        var fields = req.query.fields;
        var limit = parseInt(req.query.limit);
        var offset = parseInt(req.query.offset);
        var order = req.query.order;

        if (limit > ITEMS_LIMIT) {
            limit = ITEMS_LIMIT;
        }

        // récupère l'user
        db.User.findOne({
            where: { id: userId }
        })
            .then(function (userFound) {
                if (userFound) {

                    // récupère le post
                    db.Post.findOne({
                        where: { id: req.params.postId }
                    })
                        .then(function (postFound) {
                            if (postFound) {

                                // récupère les commentaires
                                db.Comment.findAll()
                                    .then(function (postComments) {
                                        if (postComments) {





                                            // renvoie tout les commentaires d'un 
                                            return res.status(201).json(postComments);

                                            // pagination




                                        } else {
                                            return res.status(500).json({ 'error': 'cannot find all comments' })
                                        }
                                    })
                                    .catch(function (err) {
                                        return res.status(404).json(err)
                                    })
                            } else {
                                return res.status(500).json({ 'error': 'cannot found post' })
                            }
                        })
                        .catch(function (err) {
                            return res.status(404).json(err)
                        })
                } else {
                    res.status(404).json({ 'error': 'user not found' });
                }
            })
            .catch(function (err) {
                return res.status(500).json({ 'error': 'unable to verify user' });
            });
    },







    updateOneComment: function (req, res) {

        // Getting auth header
        var headerAuth = req.headers['authorization'];
        var userId = jwtUtils.getUserId(headerAuth);
        var postId = JSON.parse(req.params.postId);
        var commentId = JSON.parse(req.params.commentId);

        //Params
        var description = req.body.description;

        // on cherche l'utilisateur
        db.User.findOne({
            where: { id: userId }
        })
            .then(function (userFound) {
                if (userFound) {

                    // on cherche le post souhaiter dans la requete
                    db.Post.findOne({
                        where: { id: postId }
                    })
                        .then(function (postFound) {
                            if (postFound) {

                                // on cherche le comment souhaiter dans la requete
                                db.Comment.findOne({
                                    where: { id: commentId }
                                })
                                    .then(function (commentFound) {
                                        if (commentFound) {

                                            // on verifie que la comment a été créé par le proprio ou que l'user est admin
                                            if (commentFound.UserId == userFound.id || userFound.isAdmin == true) {

                                                //update
                                                commentFound.update({
                                                    description: (description ? description : description)
                                                })
                                                    .then(function () {
                                                        res.status(201).json(commentFound);
                                                    })
                                                    .catch(function (err) {
                                                        res.status(500).json({ 'error': 'cannot update commentaire' });
                                                    });
                                            } else {
                                                return res.status(201).json({ 'error': 'non autorisé' })
                                            }
                                        } else {
                                            return res.status(404).json({ 'error': 'comment not found' })
                                        }
                                    })
                                    .catch(function (err) {
                                        res.status(404).json({ 'error': 'comment not found' })
                                    })
                            } else {
                                return res.status(404).json({ 'error': 'post not found' })
                            }
                        })
                        .catch(function (err) {
                            res.status(404).json({ 'error': 'post not found' })
                        })
                } else {
                    res.status(404).json({ 'error': 'user not found' });
                }
            }).catch(function (err) {
                return res.status(500).json({ 'error': 'unable to verify user' });
            });
    },


    deleteOneComment: function (req, res) {

        // Getting auth header
        var headerAuth = req.headers['authorization'];
        var userId = jwtUtils.getUserId(headerAuth);
        var postId = req.params.postId
        var commentId = req.params.commentId;




        // on cherche l'utilisateur
        db.User.findOne({
            where: { id: userId }
        })
            .then(function (userFound) {
                if (userFound) {

                    // on cherche le post
                    db.Post.findOne({
                        where: { id: postId }
                    })
                        .then(function (postFound) {
                            if (postFound) {

                                // on cherche le commentaire
                                db.Comment.findOne({
                                    where: { id: commentId }
                                })
                                    .then(function (commentFound) {
                                        if (commentFound) {

                                            // on vverifie que le commentaire appartient à l'user
                                            if (commentFound.UserId == userFound.id || userFound.isAdmin == true) {

                                                //delete
                                                db.Comment.destroy({
                                                    where: { id: commentId }
                                                })
                                                    .then(function () {
                                                        res.status(201).json({ 'message': 'commentaire deleted' })
                                                    })
                                                    .catch(function (err) {
                                                        res.status(500).json({ 'error': 'cannot update user' });
                                                    });
                                            } else {
                                                return res.status(404).json({ 'error': 'no permission' });
                                            }
                                        } else {
                                            res.status(404).json({ 'error': 'comment not found' })
                                        }
                                    }).catch(function(error) {
                                        return res.status(404),json({'error': 'cannot found comment'})
                                    });
                                 } else {
                                return res.status(404).json({ 'error': 'post not found' });
                            }
                        }).catch(function (err) {
                            return res.status(500).json({ 'error': 'unable to verify post' });
                        });
                } else {
                    return res.status(404).json({ 'error': 'user not found' })
                }
            })
            .catch(function (err) {
                return res.status(404).json({ 'error': 'unable to verify user' });
            }
        );
    }


}