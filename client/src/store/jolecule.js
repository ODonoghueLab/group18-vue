import rpc from '../modules/rpc'


const jolecule = {
  state: {
    pdb: '2bmm',
    pdbSelectItems: [],
    dataServers: [],
    elementList: [{
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
    elements: ["Xe"],
  },
  getters: {
    pdb: state => state.pdb,
    pdbSelectItems: state => state.pdbSelectItems,
    elementList: state => state.elementList,
    elements: state => state.elements
  },
  mutations: {
    SET_ELEMENTS: (state, elements) => {
      state.elements = elements
    },
    SET_PDB: (state, pdb) => {
      state.pdb = pdb
    },
    SET_pdbSelectItems: (state, pdbSelectItems) => {
      console.log("pdbSelectItems before", pdbSelectItems)

      function onlyUnique(value, index, self) {
        return self.indexOf(value) === index;
      }
      state.pdbSelectItems = pdbSelectItems.filter(onlyUnique)
      console.log("pdbSelectItems after", pdbSelectItems)
    },
    SET_DATASERVERS: (state, dataServers) => {
      state.dataServers = dataServers
    }
  },
  actions: {
    async getDataServers({
      state
    }) {
      try {
        let payload = {
          pdb: state.pdb
        };
        state.loadErrorMessage = ""
        let dataServers = await rpc.rpcRun("publicGetDataServers", payload)
        if (dataServers.error) {
          console.error(dataServers.error);
          state.loadErrorMessage = dataServers.error.message
        } else {
          return dataServers.result;
        }
      } catch (error) {
        state.loadErrorMessage += error
      }
    },
    async getEnergyCutoffs({
      state
    }) {
      try {
        let payload = {
          pdb: state.pdb
        };
        let energyCutoffs = await rpc.rpcRun("publicGetEnergyCutoffs", payload);
        if (energyCutoffs.error) {
          this.loadErrorMessage += energyCutoffs.error.message;
        } else {
          return energyCutoffs.result
        }
      } catch (error) {
        state.loadErrorMessage += error
      }
    },
    async downloadPDBFiles({
      state,
      commit
    }) {
      let payload = {
        pdb: state.pdb
      };
      commit('SET_ISDOWNLOADING', true)
      let response = await rpc.rpcDownload("downloadPDBFiles", payload);
      commit('SET_ISDOWNLOADING', false)
      if (response.error) {
        this.loadErrorMessage += response.error.message;
      }
    },
    async downloadMapFiles({
      state,
      commit
    }) {
      let payload = {
        pdb: state.pdb,
        elements: state.elements
      };
      commit('SET_ISDOWNLOADING', true)
      let response = await rpc.rpcDownload("downloadMapFiles", payload);
      commit('SET_ISDOWNLOADING', false)
      if (response.error) {
        this.loadErrorMessage += response.error.message;
      }
    },
    async downloadReadme({
      state
    }) {
      let payload = {
        pdb: state.pdb
      };
      let response = await rpc.rpcDownload("downloadReadme", payload);
      if (response.error) {
        this.loadErrorMessage += response.error.message;
      }
    }
  }
}

export default jolecule