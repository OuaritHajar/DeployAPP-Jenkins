const db = require('../models');
const bcrypt = require('bcrypt');
const jwtUtils = require('../utils/jwt.utils');
const fs = require('fs');

const EMAIL_REGEX = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
const PASSWORD_REGEX = /^(?=.*\d).{4,12}$/;
const NAME_REGEX = /^[a-zA-Z ,.'-éè]+$/i;


module.exports = {
    signup: async (req, res, next) => {

        // Params
        const firstName = req.body.first_name;
        const lastName = req.body.last_name;
        const email = req.body.email;
        const password = req.body.password;
        const sexe = req.body.sexe
        const isAdmin = false;
        let avatarUrl = ''
        console.log('sexe : ', sexe)

        // avatar
        const pathAvatar = `${req.protocol}://${req.get('host')}/images/static/avatar/`
        function getRandomInt(max) {
            return Math.floor(Math.random() * max);
        }
        if (sexe == 0) {
            avatarUrl = pathAvatar + 'avatar' + (getRandomInt(7) + 6) + '.png'
        } else {
            avatarUrl = pathAvatar + 'avatar' + getRandomInt(7) + '.png'
        }

        // Error input
        let listErrors = []
        if (firstName === null || lastName === null || email === null || password === null) {
            listErrors.push({ 'error': 'missing parameters' })
        }
        if (firstName.length >= 30 || firstName.length <= 2) {
            listErrors.push({ 'error': 'Le Prénom doit être compris encore 3 et 19 caractères' })
        }
        if (!NAME_REGEX.test(firstName)) {
            listErrors.push({ 'error': 'Pas de nombres dans le prénom' })
        }
        if (lastName.length >= 30 || lastName.length <= 2) {
            listErrors.push({ 'error': 'Le nom doit être compris encore 3 et 19 caractères' })
        }
        if (!NAME_REGEX.test(lastName)) {
            listErrors.push({ 'error': 'Pas de nombres dans le nom' })
        }
        if (!EMAIL_REGEX.test(email)) {
            listErrors.push({ 'error': 'Adresse email non valide' })
        }
        if (!PASSWORD_REGEX.test(password)) {
            listErrors.push({ 'error': 'Mots de passe non valide : 4-12 caractère avec nombres' })
        }
        if (sexe === '') {
            listErrors.push({ 'error': 'Veuillez sélectionner votre genre' })
        }

        if (listErrors.length > 0) {
            return res.status(400).json(listErrors);
        }

        try {
            const userFound = await db.User.findOne({
                attributes: ['email'],
                where: { email: email }
            })
            if (!userFound) {
                bcrypt.hash(password, 5, async (error, bcryptedPassword) => {
                    const newUser = await db.User.create({
                        first_name: firstName,
                        last_name: lastName,
                        email: email,
                        password: bcryptedPassword,
                        isAdmin: isAdmin,
                        avatarUrl: avatarUrl,
                        sexe: sexe
                    })
                    if (newUser) {
                        console.log(newUser.dataValues);
                        return res.status(201).json({
                            'id': newUser.id,
                        })
                    }
                });
            } else {
                return res.status(409).json({ 'error': 'Email déjà utilisé' })
            }
        } catch (err) {
            console.error(err);
            return res.status(400).json(err)
        }
    },








    email: async (req, res, next) => {

        // Params
        const email = req.body.email;
        console.log("email verif : ",req.body)

        try {
            const emailAlreadyExist = await db.User.findOne({
                attributes: ['email'],
                where: { email: email }
            })
            if (!emailAlreadyExist) {
                return res.status(200).json({ 'message': 'Email disponible' })
                
            } else {
                return res.status(409).json({ 'message':'Email indisponible' })
            }
        } catch (err) {
            console.error(err);
            return res.status(400).json(err)
        }
    },








    login: async (req, res, next) => {

        const email = req.body.email;
        const password = req.body.password;

        if (email === null || password === null) {
            return res.status(400).json({ 'error': 'missing parameters' });
        }

        try {
            const userFound = await db.User.findOne({
                where: { email: email }
            })
            if (userFound) {
                bcrypt.compare(password, userFound.password, function (errBycrypt, resBycrypt) {
                    if (resBycrypt) {
                        return res.status(200).json({
                            'id': userFound.id,
                            'token': jwtUtils.generateTokenForUser(userFound),
                            'first_name': userFound.first_name,
                            'last_name': userFound.last_name,
                            'avatarUrl': userFound.avatarUrl,
                            'sexe': userFound.sexe,
                            'createdAt': userFound.createdAt,
                            'updatedAt': userFound.updatedAt,
                            'email': userFound.updatedAt,
                            'isAdmin': userFound.isAdmin,

                        })
                    } else {
                        return res.status(403).json({ 'error': 'Le mot de passe ne correspond pas' })
                    }
                })
            } else {
                return res.status(404).json({ 'error': 'Email inexistant' })
            }
        } catch (err) {
            console.error(err);
        }
    },






    getUserProfile: async (req, res) => {

        const headerAuth = req.headers['authorization'];
        const userId = jwtUtils.getUserId(headerAuth);

        if (userId < 0)
            return res.status(400).json({ 'error': 'wrong token' })

        try {
            const userFound = await db.User.findOne({
                attributes: ['id', 'first_name', 'last_name', 'email', 'createdAt', 'avatarUrl', 'sexe', 'isAdmin'],
                where: { id: req.params.userId },
                include: [{
                    model: db.Post,
                }, {
                    model: db.Like,
                    include: [{
                        model: db.Post,
                        include: [{
                            model: db.User, attributes: ['first_name', 'last_name', 'id']
                        }]
                    }]
                }, {
                    model: db.Comment,
                    include: [{
                        model: db.Post,
                        include: [{
                            model: db.User, attributes: ['first_name', 'last_name', 'id']
                        }]
                    }]
                }]
            })
            if (userFound) {
                res.status(201).json(userFound);
            } else {
                res.status(404).json({ 'error': 'user not found' });
            }
        } catch (err) {
            console.error(err)
        }
    },




    updateUserProfile: async (req, res, next) => {
        // Getting auth header
        const headerAuth = req.headers['authorization'];
        const userId = jwtUtils.getUserId(headerAuth);
        const userCibleId = req.params.userId

        //Params
        const firstName = req.body.first_name;
        const lastName = req.body.last_name;
        let avatarUrl
        console.log("req.body est : ", req.body, "req.file est : ", req.file)

        try {

            // user
            const userFound = await db.User.findOne({
                where: { id: userId }
            })
            if (userFound) {


                // on cherche l'utilisateur ciblé
                const userCible = await db.User.findOne({
                    where: { id: userCibleId }
                })
                if (userCible) {

                    //légitimité
                    if (userCible.id === userId || userFound.isAdmin) {

                        // si y a file image
                        if (req.file) {

                            const updateProfil = await userCible.update({
                                first_name: (firstName ? firstName : userCible.first_name),
                                last_name: (lastName ? lastName : userCible.last_name),
                                avatarUrl: (req.file.path ? `${req.protocol}://${req.get('host')}/images/static/assets/photos/${req.file.filename}` : userCible.avatarUrl)
                            })
                            if (updateProfil) {
                                res.locals.updateProfil = updateProfil
                                next()
                            }

                        // sans file image
                        } else {

                            // si avatar sélectionné
                            if (req.body.avatarUrl != 'http://localhost:3000/images/static/avatar/avatar.png') {
                                const updateProfil = await userCible.update({
                                    first_name: (firstName ? firstName : userCible.first_name),
                                    last_name: (lastName ? lastName : userCible.last_name),
                                    avatarUrl: (req.body.avatarUrl ? req.body.avatarUrl : userCible.avatarUrl)
                                })
                                if (updateProfil) {
                                    res.locals.updateProfil = updateProfil
                                    next()
                                }

                            // sans avatar ni image
                            } else {
                                const updateProfil = await userCible.update({
                                    first_name: (firstName ? firstName : userCible.first_name),
                                    last_name: (lastName ? lastName : userCible.last_name),
                                })
                                if (updateProfil) {
                                    res.locals.updateProfil = updateProfil
                                    next()
                                }
                            }
                        }
                    } else {
                        return res.status(404).json({ 'error': 'no authorized, modifier votre propre profil ou augmenter vos privilège' })
                    }
                } else {
                    res.status(404).json({ 'error': 'user not found' });
                }
            } else {
                return res.status(404).json({ 'error': 'user not found' })
            }
        }
        catch (err) {
            console.error(err)
        };
    },







    deleteUser: async (req, res) => {

        // Getting auth header
        const headerAuth = req.headers['authorization'];
        const userId = jwtUtils.getUserId(headerAuth);

        try {
            //user
            const userFound = await db.User.findOne({
                where: { id: userId }
            })
            if (userFound) {

                // on cherche l'utilisateur ciblé
                const userTargetFound = await db.User.findOne({
                    where: { id: req.params.userId }
                })
                if (userTargetFound) {

                    if (userId === userTargetFound.id || userFound.isAdmin) {

                        // on cherche les likes de l'user sur tout les posts
                        const likesFound = await db.Like.findAll({
                            where: { userId: userTargetFound.id }
                        })
                        if (likesFound) {

                            //likes qui appartiennent à l'user delete
                            for (like of likesFound) {
                                console.log("un like", like)

                                //récupère post du like
                                const postOuYAvaitLeLike = await db.Post.findOne({
                                    where: {
                                        id: like.PostId
                                    }
                                })

                                if (postOuYAvaitLeLike) {
                                    const destroyLikes = await like.destroy({
                                        where: { UserId: userTargetFound.id }
                                    })
                                }
                            }
                        }




                        // comments de l'user delete
                        const commentsFound = await db.Comment.findAll({
                            where: { userId: userTargetFound.id }
                        })
                        if (commentsFound) {

                            for (comment of commentsFound) {

                                // pour chaque commentaire on cherche le post ou y a le comment
                                const postOuYAvaitLeComment = await db.Post.findOne({
                                    where: {
                                        id: comment.PostId
                                    }
                                })

                                //destroy comments
                                const destroyComments = await db.Comment.destroy({
                                    where: { id: comment.id }
                                })
                            }
                        }





                        // on cherche les images
                        const imageFound = await db.Image.findAll({
                            where: { userId: userTargetFound.id }
                        })
                        if (imageFound) {
                            
                            // supprime les images
                            for (image in imageFound) {

                                if (`${imageFound[image].url}` != null) {
                                    fs.unlink(`${imageFound[image].url}`, (err) => {
                                        if (err) {
                                            console.error(err)
                                        } else {
                                            console.log('image ' + `${imageFound[image].name}` + ' supprimé')
                                        }
                                    })
                                }
                            }
                            // on supprime l'image de la database
                            const destroyImage = await db.Image.destroy({
                                where: { userId: userTargetFound.id }
                            })
                        }



                        // on cherche l'avatar
                        const avatarFound = await db.Photo.findOne({
                            where: { userId: userTargetFound.id }
                        })
                        if (avatarFound) {

                            // supprime l'avatar
                            fs.unlink(`${avatarFound.url}`, (err) => {
                                if (err) {
                                    console.error(err)
                                } else {
                                    console.log('image ' + avatarFound.name + ' supprimé')
                                }
                            })

                            // on supprime l'avatar de la database
                            const destroyAvatar = await db.Photo.destroy({
                                where: { userId: userTargetFound.id }
                            })
                        }





                        // on cherche les posts
                        const postsFound = await db.Post.findAll({
                            where: { userId: userTargetFound.id },
                        })
                        if (postsFound) {
                            
                            for (post of postsFound) {

                                // on récupère tout les commentaires
                                const commentsFromOtherFound = await db.Comment.findAll({
                                    where: { PostId: post.id }
                                })
                                if (commentsFromOtherFound != null) {

                                    // on supprime tout les commentaires des posts
                                    const destroyCommentsOfOthersUsers = await db.Comment.destroy({
                                        where: { PostId: post.id }
                                    })
                                }


                                //mtn on cherche les likes des autres gugus
                                const likesFromOtherFound = await db.Like.findAll({
                                    where: { postId: post.id }
                                })
                                //on les supprimes
                                if (likesFromOtherFound != null) {
                                    const destroyLikesFromOtherUsers = await db.Like.destroy({
                                        where: { postId: post.id }
                                    })
                                }


                                // on supprime enfin le post
                                const destroyPosts = await db.Post.destroy({
                                    where: { id: post.id }
                                })
                            }
                        }




                        // on supprimer l'utilisateur
                        const deleteUserTarget = await db.User.destroy({
                            where: { id: userTargetFound.id }
                        })



                        if (deleteUserTarget)
                            res.status(201).json({ 'message': 'User deleted' })

                    } else {
                        return res.status(404).json({ 'error': 'no permission' })
                    }
                } else {
                    return res.status(404).json({ 'error': 'user not found' });
                }
            } else {
                return res.status(404).json({ 'error': 'user not found' })
            }
        }
        catch (err) {
            console.error(err)
        };
    },

};