// Imports
const db = require('../models');
const jwtUtils = require('../utils/jwt.utils');

const upload = require('../config/upload.config.js');

// Routes
module.exports = {
    createPost: async function (req, res) {

        // Getting auth header
        const headerAuth = req.headers['authorization'];
        const userId = jwtUtils.getUserId(headerAuth);

        // Params
        const title = req.body.title;
        const description = req.body.description;
        var img_url;

        if (req.file === undefined) {} 
        else {
            img_url = req.file.path
        }
        if (title === null || description === null) {
            return res.status(400).json({ 'error': 'missing parameters' });
        }
        if (title.length <= 2 || description.length <= 4) {
            return res.status(400).json({ 'error': 'titre ou description trop cour' });
        }

        try{
            // récupère l'user
            const userFound = await db.User.findOne({ where: { id: userId } });
            if (userFound) {
                try{
                    // on créé le post
                    const newPost = await db.Post.create({
                        title, title,
                        img_url: img_url,
                        description: description,
                        likes: 0,
                        comments: 0,
                        UserId: userFound.id,
                        first_name: userFound.first_name,
                    });

                    if (newPost) {
                        return res.status(201).json(newPost);
                    } else {
                        return res.status(500).json({ 'error': 'cannot create post' })
                    }
                }
                catch(err) {
                    return res.status(404).json(err)
                }
            } else {
                return res.status(404).json({ 'error': 'user not found' });
            }
        }   
        catch(err) {
            return res.status(500).json({ 'error': 'unable to verify user' });
        }
    },








    listPosts: async function (req, res) {

        // Getting auth header
        const headerAuth = req.headers['authorization'];
        const userId = jwtUtils.getUserId(headerAuth);

        // Params
        const ITEMS_LIMIT = 10;
        const fields = req.query.fields;
        const limit = parseInt(req.query.limit);
        const offset = parseInt(req.query.offset);
        const order = req.query.order;

        if (limit > ITEMS_LIMIT) {
            limit = ITEMS_LIMIT;
        }

        // récupère l'user
        try{
            var userFound = await db.User.findOne({
                where: { id: userId }
            });
        } catch(err) {
            return res.status(500).json({ 'error': 'unable to verify user' });
        };

        // récupère les commentaires
        try{
            var commentFound = await db.Comment.findAll();
        } catch(err) {
            return res.status(500).json({ 'error': 'unable to verify comment' });
        };

        // récupère tout les posts
        try{
            var allPosts = await db.Post.findAll({
                order: [(order != null) ? order.split(':') : ['title', 'ASC']],
                attributes: (fields !== '*' && fields != null) ? fields.split(',') : null,
                limit: (!isNaN(limit)) ? limit : null,
                offset: (!isNaN(offset)) ? offset : null,
            })
        } catch(err) {
            res.status(500).json({ 'error': 'invalide fields' });
        };


        if (userFound) {
            if (commentFound) {                
                if (allPosts) {
                    res.status(200).json({ 'user': userFound, 'post': allPosts, 'comments': commentFound });
                } else {
                    res.status(404).json({ "error": "no post fund" });
                }       
            } else {
                return res.status(404).json({ 'error': 'comment not found' });
            }            
        } else {
            return res.status(404).json({ 'error': 'user not found' });
        }
    },










    selectOnePost: function (req, res) {

        // Getting auth header
        const headerAuth = req.headers['authorization'];
        const userId = jwtUtils.getUserId(headerAuth);

        // récupère l'user
        db.User.findOne({
            where: { id: userId }
        })
            .then(function (userFound) {
                if (userFound) {


                    // récupère le post
                    db.Post.findOne({
                        attributes: ['title', 'img_url', 'description', 'userId', 'createdAt', 'updatedAt', 'likes', 'comments'],
                        where: { id: req.params.postId }
                    })
                        .then(function (post) {
                            if (post) {

                                // récup les commentaires
                                db.Comment.findAll(
                                )
                                    .then(function (commentsFound) {
                                        if (commentsFound) {


                                            res.status(200).json({ 'userPost': userFound, 'post': post, 'comments': commentsFound });
                                        } else {
                                            res.status(404).json({ error: "Comments not found" })
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
        const headerAuth = req.headers['authorization'];
        const userId = jwtUtils.getUserId(headerAuth);
        const postId = JSON.parse(req.params.postId);

        //Params
        const title = req.body.title;
        var img_url;
        const description = req.body.description;

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
        const headerAuth = req.headers['authorization'];
        const userId = jwtUtils.getUserId(headerAuth);
        const postId = req.params.postId;



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




