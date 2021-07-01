// Imports
const db = require('../models');
const jwtUtils = require('../utils/jwt.utils');

// Routes
module.exports = {
    createPost: async function (req, res) {

        // Getting auth header
        const headerAuth = req.headers['authorization'];
        const userId = jwtUtils.getUserId(headerAuth);

        // Params
        const title = req.body.title;
        const description = req.body.description;
        let img_url;

        if (req.file) { img_url = req.file.path } 

        if (title === null || description === null) {
            return res.status(400).json({ 'error': 'missing parameters' });
        }
        if (title.length <= 2 || description.length <= 4) {
            return res.status(400).json({ 'error': 'titre ou description trop cour' });
        }

        try {
            // récupère l'user
            const userFound = await db.User.findOne({ where: { id: userId } });
            if (userFound) {

                // on créé le post
                const newPost = await db.Post.create({
                    title, title,
                    img_url: req.file ? `${req.protocol}://${req.get('host')}/images/static/assets/uploads/${req.file.filename}` : null,
                    description: description,
                    likes: 0,
                    comments: 0,
                    UserId: userFound.id,
                    
                });

                if (newPost) {
                    return res.status(201).json(newPost);
                } else {
                    return res.status(500).json({ 'error': 'cannot create post' })
                }

            } else {
                return res.status(404).json({ 'error': 'user not found' });
            }
        }
        catch (err) {
            console.error(err)
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
        try {
            var userFound = await db.User.findOne({
                where: { id: userId },
                attributes: ['id', 'first_name', 'last_name', 'createdAt', 'updatedAt']
            });
        } catch (err) {
            return res.status(500).json({ 'error': 'unable to verify user 2' });
        };

        // récupère les commentaires
        try {
            var commentFound = await db.Comment.findAll();
        } catch (err) {
            return res.status(500).json({ 'error': 'unable to verify comment' });
        };

        // récupère tout les posts
        try {
            var allPosts = await db.Post.findAll({
                order: [(order != null) ? order.split(':') : ['createdAt', 'DESC']],
                attributes: (fields !== '*' && fields != null) ? fields.split(',') : null,
                limit: (!isNaN(limit)) ? limit : null,
                offset: (!isNaN(offset)) ? offset : null,
                
            })
        } catch (err) {
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








    selectOnePost: async (req, res) => {

        // Getting auth header
        const headerAuth = req.headers['authorization'];
        const userId = jwtUtils.getUserId(headerAuth);

        try {
            // récupère l'user
            const userFound = await db.User.findOne({
                where: { id: userId },
                attributes: ['id', 'first_name', 'last_name']
            })
            if (userFound) {

                // récupère le post
                const postFound = await db.Post.findOne({
                    attributes: ['userId', 'title', 'description', 'img_url', 'createdAt', 'updatedAt', 'likes', 'comments'],
                    where: { id: req.params.postId }
                })
                if (postFound) {

                    // récup les commentaires
                    const commentsFound = await db.Comment.findAll({
                        where: { postId: req.params.postId }
                    })
                    if (commentsFound) {
                        res.status(200).json({ 'post': postFound, 'comments': commentsFound, 'user': userFound });
                    } else {
                        res.status(404).json({ error: "Comments not found" })
                    }

                } else {
                    res.status(404).json({ "error": "no post fund" });
                }

            } else {
                return res.status(404).json({ 'error': 'user not found' });
            }
        } catch (err) {
            console.error(err)
        };
    },







    updateOnePost: async (req, res) => {

        // Getting auth header
        const headerAuth = req.headers['authorization'];
        const userId = jwtUtils.getUserId(headerAuth);
        const postId = JSON.parse(req.params.postId);

        //Params
        const title = req.body.title;
        let img_url;
        const description = req.body.description;

        if (title === null || description === null) {
            return res.status(400).json({ 'error': 'missing parameters' });
        }
        console.log('requete file du controler post',req.file)
        if (req.file) { img_url = req.file.path }

        try {
            // on cherche l'utilisateur
            const userFound = await db.User.findOne({
                where: { id: userId }
            })

            if (userFound) {
                // on cherche le post souhaité dans la requete
                const postFound = await db.Post.findOne({
                    where: { id: postId }
                })

                if (postFound) {
                    // on verifie que la post a été créé par le proprio

                    if (userId == postFound.UserId || userFound.isAdmin == true) {
                        // update post
                        const postUpdate = await postFound.update({
                            title: (title ? title : postFound.title),
                            img_url: req.file ? `${req.protocol}://${req.get('host')}/images/static/assets/uploads/${req.file.filename}` : postFound.img_url,
                            description: (description ? description : postFound.description)
                        })
                        if (postUpdate) {

                            return res.status(201).json(postUpdate);
                        }
                    } else {
                        return res.status(201).json({ 'error': 'non autorisé' })
                    }
                } else {
                    return res.status(201).json({ 'error': 'post not found' })
                }

            } else {
                res.status(404).json({ 'error': 'user not found' });
            }

        } catch (err) {
            console.error(err)
        };
    },





    removeOnePost: async (req, res) => {

        // Getting auth header
        const headerAuth = req.headers['authorization'];
        const userId = jwtUtils.getUserId(headerAuth);
        const postId = req.params.postId;

        try {

            // on cherche l'utilisateur
            const userFound = await db.User.findOne({
                where: { id: userId }
            })
            if (userFound) {

                // on cherche le post
                const postFound = await db.Post.findOne({
                    where: { id: req.params.postId }
                })
                if (postFound && !undefined) {

                    // on verifie la légitimité
                    if (postFound.UserId == userFound.id) {

                        

                        // on cherche les commentaires
                        const commentsFound = await db.Comment.findAll({
                            where: { postId: postId }
                        })

                        if (commentsFound) {
                            // on supprimes les commentaires
                            const destroyComments = await db.Comment.destroy({
                                where: { postId: postId }
                            })
                            if (destroyComments) {
                                res.status(202).json({ 'message': 'Comments removed' })
                            } 
                        }
                        
                        

                        //on cherche les likes
                        const likesFound = await db.Like.findAll({
                            where: { postId : postId}
                        })
                        
                        if (likesFound) {
                            // on supprimes les like
                            const destroyLikes = await db.Like.destroy({
                                where: { postId: postId }
                            })
                            if (destroyLikes) {
                                res.status(202).json({ 'message': 'Likes removed' })
                            } 
                        }

                        

                        // Supprime le post
                        const destroyPost = await db.Post.destroy({
                            where: { id: postId }
                        })
                        if (destroyPost) {
                            res.status(202).json({ 'message': 'Post deleted' })
                        }
                        else {
                            res.status(500).json({ 'error': 'cannot update post' });
                        };


                        //// on les supprimes l'image'
                        //const destroyImage = await db.Image.destroy({
                        //    where: { postId: postId }
                        //})

                        
                        //if (destroyImage) {
                        //    res.status(202).json({ 'message': ' Image from post deleted' })
                        //}
                        //else {
                        //    res.status(500).json({ 'error': 'cannot destroy Image' });
                        //};


                    } else {
                        res.status(404).json({ 'error': 'no permission' });
                    }

                } else {
                    res.status(404).json({ 'error': 'post not found' });
                }
            } else {
                res.status(404).json({ 'error': 'user not found' });
            }

        } catch (err) {
            console.error(err)
        };
    }




}




