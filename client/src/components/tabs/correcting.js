import { mapMutations, mapGetters } from 'vuex'
import { initEmbedJolecule } from '../../jolecule/main'
import { Validator } from 'vee-validate'
import rpc from '../../modules/rpc'

export default {
  computed: {
    ...mapGetters(['energyCutoffSets', 'elements', 'searchQuery']),
    isWorking: {
      get () {
        return this.$store.state.isWorking
      },
      set (v) {
        this.$store.commit('SET_ISWORKING', v)
      }
    },
    pdb: {
      get () {
        return this.$store.state.pdb
      },
      set (v) {
        this.$store.commit('SET_PDB', v)
      }
    },
    energyCutoffSet: {
      get () {
        return this.$store.state.energyCutoffSet
      },
      set (v) {
        if (v) {
          let value = v.value ? v.value : v
          if (this.isValidEnergyCutOffSet(value)) {
            this.$store.commit('SET_ENERGYCUTOFFSET', value)
          }
        }
      }
    }
  },
  data () {
    return {
      query: {
        text: '',
        value: ''
      },
      search: null,
      pdbSelectItems: [],
      querySelectItems: [],
      customFilter (item, queryText, itemText) {
        return itemText
      },
      localEnergyCutoffSets: []
    }
  },
  methods: {
    ...mapMutations(['SET_PDB', 'SET_ENERGYCUTOFFSET']),
    isValidEnergyCutOffSet: function (value) {
      let checkValue = value.value ? value.value : value
      return (
        checkValue == 'veryHigh' ||
        checkValue == 'high' ||
        checkValue == 'medium' ||
        checkValue == 'low' ||
        (checkValue <= -0.5 && checkValue >= -2.0)
      )
    },
    addDataServer: function ({ embededJolecule, dataServer }) {
      let dataServerFn = eval(dataServer)
      embededJolecule.asyncAddDataServer(dataServerFn())
    },
    async querySelections (query) {
      this.isWorking = true
      let limit = 100
      let response = await rpc.rpcRun('getNobleGasBindingsByQuery', {
        limit,
        query
      })
      let searchResults = []
      response.result.rows.forEach(row => {
        searchResults.push({
          text: `[${row.pdb}]:${row.protein_type} - ${
            row.protein_description
          } (${row.binding_energy} kcal/mol)`,
          value: row.pdb
        })
      })
      this.querySelectItems = searchResults
      this.isWorking = false
    },
    async reDisplayJolecule () {
      document.getElementById('jolecule').innerHTML = ''
      let j = initEmbedJolecule({
        divTag: '#jolecule',
        viewId: '',
        viewHeight: 100,
        isLoop: false,
        isGrid: true,
        isEditable: false
      })
      let newURL =
        window.location.protocol +
        '//' +
        window.location.host +
        `/#/view?pdb=${this.pdb}&cutoff=${this.energyCutoffSet}`
      console.log('local', 'newurl', newURL, window.location.href)
      if (window.location.href != newURL) {
        window.history.pushState(null, '', newURL)
        console.log('local', 'url updated', newURL)
      }
      this.pdbSelectItems.push(this.pdb)
      this.localEnergyCutoffSets.push(this.energyCutoffSet)
      let payload = { pdb: this.pdb, energyCutoffSet: this.energyCutoffSet }
      let dataServers = await rpc.rpcRun('getDataServers', payload)
      dataServers.result.forEach(dataServer => {
        this.addDataServer({
          embededJolecule: j,
          dataServer: dataServer
        })
      })
      // document.getElementById("jolecule-soup-display").style.height = "400px" //this is a hack that I need to fix with bosco: need to set height correctly
    },
    displayJolecule () {
      let pdb = this.$route.query.pdb
      let energyCutoffSet = this.$route.query.cutoff
      if (pdb && pdb > '') {
        this.SET_PDB(pdb)
      }
      if (energyCutoffSet && energyCutoffSet > '') {
        this.SET_ENERGYCUTOFFSET(energyCutoffSet)
      }
      this.localEnergyCutoffSets = this.energyCutoffSets
      this.localEnergyCutoffSets.push({
        text: this.energyCutoffSet,
        value: this.energyCutoffSet
      })
      this.reDisplayJolecule()
    }
  },
  watch: {
    search (val) {
      val && this.querySelections(val)
    },
    query (val) {
      if (val.text && val.value) {
        this.pdbSelectItems = [this.pdb]
        this.pdb = val.value
      }
    },
    energyCutoffSet: {
      handler () {
        this.reDisplayJolecule()
      },
      deep: true
    },
    pdb: {
      handler () {
        this.reDisplayJolecule()
      },
      deep: true
    },
    $route: {
      handler () {
        console.log('local', 'route change', this.$route, window.history)
        this.displayJolecule()
      },
      deep: true
    }
  },
  mounted () {
    Validator.extend('isValidEnergyCutOffSet', {
      getMessage: field => 'The ' + field + ' value is not a valid cutoff.',
      validate: value => {
        return this.isValidEnergyCutOffSet(value)
      }
    })
    this.displayJolecule()
  }
}
