// Imports
const db = require('../models');
var jwtUtils = require('../utils/jwt.utils');

const upload = require('../config/upload.config.js');

// Routes
module.exports = {
    createPost: function (req, res) {

        // Getting auth header
        var headerAuth = req.headers['authorization'];
        var userId = jwtUtils.getUserId(headerAuth);

        // Params
        var title = req.body.title;
        var description = req.body.description;
        var img_url;

        if (req.file == undefined) {
        } else {
            img_url = req.file.path
        }

        if (title == null || description == null) {
            return res.status(400).json({ 'error': 'missing parameters' });
        }
        if (title.length <= 2 || description.length <= 4) {
            return res.status(400).json({ 'error': 'titre ou description trop cour' });
        }

        // récupère l'user
        db.User.findOne({
            where: { id: userId }
        })
            .then(function (userFound) {
                if (userFound) {

                    console.log(userFound);
                    // on créé le post
                    db.Post.create({
                        title, title,
                        img_url: img_url,
                        description: description,
                        like: 0,
                        UserId: userFound.id,
                        first_name: userFound.first_name,
                        
                    })
                        .then(function (newPost) {
                            if (newPost) {

                                return res.status(201).json(newPost);

                            } else {
                                return res.status(500).json({ 'error': 'cannot create post' })
                            }
                        })
                        .catch(function (err) {
                            return res.status(404).json(err)
                        })
                } else {
                    return res.status(404).json({ 'error': 'user not found' });
                }
            })
            .catch(function (err) {
                return res.status(500).json({ 'error': 'unable to verify user' });
            });
    },



 //return Product.create({
 //    title: 'Chair',
 //    user: {
 //      firstName: 'Mick',
 //      lastName: 'Broadstone',
 //      addresses: [{
 //        type: 'home',
 //        line1: '100 Main St.',
 //        city: 'Austin',
 //        state: 'TX',
 //        zip: '78704'
 //      }]
 //    }
 //  }, {
 //    include: [{
 //      association: Product.User,
 //      include: [ User.Addresses ]
 //    }]
 //  });






    listPosts: function (req, res) {

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

                    // récupère tout le sposts
                    db.Post.findAll({
                        order: [(order != null) ? order.split(':') : ['title', 'ASC']],
                        attributes: (fields !== '*' && fields != null) ? fields.split(',') : null,
                        limit: (!isNaN(limit)) ? limit : null,
                        offset: (!isNaN(offset)) ? offset : null,
                        
                    }).then(function (posts) {
                        if (posts) {
                            res.status(200).json(posts);
                        } else {
                            res.status(404).json({ "error": "no post fund" });
                        }
                    }).catch(function (err) {
                        res.status(500).json({ 'error': 'invalide fields' });
                    });
                } else {
                    return res.status(404).json({ 'error': 'user not found' });
                }
            })
            .catch(function (err) {
                return res.status(500).json({ 'error': 'unable to verify user' });
            });
    },










    selectOnePost: function (req, res) {

        // Getting auth header
        var headerAuth = req.headers['authorization'];
        var userId = jwtUtils.getUserId(headerAuth);

        // récupère l'user
        db.User.findOne({
            where: { id: userId }
        })
            .then(function (userFound) {
                if (userFound) {


                    // récupère le post
                    db.Post.findOne({
                        attributes: ['title', 'img_url', 'description', 'userId', 'createdAt', 'updatedAt', 'like'],
                        where: { id: req.params.postId }
                    })
                        .then(function (post) {
                            if (post) {

                                // récup les commentaires
                                db.Comment.findAll(
                                )
                                    .then(function(commentsFound){
                                    if(commentsFound) {

                                
                                        res.status(200).json({'post':post, 'comments':commentsFound});
                                    } else {
                                        res.status(404).json({error: "Comments not found"})
                                    }
                                })
                            } else {
                                res.status(404).json({ "error": "no post fund" });
                            }
                        }).catch(function (err) {
                            console.log(err);
                            res.status(500).json({ 'error': 'invalide fields' });
                        });
                } else {
                    return res.status(404).json({ 'error': 'user not found' });
                }
            })
            .catch(function (err) {
                return res.status(500).json({ 'error': 'unable to verify user' });
            });

    },








    updateOnePost: function (req, res) {

        // Getting auth header
        var headerAuth = req.headers['authorization'];
        var userId = jwtUtils.getUserId(headerAuth);
        var postId = JSON.parse(req.params.postId);

        //Params
        var title = req.body.title;
        var img_url;
        var description = req.body.description;

        if (req.file == undefined) {

        } else {
            img_url = req.file.path
        }

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

                            // on verifie que la post a été créé par le proprio
                            if (userId == postFound.UserId || userFound.isAdmin == true) {

                                // update post
                                postFound.update({
                                    title: (title ? title : title),
                                    img_url: (img_url ? img_url : img_url),
                                    description: (description ? description : description)
                                })
                                    .then(function () {
                                        res.status(201).json(postFound);
                                    })
                                    .catch(function (err) {
                                        res.status(500).json({ 'error': 'cannot update user' });
                                    });
                            } else {
                                return res.status(201).json({ 'error': 'non autorisé' })
                            }
                        })
                        .catch(function (err) {
                            res.status(404).json({ 'error': 'post not found' })
                        })
                } else {
                    res.status(404).json({ 'error': 'user not found' });
                }
            }).catch(function (err) {
                return res.status(500).json({ 'error': 'unable to verify ussssser' });
            });
    },





    removeOnePost: function (req, res) {

        // Getting auth header
        var headerAuth = req.headers['authorization'];
        var userId = jwtUtils.getUserId(headerAuth);
        var postId = req.params.postId;



        // on cherche l'utilisateur
        db.User.findOne({
            where: { id: userId }
        })
            .then(function (userFound) {
                if (userFound) {

                    // on cherche le post
                    db.Post.findOne({
                        where: { id: req.params.postId }
                    })
                        .then(function (postFound) {
                            if (postFound && !undefined) {

                                // on verifie la légitimité
                                if (postFound.UserId == userFound.id || userFound.isAdmin == true) {


                                    // on les supprimes les commentaires
                                    db.Comment.destroy({
                                        where: { postId: postId }
                                    })
                                        .then(function (allCommentsDestroy) {
                                            res.status(202).json({ 'message': 'All comments from post deleted' })
                                        })
                                        .catch(function (error) {
                                            res.status(500).json({ 'error': 'cannot destroy post' });
                                        });




                                    // on les supprimes les like
                                    db.Like.destroy({
                                        where: { postId: postId }
                                    })
                                        .then(function (allLikesDestroy) {
                                            res.status(202).json({ 'message': 'All likes from post deleted' })
                                        })
                                        .catch(function (error) {
                                            res.status(500).json({ 'error': 'cannot destroy post' });
                                        });




                                    // on les supprimes l'image'
                                    db.Image.destroy({
                                        where: { postId: postId }
                                    })
                                        .then(function (allLikesDestroy) {
                                            res.status(202).json({ 'message': 'All likes from post deleted' })
                                        })
                                        .catch(function (error) {
                                            res.status(500).json({ 'error': 'cannot destroy post' });
                                        });


                                    // on supprime l'image du disque 












                                    // Supprime le post
                                    db.Post.destroy({
                                        where: { id: postId }
                                    })
                                        .then(function () {
                                            res.status(201).json({ 'message': 'Post  deleted' })    //' + req.params.postId + '
                                        })
                                        .catch(function (err) {
                                            res.status(500).json({ 'error': 'cannot update user' });
                                        });



                                } else {
                                    return res.status(404).json({ 'error': 'no permission' });
                                }

                            } else {
                                return res.status(404).json({ 'error': 'post not found' });
                            }
                        }).catch(function (err) {
                            return res.status(500).json({ 'error': 'unable to verify post' });
                        });
                } else {
                    return res.status(404).json({ 'error': 'user not found' });
                }
            })
            .catch(function (err) {
                return res.status(404).json({ 'error': 'unable to verify user' });
            });











    }


}




