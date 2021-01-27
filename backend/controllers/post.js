// Imports
const db = require('../models');
var jwtUtils = require('../utils/jwt.utils');


// Routes
module.exports = {
    createPost: function (req, res) {

        // Getting auth header
        var headerAuth = req.headers['authorization'];
        var userId = jwtUtils.getUserId(headerAuth);

        // Params
        var title = req.body.title;
        var img_url = req.body.img_url;
        var description = req.body.description;

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
                    db.Post.create({
                        title, title,
                        img_url: img_url,
                        description: description,
                        like: 0,
                        UserId: userFound.id
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
                    res.status(404).json({ 'error': 'user not found' });
                }
            })
            .catch(function (err) {
                return res.status(500).json({ 'error': 'unable to verify user' });
            });
    },




    listPosts: function (req, res) {

        // Params
        var ITEMS_LIMIT = 10;
        var fields = req.query.fields;
        var limit = parseInt(req.query.limit);
        var offset = parseInt(req.query.offset);
        var order = req.query.order;

        if (limit > ITEMS_LIMIT) {
            limit = ITEMS_LIMIT;
        }

        db.Post.findAll({
            order: [(order != null) ? order.split(':') : ['title', 'ASC']],
            attributes: (fields !== '*' && fields != null) ? fields.split(',') : null,
            limit: (!isNaN(limit)) ? limit : null,
            offset: (!isNaN(offset)) ? offset : null,
            include: [{
                model: db.User,
                attributes: ['first_name', 'last_name']
            }]
        }).then(function (posts) {
            if (posts) {
                res.status(200).json(posts);
            } else {
                res.status(404).json({ "error": "no post fund" });
            }
        }).catch(function (err) {
            console.log(err);
            res.status(500).json({ 'error': 'invalide fields' });
        });
    },







    selectOnePost: function (req, res) {
        db.Post.findOne({
            attributes: ['title', 'img_url', 'description', 'UserId', 'createdAt', 'updatedAt'],
            where: { 'id': req.params.postId }
        })
            .then(function (post) {
                if (post) {

                    res.status(200).json(post);

                    //db.Comment.findAll()


                } else {
                    res.status(404).json({ "error": "no post fund" });
                }
            }).catch(function (err) {
                console.log(err);
                res.status(500).json({ 'error': 'invalide fields' });
            });
    },








    updateOnePost: function (req, res) {

        // Getting auth header
        var headerAuth = req.headers['authorization'];
        var userId = jwtUtils.getUserId(headerAuth);
        var postId = JSON.parse(req.params.postId);

        //Params
        var title = req.body.title;
        var img_url = req.body.img_url;
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
                        .then(function(postFound) {
                            console.log(postFound)
                            // on verifie que la post a été créé par le proprio
                            if (postFound.UserId == userId) {

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
                                return res.status(201).json({'error': 'non autorisé'})
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
    }




    // supprimer un post




}