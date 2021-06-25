import { createStore } from 'vuex'


export default createStore({
  state: {
    userId:''
  },
  mutations: {
    USER_ID(state, payload){
      state.userId = payload
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
