import { createStore } from 'vuex'
//import createPersistedState from "vuex-persistedstate";
const axios = require('axios');

let instance = axios.create({
    baseURL: 'http://localhost:3000/api/',
});

let user = localStorage.getItem('user');

//si token encore valide
if (!user) {
    user = {
        id: -1,
        token: '',
    }
} else {
    try {
        user = JSON.parse(user);
        instance.defaults.headers.common['Authorization'] = `Bearer ${user.token}`;
    } catch (ex) {
        user = {
            id: -1,
            token: '',
        };
    }
}

const store = createStore({
    state: {
        user:'',
        status:'',
        loginError: '',
        statusSignup:'',
        listErrors : '',
        emailAvailable: '',

        userProfil:'',
        postsNumber: '',
        posts: [],
        post:'',
        
        information:'',
    },


    getters: {
        get_user(state) {
            return state.user
        },
        get_status(state) {
            return state.status
        },
        get_login_error(state) {
            return state.loginError
        },
        
        get_email_available(state){
            return state.emailAvailable
        },
        get_status_signup(state){
            return state.statusSignup
        },
        get_list_errors(state) {
            return state.listErrors
        },
        get_posts_number(state) {
            return state.postsNumber
        },
        get_all_posts(state) {
            return state.posts
        },
        get_one_post(state) {
            console.log("getOnePost : ",state.post)
            return state.post
        },
        get_user_profil(state) {
            return state.userProfil
        },

        get_information(state) {
            return state.information
        }
    },





    mutations: {
        // ----------------  CONNEXION  ----------------
        LOG_USER: (state, user) => {
            state.user = user;
            state.emailAvailable =""
        },
        STATUS_LOGIN: (state, status) => {
            state.status = status
            state.information = ''
        },
        LOGIN_ERROR: (state, error) => {
            if(error){
                state.loginError = error.data.error
            } else {
                state.loginError = null
            }
        },
        STATUS_SIGNUP: (state, status)=> {
            state.statusSignup =  status
        },
        CHECK_EMAIL: (state, response) => {
            state.emailAvailable = response
        },
        SIGNUP_ERRORS: (state, errors) => {
            let listErrors = []
            console.log('errors : ', errors)

            if (errors.data) {

                if(errors.status === 400) {
                    errors.data.forEach(error => {
                        listErrors.push(error.error)
                    })

                } else if (errors.status === 409) {
                    listErrors.push(errors.data.error)
                }


                console.log('liste erreur : ', listErrors)
                state.listErrors = listErrors
            } else {
                state.listErrors = null
            }
        },

        LOG_OUT: (state, information) => {
            state.information = information
            state.user = {
                id: -1,
                token: '',
                isAdmin: false
            }
            state.userProfil = ""
            localStorage.clear()
            console.log(localStorage, user)
        },




        // ----------- PROFIL -----------------
        GET_USER_PROFIL:(state, userProfil) => {
            state.userProfil = userProfil
        },
        
        EDIT_PROFIL: (state, profil) => {
            state.userProfil = profil
        },
        EDIT_USER: (state, user) => {
            state.user = user
        },




        // ---------------  POSTS  ----------------
        POSTS_NUMBER: (state, number) => {
            state.postsNumber = number
        }, 
        ALL_POSTS: (state, payload) => {
            state.posts = payload
        },
        GET_ONE_POST: (state, data) => {
            state.post = data
        },
        CREATE_POST: (state, newPost) => {
            console.log('new post : ',newPost)
        },
        EDIT_POST: (state, data) => {
            console.log("mutation : edit post vue = ",data.vue)
            if(data.vue === "Post"){
                state.post = data.newPost
            } else {
                const LePost = state.posts.find(post => post.id === data.newPost.id)
                console.log('LePost : ', LePost)

                LePost.description = data.newPost.description
                LePost.title= data.newPost.title
                LePost.img_url = data.newPost.img_url
            }
        },
        EDIT_LIKE:(state, data ) => {
            console.log('edit like data : ', data)

            if(data.data.vue === "Post"){
                state.post.userAlreadyLike = data.newPost.userAlreadyLike
                state.post.Likes = data.newPost.Likes
            } else {
                const LePost = state.posts.find(post => post.id === data.newPost.id)

                LePost.userAlreadyLike = data.newPost.userAlreadyLike
                LePost.Likes = data.newPost.Likes
            }
        },


        // -----------------  COMMENTS  ---------------
        NEW_COMMENT: (state, response) => {
            console.log(response)
            if(response.data.vue === "Post"){
                state.post.Comments = response.comments
            } else {
                const LePost = state.posts.find(post => post.id === response.data.postId)
                LePost.Comments = response.comments
            }
        },
        DELETE_COMMENT: (state, data)=> {
            if(data.data.vue === "Post"){
                state.post.Comments = data.newComments
            } else {
                const LePost = state.posts.find(post => post.id === data.data.postId)
                LePost.Comments = data.newComments
            }
        },
        EDIT_COMMENT: (state, data) => {
            if(data.data.vue === "Post"){
                state.post.Comments = data.newComments
            } else {
                const LePost = state.posts.find(post => post.id === data.data.postId)
                LePost.Comments = data.newComments
            }
        },



        // ----------------- AFFICHAGE ---------------
        DISPLAY_COMMENT:(state, postId) => {
            const LePost = state.posts.find(post => post.id === postId)
            LePost.displayComment = true
        },
        HIDE_COMMENT:(state, postId) => {
            const LePost = state.posts.find(post => post.id === postId)
            LePost.displayComment = false
        },

        DISPLAY_INPUT_COMMENT:(state, data) => {
            console.log("je cherche ca : ",data)
            if(data.vue === "Post"){
                state.post.displayInputComment = true
            } else {
                const LePost = state.posts.find(post => post.id === data.postId)
                LePost.displayInputComment = true
            }
        },
        HIDE_INPUT_COMMENT:(state, data) => {
            if(data.vue === "Post"){
                state.post.displayInputComment = false
            } else {
                const LePost = state.posts.find(post => post.id === data.postId)
                LePost.displayInputComment = false
            }
        },

        DISPLAY_LIST_USERS_LIKE:(state, data) => {
            if(data.vue === "Post"){
                state.post.listUsersLike = true
            } else {
                const LePost = state.posts.find(post => post.id === data.postId)
                LePost.listUsersLike = true
            }
        },
        HIDE_LIST_USERS_LIKE:(state, data) => {
            if(data.vue === "Post"){
                state.post.listUsersLike = false
            } else {
                const LePost = state.posts.find(post => post.id === data.postId)
                LePost.listUsersLike = false
            }
        },

        DISPLAY_EDIT_POST:(state, data) => {
            if(data.vue === "Post"){
                state.post.displayEditPost = true
            } else {
                const LePost = state.posts.find(post => post.id === data.postId)
                LePost.displayEditPost = true
            }
        },
        HIDE_EDIT_POST:(state, data) => {
            if(data.vue === "Post"){
                state.post.displayEditPost = false
            } else {
                const LePost = state.posts.find(post => post.id === data.postId)
                LePost.displayEditPost = false
            }
        },




        //------------- AFFICHAGE EDIT COMMENT ------------
        DISPLAY_EDIT_COMMENT:(state, data) => {
            if(data.vue === "Post"){
                const LeComment = state.post.Comments.find(comment => comment.id === data.commentId)
                LeComment.displayEditComment = true
            } else {
                const LePost = state.posts.find(post => post.id === data.postId)
                const LeComment = LePost.Comments.find(comment => comment.id === data.commentId)
                LeComment.displayEditComment = true
            }
        },
        HIDE_EDIT_COMMENT:(state, data) => {
            if(data.vue === "Post"){
                const LeComment = state.post.Comments.find(comment => comment.id === data.commentId)
                LeComment.displayEditComment = false
            } else {
                const LePost = state.posts.find(post => post.id === data.postId)
                const LeComment = LePost.Comments.find(comment => comment.id === data.commentId)
                LeComment.displayEditComment = false
            }
        },

        DISPLAY_DEL_COMMENT: (state, data) => {
            if(data.vue === "Post"){
                const LeComment = state.post.Comments.find(comment => comment.id === data.commentId)
                LeComment.displayDelComment = true
            } else {
                const LePost = state.posts.find(post => post.id === data.postId)
                const LeComment = LePost.Comments.find(comment => comment.id === data.commentId)
                LeComment.displayDelComment = true
            }
        },
        HIDE_DEL_COMMENT: (state, data) => {
            if(data.vue === "Post"){
                const LeComment = state.post.Comments.find(comment => comment.id === data.commentId)
                LeComment.displayDelComment = false
            } else {
                const LePost = state.posts.find(post => post.id === data.postId)
                const LeComment = LePost.Comments.find(comment => comment.id === data.commentId)
                LeComment.displayDelComment = false
            }
        }
    },



    actions: {

    // --------------  CONNECTION  ---------
        signup: ({commit}, userInfos) => {
            commit('STATUS_SIGNUP', 'Loading');
            return new Promise((resolve,reject) => {
                instance.post('users/signup', userInfos)
                .then(res=> {
                    commit('STATUS_SIGNUP', 'Compte créé' )
                    commit('SIGNUP_ERRORS', [''])
                    resolve(res)
                })
                .catch(error => {
                    commit('STATUS_SIGNUP', 'Erreur')
                    commit('SIGNUP_ERRORS', error.response)
                    reject(error)
                })
            })
        },

        checkEmail: ({commit}, email) => {
            instance.post('users/signup/email',{ email: email })
            .then((response) => {
                commit('CHECK_EMAIL', response.data.message)
            })
            .catch((error)=> {
                commit('CHECK_EMAIL', error.response.data.message)
            })
        },

        login: ({ commit }, userInfos) => {
            commit('STATUS_LOGIN', 'Loading');
            return new Promise(( resolve,reject ) => {
                instance.post('users/login', userInfos)
                .then( (response) => {
                    instance.defaults.headers.common['Authorization'] = `Bearer ${response.data.token}`;
                    
                    commit('STATUS_LOGIN', '' )
                    commit('STATUS_SIGNUP', '')
                    commit('LOGIN_ERROR', '')
                    commit('LOG_USER', response.data);
                    resolve(response)
                    console.log('isAdmin : ',response.data)
                })
                .catch((error) => {
                    console.log('error login : ', error)
                    commit('STATUS_LOGIN', 'Erreur')
                    commit('LOGIN_ERROR',error.response)
                    reject(error)
                });
            })
        },

        logout: ({ commit }, information) => {
            commit("LOG_OUT", information)
        },



        
    // --------------  PROFIL  ---------------
        getProfilUsers:({ commit },userId) => {
            instance.get('users/'+ userId)
            .then((response) => {
                console.log("response profil user : ",response.data)
                commit('GET_USER_PROFIL', response.data)
            })
            .catch((error) => {
                console.error(error);
            });
        },

        editUser:({ commit }, data) => {
            instance.put('users/' + data.get('userIdProfil'), data) 
            .then((response) => {
                console.log('edit profil user : ', response)

                instance.get('users/'+ data.get('userIdProfil'))
                .then((getResponse) => {
                    console.log("response profil user : ",getResponse.data)

                    //si user actuel
                    if (data.get('userIdProfil') === data.get('userId')) {
                        commit('EDIT_USER', getResponse.data)
                        commit('EDIT_PROFIL', getResponse.data)
                    } else { // modo
                        commit('EDIT_PROFIL', getResponse.data)
                    }
                    
                })
            })
            .catch((error) => {
                console.error(error)
            })
        },

        deleteUser:({ commit }, data) => {
            instance.delete('users/' + data.theUserId)
            .then( () => {
                console.log("user actuel : ",data.user.id, "user cible : ", data.theUserId)
                if(data.user.id === data.theUserId) {
                    commit('LOG_OUT')
                }
            })
        },



        

    // ---------------- POSTS  ------------------

        postsNumber: ({commit}) => {
            instance.get('posts/allPosts')
            .then((response)=> {
                commit('POSTS_NUMBER', response.data.length)
            })
        },

        getAllPosts: ({commit}, page ) => {
            let perPage = 5
            let offset = (page - 1) * perPage 

            instance.get('posts?limit='+ perPage + '&offset=' + offset)
            .then((response) => {
                response.data.allPosts.forEach(post => {
                    post.displayComment = false
                    post.displayInputComment = false
                    post.displayEditPost = false
                    post.listUsersLike = false
                    post.Comments.forEach(comment => {
                        comment.displayEditComment = false
                        comment.displayDelComment = false
                    })
                    post.userAlreadyLike = false
                    post.Likes.forEach(like => {
                        if (like.UserId === response.data.user.id) {
                            post.userAlreadyLike = true
                        }
                    })
                })
                console.log("response front All posts",response.data)
                commit('ALL_POSTS', response.data.allPosts)
            })
            .catch((error) => {
                console.error(error);
            });
        },

        createPost:({commit},data) => {
            return new Promise((resolve,reject) => {
                instance.post('posts', data)
                .then( (createResponse) => {
                    console.log("response create : ",createResponse.data)

                    instance.get('posts/' + createResponse.data.id)
                    .then((getResponse) => {
                        console.log("postResponse : ",getResponse)

                        getResponse.data.post.displayComment = false
                        getResponse.data.post.displayInputComment = false
                        getResponse.data.post.displayEditPost = false
                        getResponse.data.post.listUsersLike = false
                        getResponse.data.post.userAlreadyLike = false

                        commit('CREATE_POST', getResponse.data.post)
                        resolve(getResponse)
                    })
                })
                .catch((error) => {
                    console.error(error)
                    reject(error)
                })
            })
        },

        getOnePost: ({ commit }, postId) => {
            return new Promise((resolve, reject) => {
                instance.get('posts/' + postId)
                .then((response)=> {
                    response.data.post.displayEditPost = false
                    response.data.post.displayInputComment = false
                    response.data.post.listUsersLike = false

                    response.data.post.Comments.forEach(comment => {
                        comment.displayEditComment = false
                        comment.displayDelComment = false
                    })

                    response.data.post.userAlreadyLike = false
                    response.data.post.Likes.forEach(like => {
                        if (like.UserId === response.data.user.id) {
                            response.data.post.userAlreadyLike = true
                        }
                    })

                    console.log('respose post : ', response.data)
                    commit('GET_ONE_POST', response.data.post)
                    resolve(response)
                })
                .catch((error)=> {
                    console.error(error)
                    reject(error)
                })
            })
        },

        editPost: ({ commit }, data) => {
            instance.put('posts/' + data.get('postId'), data )
            .then( () => {
                instance.get('posts/' + data.get('postId'))
                .then((response) => {
                    
                        response.data.post.displayComment = false
                        response.data.post.displayInputComment = false
                        response.data.post.displayEditPost = false
                        response.data.post.listUsersLike = false
                        response.data.post.userAlreadyLike = false
                        
                        response.data.post.Comments.forEach(comment => {
                            comment.displayEditComment = false
                            comment.displayDelComment = false
                        })
                    console.log("response front All posts",response.data)
                    commit('EDIT_POST', {newPost :response.data.post, vue: data.get('vue')})
                })
                .catch((error) => {
                    console.error(error);
                });
            })
            .catch((err) => {
                console.error(err);
            });
        },

        deletePost:({commit}, postId) => {
            return new Promise((resolve, reject) => {
                instance.delete('posts/'+ postId )
                .then(()=>{
                    instance.get('posts')
                    .then((response) => {
                        response.data.allPosts.forEach(post => {
                            post.displayComment = false
                            post.displayInputComment = false
                            post.displayEditPost = false
                            post.listUsersLike = false

                            post.Comments.forEach(comment => {
                                comment.displayEditComment = false
                                comment.displayDelComment = false
                            })

                            post.userAlreadyLike = false
                            post.Likes.forEach(like => {
                                if (like.UserId === response.data.user.id) {
                                    post.userAlreadyLike = true
                                }
                            })
                        })
                        console.log("response front All posts",response.data)
                        commit('ALL_POSTS', response.data.allPosts)
                        resolve(response)
                    })
                    .catch((error) => {
                        console.error(error);
                    });
                })
                .catch((error) => {
                    console.error(error);
                    reject(error)
                });
            })
        },

        



    // -------------------  COMMENTS  -------------------
        newComment: ({commit}, data) => {
            return new Promise((resolve, reject) => {
                instance.post('posts/'+ data.postId + '/comment', data )
                .then( (response) => {
                    console.log("create Comment response : ", response)

                    instance.get('posts/' + data.postId + '/comments')
                    .then((getResponse) => {
                        console.log('get response comments : ', getResponse)
                    
                        commit('NEW_COMMENT', { comments: getResponse.data, data: data })
                        resolve(response)
                    }) 
                })
                .catch((err) => {
                    console.error(err);
                    reject(err)
                });
            })
        },

        editComment: ({ commit }, data) => {
            instance.put('posts/' + data.postId + '/comment/' + data.commentId, data)
            .then( () => {
                instance.get('posts/' + data.postId + '/comments')
                .then((getResponse) => {
                    console.log("get response comments of post", getResponse.data)
                    commit('EDIT_COMMENT', { newComments : getResponse.data, data: data})
                })
            })
            .catch((err) => {
                console.error(err);
            });
        },
            
        deleteComment:({ commit }, data) => {
            instance.delete('posts/'+ data.postId +'/comment/'+ data.commentId)
            .then(() => {
                instance.get('posts/' + data.postId + '/comments')
                .then((getResponse) => {
                    commit('DELETE_COMMENT', { newComments : getResponse.data, data: data})
                })
            })
            .catch((err) => {
                console.error(err);
            });
        },





    // -------------------  LIKES  -------------------
        addOrRemoveLike:({commit}, data) => {
            instance.post('posts/' + data.postId + '/like')
            .then((responseLike)=> {
                console.log("response Like : ", responseLike.data)

                instance.get('posts/' + data.postId)
                .then((response)=> {
                    console.log('response get post after like/dislike : ',response.data)

                    response.data.post.displayEditPost = false
                    response.data.post.displayInputComment = false
                    response.data.post.listUsersLike = false

                    response.data.post.Comments.forEach(comment => {
                        comment.displayEditComment = false
                        comment.displayDelComment = false
                    })

                    if (responseLike.data) {
                        response.data.post.userAlreadyLike = true
                    } else {
                        response.data.post.userAlreadyLike = false
                    }

                    console.log('respose after modif : ', response.data)
                    commit('EDIT_LIKE', { newPost : response.data.post, data:data})
                })
            })
            .catch((err) => {
                console.error(err);
            });
        },

    // ----------------- AFFICHAGE ---------------

        displayComments:({commit},postId) => {
            commit('DISPLAY_COMMENT', postId)
        },
        hideComments:({commit},postId) => {
            commit('HIDE_COMMENT', postId)
        },

        displayInputComments:({commit}, data) => {
            commit('DISPLAY_INPUT_COMMENT', data)
        },
        hideInputComments:({commit}, postId) => {
            commit('HIDE_INPUT_COMMENT', postId)
        },

        displayListUsersLike:({commit}, postId) => {
            commit('DISPLAY_LIST_USERS_LIKE', postId)
        },
        hideListUsersLike:({commit}, postId) => {
            commit('HIDE_LIST_USERS_LIKE', postId)
        },

        displayEditPost:({commit}, data) => {
            commit('DISPLAY_EDIT_POST', data)
        },
        hideEditPost:({ commit }, postId) => {
            commit('HIDE_EDIT_POST', postId)
        },

        displayEditComment:({commit}, data) => {
            commit('DISPLAY_EDIT_COMMENT', data)
        },
        hideEditComment:({commit}, data) => {
            commit('HIDE_EDIT_COMMENT', data)
        },

        displayDeleteComment:({commit}, data) => {
            commit('DISPLAY_DEL_COMMENT', data)
        },
        hideDeleteComment: ({commit}, data) => {
            commit('HIDE_DEL_COMMENT', data)
        }

    },
    //plugins: [createPersistedState()],
});

export default store;


