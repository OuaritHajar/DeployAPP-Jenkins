import { createStore } from 'vuex'

const store = createStore({
  state: {
    userId:'10',
    title: "vueX store",
    notes: []
  },
  getters: {
    user_id(state){
      return state.userId
    },
    totalNotes(state) {
      return state.notes.length
    }
  },
  mutations: {
    USER_ID(state, payload){
      state.userId = payload
    },
    SAVE_NOTE(state, title) {
      state.notes.push(title)
    }
  },
  actions: {
    updateUserId({commit}, payload) {
      commit("USER_ID", payload)
    },
    saveNote({commit}, title) {
      commit('SAVE_NOTE', title)
    }
  }
});

export default store;


