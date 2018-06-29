import Vue from 'vue'
import Vuex from 'vuex'
import jolecule from './store/jolecule'
import search from './store/search'

Vue.use(Vuex)

const store = new Vuex.Store({
  modules: {
    jolecule: jolecule,
    search: search
  },
  state: {
    user: {
      authenticated: false
    },
    // below are group18
    loginMessage: '',
    isWorking: false
  },
  getters: {
    errors: state => state.errors,
    loginMessage: state => state.loginMessage,
    isWorking: state => state.isWorking
  },
  mutations: {
    setUser(state, user) {
      state.user = user
    },
    // below are group18 specific
    SET_ISWORKING: (state, isWorking) => {
      state.isWorking = isWorking
    }
  }
})

export default store