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
        commentsPost:'',
        idCommentPost:'',  // utilité a verifier
        commentsOfPost:''
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
            return state.post
        },
        get_comments_post(state) {
            return state.commentsPost
        },
        get_comments_post_forum(state) {
            return state.commentsOfPost
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

        STATUS: (state, statusRetourne) => {
            state.status = statusRetourne
        },
        
        LOG_OUT: (state) => {
            state.user = {
                userId: -1,
                token: '',
              }
            localStorage.clear()
            console.log(localStorage)
            console.log(user)
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

        GET_ONE_POST: (state, payload) => {
            state.post = payload.post,
            state.commentsPost = payload.comments
        },
        
        CREATE_POST: (state, newPost) => {
            state.posts.splice(0, 0, newPost)
        },

        EDIT_POST: (state, dataPost) => {
            state.post = dataPost
        },
        POST_DELETE:()=> {},
        ADD_REMOVE_LIKE:()=>{},


        //ADD_REMOVE_LIKE:(state, data)=> {
        //    const LePost = state.posts.find(post => post.id === data.postId)
        //    console.log(LePost)
        //    LePost.userAlreadyLike = data.response
        //},

        // -----------------  COMMENTS  ---------------
        NEW_COMMENT: (state, newComment) => {
            state.commentsPost.push(newComment)
        },
        
        GET_ONE_COMMENT:(state, data) => {
            state.idCommentPost = data.commentId
        },
        EDIT_COMMENT: (state, dataComment) => {
            state.post.comments = dataComment.description
        },
        GET_COMMENTS_POST:(state, comments) => {
            state.commentsOfPost = comments
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

        DISPLAY_INPUT_COMMENT:(state, postId) => {
            const LePost = state.posts.find(post => post.id === postId)
            LePost.displayInputComment = true
        },
        HIDE_INPUT_COMMENT:(state, postId) => {
            const LePost = state.posts.find(post => post.id === postId)
            LePost.displayInputComment = false
        },

        DISPLAY_LIST_USERS_LIKE:(state, postId) => {
            const LePost = state.posts.find(post => post.id === postId)
            LePost.listUsersLike = true
        },
        HIDE_LIST_USERS_LIKE:(state, postId) => {
            const LePost = state.posts.find(post => post.id === postId)
            LePost.listUsersLike = false
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
                    post.listUsersLike = false
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

        getOnePost: ({commit}, postId) => {
            instance.get('posts/' + postId )
            .then( (response) => {
                console.log("response front OnePost : ", response.data)
                commit('GET_ONE_POST', response.data)
            })
            .catch((err) => {
                console.error(err);
            });
        },

        editPost: ({state, commit}, data) => {
            instance.put(`posts/${state.post.id}`, data )
            .then( (response) => {
                console.log(response.data)
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
            instance.post('posts/'+ data.postId + '/comment', data)
            .then( (response) => {
                console.log(response.data)
                commit('NEW_COMMENT', response.data)
            })
            .catch((err) => {
                console.error(err);
            });
        },

        getCommentsPost: ({commit},postId) => {
            instance.get('posts/' + postId + '/comments')
            .then( (response) => {

                console.log("reponse front comments du post",response.data)
                commit('GET_COMMENTS_POST', response.data)

            })
            .catch((err) => {
                console.error(err);
            });
        },

        editComment: ({state, commit}, data) => {
            commit('GET_ONE_COMMENT', data)
            instance.put(`posts/${state.post.id}/comment/${state.idCommentPost}`, data)
            .then( (response) => {
                console.log(response.data)
                commit('EDIT_COMMENT', response.data)
            })
            .catch((err) => {
                console.error(err);
            });
        },
            
        deleteComment:({ state, commit },data) => {
            commit('GET_ONE_COMMENT', data)
            instance.delete(`posts/${state.post.id}/comment/${state.idCommentPost}`)
            .then( (response) => {
                console.log(response)
                //commit('DELETE_COMMENT', response.data)
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

        displayInputComments:({commit}, postId) => {
            commit('DISPLAY_INPUT_COMMENT', postId)
        },
        hideInputComments:({commit}, postId) => {
            commit('HIDE_INPUT_COMMENT', postId)
        },

        displayListUsersLike:({commit}, postId) => {
            commit('DISPLAY_LIST_USERS_LIKE', postId)
        },
        hideListUsersLike:({commit}, postId) => {
            commit('HIDE_LIST_USERS_LIKE', postId)
        }



    },
    plugins: [createPersistedState()],
});

export default store;


