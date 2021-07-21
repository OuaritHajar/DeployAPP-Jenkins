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
    }; 
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
        userProfil:'',
        posts: [],
        post:'',
    },


    getters: {
        get_user(state) {
            return state.user
        },
        get_status(state) {
            return state.status
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
        }
    },





    mutations: {
        // ----------------  CONNECTION  ----------------
        LOG_USER: (state, user) => {
            state.user = user;
        },
        STATUS: (state, status) => {
            state.status = status
        },
        LOG_OUT: (state) => {
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
        EDIT_PROFIL: (state, profil) => {
            state.userProfil = profil
        },
        GET_USER_PROFIL:(state, userProfil) => {
            state.userProfil = userProfil
        },
        

        // ---------------  POSTS  ----------------
        ALL_POSTS: (state, payload) => {
            state.posts = payload
        },
        GET_ONE_POST: (state, data) => {
            state.post = data
        },
        CREATE_POST: (state, newPost) => {
            console.log('new post : ',newPost)
            state.posts.splice(0, 0, newPost)
        },
        EDIT_POST: (state, data) => {
            console.log("mutation : edit post vue = ",data.vue)
            if(data.vue == "Post"){
                state.post = data.newPost
            } else {
                const LePost = state.posts.find(post => post.id === data.newPost.id)

                LePost.description = data.newPost.description
                LePost.title= data.newPost.title
                LePost.img_url = data.newPost.img_url
            }
        },
        ADD_REMOVE_LIKE:()=>{},


        // -----------------  COMMENTS  ---------------
        NEW_COMMENT: (state, data) => {
            if(data.data.vue == "Post"){
                state.post.Comments.push(data.newComment)
            } else {
                const LePost = state.posts.find(post => post.id === data.data.postId)
                LePost.Comments.push(data.newComment)
            }
        },
        DELETE_COMMENT: (state, data)=> {
            if(data.data.vue == "Post"){
                state.post.Comments = data.newComments
            } else {
                const LePost = state.posts.find(post => post.id === data.data.postId)
                LePost.Comments = data.newComments
            }
        },
        EDIT_COMMENT: (state, data) => {
            if(data.data.vue == "Post"){
                state.post.Comments = data.newComments
            } else {
                const LePost = state.posts.find(post => post.id === data.data.postId)
                LePost.Comments = data.newComments
            }
        },
        //GET_ONE_COMMENT:() => {
        //    //state.idCommentPost = data.commentId
        //},


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
            if(data.vue == "Post"){
                state.post.displayInputComment = true
            } else {
                const LePost = state.posts.find(post => post.id === data.postId)
                LePost.displayInputComment = true
            }
        },
        HIDE_INPUT_COMMENT:(state, data) => {
            if(data.vue == "Post"){
                state.post.displayInputComment = false
            } else {
                const LePost = state.posts.find(post => post.id === data.postId)
                LePost.displayInputComment = false
            }
        },

        DISPLAY_LIST_USERS_LIKE:(state, data) => {
            if(data.vue == "Post"){
                state.post.listUsersLike = true
            } else {
                const LePost = state.posts.find(post => post.id === data.postId)
                LePost.listUsersLike = true
            }
        },
        HIDE_LIST_USERS_LIKE:(state, data) => {
            if(data.vue == "Post"){
                state.post.listUsersLike = false
            } else {
                const LePost = state.posts.find(post => post.id === data.postId)
                LePost.listUsersLike = false
            }
        },

        DISPLAY_EDIT_POST:(state, data) => {
            if(data.vue == "Post"){
                state.post.displayEditPost = true
            } else {
                const LePost = state.posts.find(post => post.id === data.postId)
                LePost.displayEditPost = true
            }
        },
        HIDE_EDIT_POST:(state, data) => {
            if(data.vue == "Post"){
                state.post.displayEditPost = false
            } else {
                const LePost = state.posts.find(post => post.id === data.postId)
                LePost.displayEditPost = false
            }
        },

        //------------- AFFICHAGE EDIT COMMENT ------------
        DISPLAY_EDIT_COMMENT:(state, data) => {
            if(data.vue == "Post"){
                const LeComment = state.post.Comments.find(comment => comment.id == data.commentId)
                LeComment.displayEditComment = true
            } else {
                const LePost = state.posts.find(post => post.id === data.postId)
                const LeComment = LePost.Comments.find(comment => comment.id == data.commentId)
                LeComment.displayEditComment = true
            }
        },
        HIDE_EDIT_COMMENT:(state, data) => {
            if(data.vue == "Post"){
                const LeComment = state.post.Comments.find(comment => comment.id == data.commentId)
                LeComment.displayEditComment = false
            } else {
                const LePost = state.posts.find(post => post.id === data.postId)
                const LeComment = LePost.Comments.find(comment => comment.id == data.commentId)
                LeComment.displayEditComment = false
            }
        },
        
    },



    actions: {

    // --------------  CONNECTION  ---------
        signup: ({commit}, userInfos) => {
            return new Promise((resolve,reject) => {
                instance.post('users/signup', userInfos)
                .then((response) => {
                    commit('STATUS', '' )
                    resolve(response)
                })
                .catch((error) => {
                    console.log('erreur : ',error)
                    commit('STATUS', 'Erreur, vérifier vos informations' )
                    reject(error)
                })
            })
        },

        login: ({ commit }, userInfos) => {
            commit('STATUS', 'Loading');
            return new Promise(( resolve,reject ) => {
                instance.post('users/login', userInfos)
                .then(function (response) {
                    instance.defaults.headers.common['Authorization'] = `Bearer ${response.data.token}`;
                    
                    commit('STATUS', '' )
                    commit('LOG_USER', response.data);
                    resolve(response)
                    console.log('isAdmin : ',response.data)
                })
                .catch(function (error) {
                    commit('STATUS', 'Erreur de connection')
                    reject(error)
                });
            })
        },

        logout: (context) => {
            context.commit("LOG_OUT")
        },



        
    // --------------  PROFIL  ---------------

        editUser:({ commit }, data) => {
            instance.put('users/' + data.get('id'),  data
            ) 
            
            .then( (response) => {
                commit('EDIT_PROFIL', response.data)
            })
            .catch((error) => {
                console.error(error)
            })
        },

        deleteUser:({ commit }, userId) => {
            instance.delete('users/' + userId)
            .then( () => {
                commit('LOG_OUT')
            })
        },


    //------------------  PROFIL USERS  ------------------
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

        

    // ---------------- POSTS  ------------------
        getAllPosts: ({commit}) => {
            instance.get('posts')
            .then((response) => {
                response.data.allPosts.forEach(post => {
                    post.displayComment = false
                    post.displayInputComment = false
                    post.displayEditPost = false
                    post.listUsersLike = false
                    post.Comments.forEach(comment => {
                        comment.displayEditComment = false
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
            instance.post('posts', data)
            .then( (createResponse) => {
                console.log(createResponse.data)
                
                instance.get('posts/' + createResponse.data.id)
                .then((getResponse) => {
                    console.log("postResponse : ",getResponse)
                    
                    getResponse.data.displayComment = false
                    getResponse.data.displayInputComment = false
                    getResponse.data.displayEditPost = false
                    getResponse.data.listUsersLike = false
                    getResponse.data.userAlreadyLike = false

                    commit('CREATE_POST', getResponse.data)
                })
            })
            .catch((error) => {
                console.error(error)
            })
        },

        getOnePost: ({ commit }, postId) => {
            instance.get('posts/' + postId)
            .then((response)=> {
                response.data.post.displayEditPost = false
                response.data.post.displayInputComment = false
                response.data.post.listUsersLike = false

                response.data.post.Comments.forEach(comment => {
                    comment.displayEditComment = false
                })

                response.data.post.userAlreadyLike = false
                response.data.post.Likes.forEach(like => {
                    if (like.UserId === response.data.user.id) {
                        response.data.post.userAlreadyLike = true
                    }
                })

                console.log('respose post : ', response.data)
                commit('GET_ONE_POST', response.data.post)
            })
        },

        editPost: ({ commit }, data) => {
            instance.put('posts/' + data.get('postId'), data )
            .then( () => {
                instance.get('posts/' + data.get('postId'))
                .then((response) => {
                    
                        response.data.displayComment = false
                        response.data.displayInputComment = false
                        response.data.displayEditPost = false
                        response.data.listUsersLike = false
                        response.data.userAlreadyLike = false
                        
                        response.data.Comments.forEach(comment => {
                            comment.displayEditComment = false
                        })
                    
                    console.log("response front All posts",response.data)
                    commit('EDIT_POST', {newPost :response.data, vue: data.get('vue')})
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
            instance.delete('posts/'+ postId )
            .then(()=>{
                instance.get('posts')
                .then((response) => {
                    response.data.forEach(post => {
                        post.displayComment = false
                        post.displayInputComment = false
                        post.displayEditPost = false
                        post.listUsersLike = false
                        
                        post.Comments.forEach(comment => {
                            comment.displayEditComment = false
                        })
                    })
                    console.log("response front All posts",response.data)
                    commit('ALL_POSTS', response.data)
                })
                .catch((error) => {
                    console.error(error);
                });
            })
        },

        


    // -------------------  COMMENTS  -------------------
        newComment: ({commit}, data) => {
            instance.post('posts/'+ data.postId + '/comment', data )
            .then( (createResponse) => {
                console.log("create Comment response : ",createResponse)

                let addUser = {
                    User : {
                        'first_name' : data.user.first_name,
                        'last_name' : data.user.last_name,
                        'avatarUrl' : data.user.avatarUrl
                    }
                }
                    
                
                const newComment = Object.assign(createResponse.data, addUser)


                commit('NEW_COMMENT', { newComment :newComment, data: data})
            })
            .catch((err) => {
                console.error(err);
            });
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
        addOrRemoveLike:({commit}, postId) => {
            instance.post('posts/' + postId + '/like')
            .then(()=> {
                commit('ADD_REMOVE_LIKE')
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

    },
    //plugins: [createPersistedState()],
});

export default store;


