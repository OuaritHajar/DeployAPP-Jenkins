import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    userId:''
  },
  mutations: {
    USER_ID(state, payload){
      state.userId = Number(payload)
    }
  },
  actions: {
    updateUserId(context, payload) {
      context.commit("USER_ID", payload)
    }
  },
  modules: {
  }
})
