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
        status:'',
        posts: '',

        post:''
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
        

        ALL_POSTS: function(state,payload) {
            state.posts = payload
        },

        GET_ONE_POST: (state,payload) => {
            state.post = payload
        }





    },



    actions: {
        
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



        getOnePost: ({commit}, postId) => {
            instance.get('posts/' + postId )
            .then( (response) => {
                console.log(response.data)
                commit('GET_ONE_POST', response.data)
            })
            .catch((err) => {
                console.error(err);
            });
        }















    },
    plugins: [createPersistedState()],
});

export default store;


