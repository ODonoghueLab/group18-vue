import rpc from '../modules/rpc'

const search = {
  state: {
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
  },
  getters: {
    isSearchSubmitted: state => state.isSearchSubmitted,
    searchQuery: state => state.searchQuery,
    searchPagination: state => state.searchPagination,
    searchResults: state => state.searchResults,
    searchErrors: state => state.searchErrors,
    totalResults: state => state.totalResults
  },
  mutations: {
    SET_ISSEARCHSUBMITTED: (state, isSearchSubmitted) => {
      state.isSearchSubmitted = isSearchSubmitted
    },
    SET_SEARCHQUERY: (state, searchQuery) => {
      state.searchQuery = searchQuery
    },
    SET_SEARCHPAGINATION: (state, searchPagination) => {
      state.searchPagination = searchPagination
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
      searchQuery['sort'] = sortBy ? `${sortBy} ${descending ? 'DESC' : 'ASC'}` : ''
      commit('SET_SEARCHQUERY', searchQuery)
      const searchResponse = await rpc.rpcRun('publicGetNobleGasBindingsByQuery', searchQuery)
      if (searchResponse.error) {
        commit('SET_TOTALRESULTS', 0)
        commit('SET_SEARCHRESULTS', {})
        // TODO: need to improve error message
        commit('SET_SEARCHERRORS', JSON.stringify(searchResponse.data.error, null, 2))
      } else {
        commit('SET_TOTALRESULTS', searchResponse.result.count)
        commit('SET_SEARCHRESULTS', searchResponse.result.rows)
        if (state.totalResults === 0) {
          commit(
            'SET_SEARCHERRORS',
            `Try a different set of search terms.${JSON.stringify(searchQuery,null, 2)}`
          )
        }
      }
      searchPagination.totalItems = state.totalResults
      commit('SET_SEARCHPAGINATION', searchPagination)
      commit('SET_ISWORKING', false)
    },
    async querySelections({
      state,
      commit
    }, query) {
      commit('SET_ISWORKING', true)
      let limit = 100;
      let response = await rpc.rpcRun("publicGetNobleGasBindingsByQuery", {
        limit,
        query
      });
      let searchResults = [];
      response.result && response.result.rows.forEach(row => {
        searchResults.push({
          text: `[${row.pdb}]:${row.protein_type} - ${
            row.protein_description
          } (${row.binding_energy} kcal/mol)`,
          value: row.pdb
        });
      });
      commit('SET_ISWORKING', false)
      return searchResults;
    }
  }
}

export default search