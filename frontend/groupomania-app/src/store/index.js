import { createStore } from 'vuex'
import createPersistedState from "vuex-persistedstate";

const axios = require('axios');


let instance = axios.create({
    baseURL: 'http://localhost:3000/api/',
});




const store = createStore({
    state: {
        userId:-1,
        status:''
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
        USER_ID(state, payload) {
            state.userId = payload
        },
        
        LOG_OUT: function (state) {
            state.userId = -1,
            localStorage.removeItem('token');
            console.log(localStorage)
        },

        USER_INFOS: function (state, userInfos) {
            state.userInfos = userInfos;
        },

        STATUS: function(state, statusRetourne) {
            state.status = statusRetourne
        }
    },



    actions: {
        login: ({ commit }, userInfos) => {
            return new Promise(( resolve,reject ) => {
                instance.post('users/login', userInfos)
                .then(function (response) {
                    console.log(response);
                    localStorage.setItem('token', response.data.token);
                    commit('USER_ID', response.data.userId);
                    commit('STATUS', '' )
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
        }
    },
    plugins: [createPersistedState()],
});

export default store;


