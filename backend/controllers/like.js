// Imports
const db = require('../models');
const jwtUtils = require('../utils/jwt.utils');

// Routes
module.exports = {
    likePost: async (req, res) => {

        // Getting auth header
        const headerAuth = req.headers['authorization'];
        const userId = jwtUtils.getUserId(headerAuth);
        const postId = parseInt(req.params.postId);

        if (postId <= 0) {
            return res.status(400).json({ 'error': 'invalid parameters' });
        }

        try {
            // récupère le post
            const postFound = await db.Post.findOne({
                where: { id: postId }
            })
            if (postFound) {

                // récupère l'utilisateur
                const userFound = await db.User.findOne({
                    where: { id: userId }
                })
                if (userFound) {

                    // vérifie si l'user a déja like
                    const userAlreadyLike = await db.Like.findOne({
                        where: {
                            userId: userId,
                            postId: postId
                        }
                    })
                    if (!userAlreadyLike) {

                        // on ajoute le like
                        const addLike = await db.Like.create({
                            UserId: userFound.id,
                            PostId: postFound.id,
                        })

                        if (addLike) {

                            //// update du like
                            //const updatePost = await postFound.update({
                            //    likes: postFound.likes + 1,
                            //})
                            //if (updatePost) {

                                return res.status(201).json(true);
                            
                            //} else {
                            //    res.status(500).json({ 'error': 'cannot update post like counter' });
                            //}
                        }

                    } else  if (userAlreadyLike) {
                        // on supprime le like
                        const removeLike = await db.Like.destroy({
                            where: { 
                                UserId: userFound.id,
                                PostId: postFound.id
                            }
                        })

                        if (removeLike) {

                            //// update du like
                            //const updatePost = await postFound.update({
                            //    likes: postFound.likes - 1,
                            //})
                            //if (updatePost) {

                                return res.status(201).json(false);
                            //}
                            //else {
                            //    res.status(500).json({ 'error': 'cannot update post like counter' });
                            //};
                        }
                    } else {
                        res.status(404).json({ 'error': "unable to set user reaction"})
                    }
                } else {
                    return res.status(404).json({ 'error': 'cannot found user' })
                }
            } else {
                return res.status(404).json({ 'error': 'cannot found post' })
            }
        }
        catch (err) {
            console.error(err)
        }
    },


    getUsersLiked: async(req,res) => {
        // Getting auth header
        const headerAuth = req.headers['authorization'];
        const userId = jwtUtils.getUserId(headerAuth);
        const postId = parseInt(req.params.postId);
        console.log(postId)

        if (postId <= 0) {
            return res.status(400).json({ 'error': 'invalid parameters' });
        }

        try {
            // récupère le post
            const postFound = await db.Post.findOne({
                where: { id: postId }
            })
            if (postFound) {

                // récupère l'utilisateur
                const userFound = await db.User.findOne({
                    where: { id: userId }
                })
                if (userFound) {

                    // récupère users qui on like
                    const usersLike = await db.Like.findAll({
                        where: { postId: postId },
                        attributes: ['UserId'],
                        include: [{ model : db.User, attributes: ['first_name', 'last_name'] }]
                    })

                    if (usersLike) {
                        return res.status(200).json(usersLike);
                    } else  {
                        return res.status(404).json({ 'error': 'cannot found users' })
                    }
                } else {
                    return res.status(404).json({ 'error': 'cannot found user' })
                }
            } else {
                return res.status(404).json({ 'error': 'cannot found post' })
            }
        }
        catch (err) {
            console.error(err)
        }
    }



    //removeLike: async (req, res) => {
//
    //    // Getting auth header
    //    const headerAuth = req.headers['authorization'];
    //    const userId = jwtUtils.getUserId(headerAuth);
    //    const postId = parseInt(req.params.postId);
//
    //    // condition
    //    if (postId <= 0) {
    //        return res.status(400).json({ 'error': 'invalid parameters' });
    //    }
//
    //    try {
    //        // récupère le post
    //        const postFound = await db.Post.findOne({
    //            where: { id: postId }
    //        })
    //        if (postFound) {
//
    //            // récupère l'utilisateur
    //            const userFound = await db.User.findOne({
    //                where: { id: userId }
    //            })
    //            if (userFound) {
//
    //                // vérifie si l'user a déja like
    //                const userAlreadyLike = await db.Like.findOne({
    //                    where: {
    //                        userId: userId,
    //                        postId: postId
    //                    }
    //                })
    //                if (userAlreadyLike) {
//
    //                    // méthode add sur l'instance 
    //                    const destroyRelation = await userAlreadyLike.destroy()
//
    //                    if (destroyRelation) {
//
    //                        // update du like
    //                        const updatePost = await postFound.update({
    //                            likes: postFound.likes - 1,
    //                        })
    //                        if (updatePost) {
//
    //                            return res.status(201).json(postFound);
    //                        }
    //                        else {
    //                            res.status(500).json({ 'error': 'cannot update post like counter' });
    //                        };
    //                    } else {
    //                        res.status(409).json({ 'error': ' unable to set user reaction' });
    //                    }
    //                } else {
    //                    return res.status(404).json({ 'error': 'user didn\'t already liked' });
    //                }
    //            } else {
    //                return res.status(404).json({ 'error': 'cannot found user' })
    //            }
//
    //        } else {
    //            return res.status(404).json({ 'error': 'cannot found post' })
    //        }
    //    }
    //    catch (err) {
    //        console.error(err)
    //    }
    //}

}