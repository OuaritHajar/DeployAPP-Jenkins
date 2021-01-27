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

        if(title.length <= 2 || description.length <= 4 ) {
            return res.status(400).json({'error': 'titre ou description trop cour'});
        }

        // récupère l'user
        db.User.findOne({
            where:{ id: userId }
        })
        .then(function(userFound) {
            if(userFound) {
                db.Post.create({
                    title, title,
                    img_url: img_url,
                    description: description,
                    UserId: userFound.id
                })
                .then(function(newPost) {
                    if (newPost) {
                        return res.status(201).json(newPost);
                    } else {
                        return res.status(500).json({'error': 'cannot create post'})
                    }
                })
                .catch(function(err) {
                    return res.status(404).json(err)
                })
            } else{
                res.status(404).json({'error': 'user not found'});
            }
        })
        .catch(function(err) {
            return res.status(500).json({'error': 'unable to verify user'});
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
            order: [(order != null) ? order.split(':') : ['title','ASC']],
            attributes: (fields !== '*' && fields != null) ? fields.split(',') : null,
            limit: (!isNaN(limit)) ? limit : null,
            offset: (!isNaN(offset)) ? offset : null,
            include: [{
                model: db.User,
                attributes: [ 'first_name','last_name' ]
              }]
        }).then(function(posts) {
            if(posts) {
                res.status(200).json(posts);
            } else {
                res.status(404).json({"error":"no post fund"});
            }
        }).catch(function(err) {
            console.log(err);
            res.status(500).json({ 'error': 'invalide fields' });
        });
    },







    selectOnePost: function(req,res) {
        db.Post.findOne({ 
            attributes: ['title','img_url','description','UserId','createdAt','updatedAt'],
            where: { 'id': req.params.id }
        })
        .then(function(post) {
            if(post) {




                res.status(200).json(post);

                //db.Comment.findAll()






            } else {
                res.status(404).json({"error":"no post fund"});
            }
        }).catch(function(err) {
            console.log(err);
            res.status(500).json({ 'error': 'invalide fields' });
        });
    }






    // supprimer un post
}