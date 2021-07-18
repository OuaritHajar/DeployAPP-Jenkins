import { createStore } from 'vuex'
import createPersistedState from "vuex-persistedstate";

const axios = require('axios');


let instance = axios.create({
    baseURL: 'http://localhost:3000/api/',
});

instance.defaults.headers.common['Authorization'] = `Bearer ${localStorage.token}`;

let user = localStorage.getItem('user');
if (!user) {
    user = {
        userId: -1,
        token: '',
    }; 
} else {
    if(user.userId != -1){
        try {
            user = JSON.parse(user);
            instance.defaults.headers.common['Authorization'] = `Bearer ${user.token}`;
        } catch (ex) {
            user = {
                userId: -1,
                token: '',
            };
        }
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
            localStorage.setItem('user', JSON.stringify(user));
            state.user = user;
        },
        STATUS: (state, status) => {
            state.status = status
        },
        LOG_OUT: (state) => {
            state.user = {
                userId: -1,
                token: '',
              }
            localStorage.clear()
            console.log(localStorage, user)
        },


        // ----------- PROFIL -----------------
        EDIT_PROFIL: (state, profil) => {
            state.userProfil.first_name = profil.first_name,
            state.userProfil.last_name = profil.last_name
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
            state.posts.splice(0, 0, newPost)
        },
        EDIT_POST: () => {},
        POST_DELETE:()=> {},
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
        DELETE_COMMENT: ()=> {},
        EDIT_COMMENT: () => {
            //state.post.comments = dataComment.description
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
                    localStorage.setItem('token', response.data.token);
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
            instance.put('users/' + data.userId, data) 
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
                console.log(response.data)
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
        },

        createPost:({commit},data) => {
            instance.post('posts', data)
            .then( (response) => {
                console.log(response.data)
                commit('CREATE_POST', response.data)
            })
            .catch((error) => {
                console.error(error)
            })
        },

        getOnePost: ({ commit }, postId) => {
            instance.get('posts/' + postId)
            .then((response)=> {
                response.data.displayEditPost = false
                response.data.displayInputComment = false
                response.data.listUsersLike = false

                response.data.Comments.forEach(comment => {
                    comment.displayEditComment = false
                })

                console.log('respose post : ', response.data)
                commit('GET_ONE_POST', response.data)
            })
        },

        editPost: ({ commit }, data) => {
            instance.put('posts/' + data.get('postId'), data )
            .then( (response) => {
                commit('EDIT_POST', response.data)
            })
            .catch((err) => {
                console.error(err);
            });
        },

        deletePost:({commit}, postId) => {
            instance.delete('posts/'+ postId )
            .then(()=>{
                commit('POST_DELETE')
            })
        },

        


    // -------------------  COMMENTS  -------------------
        newComment: ({commit}, data) => {
            instance.post('posts/'+ data.postId + '/comment', data )
            .then( (response) => {
                commit('NEW_COMMENT', { newComment :response.data, data: data})
            })
            .catch((err) => {
                console.error(err);
            });
        },

        editComment: ({ commit }, data) => {
            instance.put('posts/' + data.postId + '/comment/' + data.commentId, data)
            .then( (response) => {
                commit('EDIT_COMMENT', response.data)
            })
            .catch((err) => {
                console.error(err);
            });
        },
            
        deleteComment:({ commit }, data) => {
            instance.delete('posts/'+ data.postId +'/comment/'+ data.commentId)
            .then(() => {
                commit('DELETE_COMMENT')
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
    plugins: [createPersistedState()],
});

export default store;


