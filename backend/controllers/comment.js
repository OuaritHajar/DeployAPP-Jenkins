// Imports
const db = require('../models');
var jwtUtils = require('../utils/jwt.utils');

// Routes
module.exports = {
    createComment: async (req, res) => {

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

        try {
            // récupère l'user
            const userFound = await db.User.findOne({
                where: { id: userId }
            })
            if (userFound) {

                // récupère le post
                const postFound = await db.Post.findOne({
                    where: { id: req.params.postId }
                })
                if (postFound) {

                    // créer le commentaire
                    const createComment = await db.Comment.create({
                        description: description,
                        PostId: postFound.id,
                        UserId: userFound.id,
                    })
                    if (createComment) {

                            // renvoie le nouveau commentaire
                            return res.status(201).json(createComment);

                    } else {
                        return res.status(500).json({ 'error': 'cannot create comment' })
                    }
                } else {
                    return res.status(500).json({ 'error': 'cannot found post' })
                }
            } else {
                res.status(404).json({ 'error': 'user not found' });
            }
        }
        catch (err) {
            console.error(err)
        };
    },




    listPostComments: async (req, res) => {

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

        try {
            // récupère l'user
            const userFound = await db.User.findOne({
                where: { id: userId }
            })
            if (userFound) {

                // récupère le post
                const postFound = await db.Post.findOne({
                    where: { id: req.params.postId }
                })
                if (postFound) {

                    // récupère les commentaires
                    const AllCommentsOfPost = await db.Comment.findAll()
                    if (AllCommentsOfPost) {


                        // renvoie tout les commentaires d'un 
                        return res.status(201).json(AllCommentsOfPost);

                        // pagination

                    } else {
                        return res.status(500).json({ 'error': 'cannot find all comments' })
                    }
                } else {
                    return res.status(500).json({ 'error': 'cannot found post' })
                }
            } else {
                res.status(404).json({ 'error': 'user not found' });
            }
        }
        catch (err) {
            console.error(err)
        };
    },







    updateOneComment: async (req, res) => {

        // Getting auth header
        var headerAuth = req.headers['authorization'];
        var userId = jwtUtils.getUserId(headerAuth);
        var postId = JSON.parse(req.params.postId);
        var commentId = JSON.parse(req.params.commentId);

        //Params
        var description = req.body.description;

        try {
            // on cherche l'utilisateur
            const userFound = await db.User.findOne({
                where: { id: userId }
            })
            if (userFound) {

                // on cherche le post souhaiter dans la requete
                const postFound = await db.Post.findOne({
                    where: { id: postId }
                })
                if (postFound) {

                    // on cherche le comment souhaiter dans la requete
                    const commentFound = await db.Comment.findOne({
                        where: { id: commentId }
                    })
                    if (commentFound) {

                        // on verifie que la comment a été créé par le proprio ou que l'user est admin
                        if (commentFound.UserId == userFound.id || userFound.isAdmin == true) {

                            //update
                            const commentUpdate = await commentFound.update({
                                description: (description ? description : description)
                            })
                            if (commentUpdate) {
                                res.status(201).json(commentUpdate);
                            }
                            else {
                                res.status(500).json({ 'error': 'cannot update commentaire' });
                            };
                        } else {
                            return res.status(201).json({ 'error': 'non autorisé' })
                        }
                    } else {
                        return res.status(404).json({ 'error': 'comment not found' })
                    }
                } else {
                    return res.status(404).json({ 'error': 'post not found' })
                }
            } else {
                res.status(404).json({ 'error': 'user not found' });
            }
        } catch (err) {
            console.error(err)
        }
    },


    deleteOneComment: async (req, res) => {

        // Getting auth header
        var headerAuth = req.headers['authorization'];
        var userId = jwtUtils.getUserId(headerAuth);
        var postId = req.params.postId
        var commentId = req.params.commentId;

        try {
            // on cherche l'utilisateur
            const userFound = await db.User.findOne({
                where: { id: userId }
            })
            if (userFound) {

                // on cherche le post
                const postFound = await db.Post.findOne({
                    where: { id: postId }
                })
                if (postFound) {

                    // on cherche le commentaire
                    const commentFound = await db.Comment.findOne({
                        where: { id: commentId }
                    })
                    if (commentFound) {

                        // on vverifie que le commentaire appartient à l'user
                        if (commentFound.UserId == userFound.id || userFound.isAdmin == true) {

                            //delete
                            const destroyComment = await db.Comment.destroy({
                                where: { id: commentId }
                            })
                            if (destroyComment) {
                                res.status(201).json({ 'message': 'commentaire deleted' })
                            }
                            else {
                                res.status(500).json({ 'error': 'cannot update user' });
                            };
                        } else {
                            return res.status(404).json({ 'error': 'no permission' });
                        }
                    } else {
                        res.status(404).json({ 'error': 'comment not found' })
                    }
                } else {
                    return res.status(404).json({ 'error': 'post not found' });
                }
            } else {
                return res.status(404).json({ 'error': 'user not found' })
            }

        }
        catch (err) {
            console.error(err)
        }
    }


}