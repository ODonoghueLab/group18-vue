import Vue from 'vue'
import Vuex from 'vuex'
import rpc from './modules/rpc'

Vue.use(Vuex)

const store = new Vuex.Store({
  state: {
    user: {
      authenticated: false
    },
    // below are group18
    loginMessage: '',
    isWorking: false,
    isSearchSubmitted: false,
    searchQuery: {},
    searchPagination: {
      sortBy: 'pdb',
      descending: false,
      rowsPerPage: 10,
      totalItems: 0
    },
    searchResults: [],
    searchErrors: [],
    totalResults: 0,
    pdb: '2bmm',
    energyCutoffSet: 'dynamic20',
    dataServers: [],
    elements: [{
        value: 'He',
        text: 'Helium'
      },
      {
        value: 'Ne',
        text: 'Neon'
      },
      {
        value: 'Ar',
        text: 'Argon'
      },
      {
        value: 'Kr',
        text: 'Krypton'
      },
      {
        value: 'Xe',
        text: 'Xenon'
      }
    ],
    energyCutoffSets: [{
        value: 'dynamic20',
        text: 'dynamic20'
      }, {
        value: 'veryHigh',
        text: 'veryHigh'
      },
      {
        value: 'high',
        text: 'high'
      },
      {
        value: 'medium',
        text: 'medium'
      },
      {
        value: 'low',
        text: 'low'
      }
    ]
  },
  getters: {
    errors: state => state.errors,
    loginMessage: state => state.loginMessage,
    isWorking: state => state.isWorking,
    isSearchSubmitted: state => state.isSearchSubmitted,
    searchQuery: state => state.searchQuery,
    searchPagination: state => state.searchPagination,
    searchResults: state => state.searchResults,
    searchErrors: state => state.searchErrors,
    totalResults: state => state.totalResults,
    pdb: state => state.pdb,
    energyCutoffSet: state => state.energyCutoffSet,
    energyCutoffSets: state => state.energyCutoffSets,
    elements: state => state.elements
  },
  mutations: {
    setUser(state, user) {
      state.user = user
    },
    // below are group18 specific
    SET_ISWORKING: (state, isWorking) => {
      state.isWorking = isWorking
    },
    SET_ISSEARCHSUBMITTED: (state, isSearchSubmitted) => {
      state.isSearchSubmitted = isSearchSubmitted
    },
    SET_PDB: (state, pdb) => {
      state.pdb = pdb
    },
    SET_ENERGYCUTOFFSET: (state, energyCutoffSet) => {
      state.energyCutoffSet = energyCutoffSet
    },
    SET_SEARCHQUERY: (state, searchQuery) => {
      state.searchQuery = searchQuery
    },
    SET_SEARCHPAGINATION: (state, searchPagination) => {
      state.searchPagination = searchPagination
    },
    SET_DATASERVERS: (state, dataServers) => {
      state.dataServers = dataServers
    },
    SET_SEARCHRESULTS: (state, searchResults) => {
      state.searchResults = searchResults
    },
    SET_SEARCHERRORS: (state, searchErrors) => {
      state.searchErrors = searchErrors
    },
    SET_TOTALRESULTS: (state, totalResults) => {
      state.totalResults = totalResults
    }
  },
  actions: {
    async refreshDataServers({
      commit,
      state
    }) {
      let payload = {
        pdb: this.pdb,
        energyCutoffSet: this.energyCutoffSet
      }
      let dataServers = await rpc.rpcRun('getDataServers', payload)
      commit('SET_DATASERVERS', dataServers)
    },
    async search({
      commit,
      state
    }) {
      if (!state.searchQuery || !state.searchPagination) {
        commit('SET_SEARCHERRORS', 'No query found')
        return
      }
      const {
        sortBy,
        descending,
        page,
        rowsPerPage
      } = state.searchPagination
      let searchQuery = state.searchQuery
      let searchPagination = state.searchPagination
      commit('SET_SEARCHPAGINATION', searchPagination)
      commit('SET_ISWORKING', true)
      commit('SET_SEARCHERRORS', '')
      searchQuery['limit'] = rowsPerPage
      searchQuery['offset'] = (page - 1) * rowsPerPage
      searchQuery['sort'] = sortBy ?
        `${sortBy} ${descending ? 'DESC' : 'ASC'}` :
        ''

      commit('SET_SEARCHQUERY', searchQuery)
      const searchResponse = await rpc.rpcRun('getNobleGasBindingsByQuery',
        searchQuery)
      if (searchResponse.error) {
        commit('SET_TOTALRESULTS', 0)
        commit('SET_SEARCHRESULTS', {})
        // TODO: need to improve error message
        commit('SET_SEARCHERRORS', JSON.stringify(searchResponse.data.error,
          null,
          2))
      } else {
        commit('SET_TOTALRESULTS', searchResponse.result.count)
        commit('SET_SEARCHRESULTS', searchResponse.result.rows)
        if (state.totalResults === 0) {
          commit(
            'SET_SEARCHERRORS',
            `Try a different set of search terms.${JSON.stringify(
              searchQuery,
              null,
              2
            )}`
          )
        }
      }
      searchPagination.totalItems = state.totalResults
      commit('SET_SEARCHPAGINATION', searchPagination)
      commit('SET_ISWORKING', false)
    },
    async updatePDB({
      commit,
      dispatch
    }, pdb) {
      commit('SET_PDB', pdb)
      await dispatch('refreshDataServers')
    },
    async updateEnergyCutOffSet({
      commit,
      dispatch
    }, energyCutoffSet) {
      commit('SET_ENERGYCUTOFFSET', energyCutoffSet)
      await dispatch('refreshDataServers')
    },
    async updateView({
      commit,
      dispatch
    }, {
      pdb,
      energyCutoffSet
    }) {
      commit('SET_PDB', pdb)
      commit('SET_ENERGYCUTOFFSET', energyCutoffSet)
      await dispatch('refreshDataServers')
    }
  }
})

export default store