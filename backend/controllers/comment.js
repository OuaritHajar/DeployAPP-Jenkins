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

                                            // renvoie le nouveau commentaire
                                            return res.status(201).json(newComment);
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
                                db.Comment.findAll({
                                    where: { postId: req.params.postId }
                                })
                                    .then(function (postComments) {
                                        if (postComments) {
                                            // renvoie tout les commentaires d'un 
                                            return res.status(201).json(postComments);
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

    }
}