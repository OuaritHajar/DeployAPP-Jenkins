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

const store = createStore({
    state: {
        user:'',
        userProfil:'',
        status:'',
        posts: [],
        post:'',
        commentsPost:'',
        idCommentPost:''
    },


    getters: {
        user_id(state) {
            return state.userId
        },
        get_status(state) {
            return state.status
        }
    },





    mutations: {
        // ----------------  CONNECTION  ----------------
        LOG_USER(state, user) {
            instance.defaults.headers.common['Authorization'] = `Bearer ${user.token}`;
            localStorage.setItem('user', JSON.stringify(user));
            state.user = user;
            console.log(user)
        },

        STATUS: function(state, statusRetourne) {
            state.status = statusRetourne
        },
        
        LOG_OUT: function (state) {
            state.user = {
                userId: -1,
                token: '',
              }
            localStorage.removeItem('user');

            console.log(localStorage)
            console.log(user)
        },


        

        // ----------- PROFIL -----------------
        GET_USER_PROFIL: (state, userProfil) => {
            state.userProfil = userProfil
        },
        EDIT_USER_PROFIL: (state, userProfil) => {
            state.userProfil.first_name = userProfil.first_name,
            state.userProfil.last_name = userProfil.last_name
        },
        



        // ---------------  POSTS  ----------------
        ALL_POSTS: function(state,payload) {
            state.posts = payload
        },

        GET_ONE_POST: (state,payload) => {
            state.post = payload.post,
            state.commentsPost = payload.comments
        },

        CREATE_POST: (state,newPost) => {
            state.posts.post.push(newPost)
        },
        EDIT_POST: (state, dataPost) => {
            state.post = dataPost
        },
        NEW_COMMENT: (state, newComment) => {
            state.commentsPost.push(newComment)
        },
        
        GET_ONE_COMMENT:(state, data) => {
            state.idCommentPost = data.commentId
        },
        EDIT_COMMENT: (state, dataComment) => {
            state.post.comments = dataComment.description
        }



    },



    actions: {

    // --------------  CONNECTION  ---------
        signup: ({commit},userInfos) => {
            return new Promise((resolve,reject) => {
                instance.post('users/signup', userInfos)
                .then((response) => {
                    commit('STATUS', '' )
                    resolve(response)
                })
                .catch((error) => {
                    commit('STATUS', 'Not created' )
                    reject(error)
                })
            })
        },

        login: ({ commit }, userInfos) => {
            commit('STATUS', 'loading');
            return new Promise(( resolve,reject ) => {
                instance.post('users/login', userInfos)
                .then(function (response) {
                    localStorage.setItem('token', response.data.token);
                    commit('STATUS', '' )
                    commit('LOG_USER', response.data);
                    resolve(response)
                })
                .catch(function (error) {
                    commit('STATUS', 'Connection error')
                    reject(error)
                });
            })
        },

        logout: (context) => {
            context.commit("LOG_OUT")
        },





        
    // --------------  PROFIL  ---------------

    getUserProfil: ({state, commit}) => {
        instance.get(`users/${state.user.userId}`)
        .then( (response) => {
            console.log(response.data)
            commit('GET_USER_PROFIL', response.data)
        })
        .catch((error) => {
            console.error(error)
        })
    },

    editUser:({state, commit}, data) => {
        instance.put(`users/${state.user.userId}`, data) 
        .then( (response) => {
            console.log("editUser",response.data)
            commit('EDIT_USER_PROFIL', response.data)
        })
        .catch((error) => {
            console.error(error)
        })
    },




        

    // ---------------- POSTS  ------------------
        getAllPosts: ({commit}) => {
            instance.get('posts')
            .then((response) => {
                commit('ALL_POSTS', response.data)
                console.log(response.data)
            })
            .catch((error) => {
                console.error(error);
            });
        },

        createPost:({commit},data) => {
            instance.post('posts', data)
            .then( (response) => {
                console.log(response)
                commit('CREATE_POST', response.data)
            })
            .catch((error) => {
                console.error(error)
            })
        },

        getOnePost: ({commit}, postId) => {
            instance.get('posts/' + postId )
            .then( (response) => {
                console.log(response.data)
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

        



    // -------------------  COMMENTS  -----------------


        newComment: ({state, commit}, data) => {
            instance.post(`posts/${state.post.id}/comment`, data)
            .then( (response) => {
                console.log(response.data)
                commit('NEW_COMMENT', response.data)
            })
            .catch((err) => {
                console.error(err);
            });
        },

        editComment: ({state, commit}, data) => {
            commit('GET_ONE_COMMENT', data)
            instance.put(`posts/${state.post.id}/comment/${state.idCommentPost}`,
            data)
                .then( (response) => {
                console.log(response.data)
                commit('EDIT_COMMENT', response.data)


            })
            .catch((err) => {
                console.error(err);
            });



            
        },
            













    },
    plugins: [createPersistedState()],
});

export default store;


