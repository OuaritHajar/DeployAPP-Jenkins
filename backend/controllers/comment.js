// Imports
const db = require('../models');
const jwtUtils = require('../utils/jwt.utils');

// Routes
module.exports = {
    createComment: async (req, res) => {

        // Getting auth header
        const headerAuth = req.headers['authorization'];
        const userId = jwtUtils.getUserId(headerAuth);

        // Params
        const description = req.body.description;
        console.log("req body : ",req.body.description)

        // condition
        if (description === null) {
            return res.status(400).json({ 'error': 'missing parameters' });
        }
        if (description.length <= 3) {
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
                    const createComment = await postFound.createComment({
                        description: description,
                        PostId: postFound.id,
                        UserId: userFound.id,
                    })
                    if (createComment) {

                        // update du compteur commentaires
                        //const updateComments = await postFound.update({
                        //    comments: postFound.comments += 1,
                        //})
                        //if (updateComments) {
                            
                            // renvoie le nouveau commentaire
                                return res.status(201).json(createComment);
                        //}
                        //else {
                        //    res.status(500).json({ 'error': 'cannot update post like counter' });
                        //};
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
                    
                    // récupère les commentaires du post
                    const AllCommentsOfPost = await postFound.getComments({
                        where: { postId: req.params.postId },
                        include: db.User
                    })
                    if (AllCommentsOfPost) {

                        // renvoie tout les commentaires 
                        return res.status(201).json(AllCommentsOfPost);


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
        const headerAuth = req.headers['authorization'];
        const userId = jwtUtils.getUserId(headerAuth);
        const postId = req.params.postId;
        const commentId = req.params.commentId;

        console.log("req.body est : ", req.body)
        //Params
        const description = req.body.description;

        if (description.length <= 3) {
            return res.status(400).json({ 'error': 'description trop courte' });
        }

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
                                description: (description ? description : commentFound.description)
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
        const headerAuth = req.headers['authorization'];
        const userId = jwtUtils.getUserId(headerAuth);
        const postId = req.params.postId
        const commentId = req.params.commentId;

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

                        // on verifie que le commentaire appartient à l'user
                        if (commentFound.UserId == userFound.id || userFound.isAdmin == true) {

                            //delete
                            const destroyComment = await db.Comment.destroy({
                                where: { id: commentId }
                            })
                            if (destroyComment) {

                                // update database
                                const updatePost = await postFound.update({
                                    comments: postFound.comments - 1,
                                })
                                if (updatePost) {
                                    res.status(201).json({ 'message': 'commentaire deleted' })
                                }
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