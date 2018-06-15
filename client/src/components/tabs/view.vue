<template>
  <div v-if="user.authenticated||this.pdb=='2bmm'"
       style="height:100%;">
    <v-container fluid
                 grid-list-xl>
      <v-layout v-if="user.authenticated"
                id="joleculeControls"
                row
                wrap>
        <v-flex sm3>
          <v-select multiple
                    label="Element"
                    :items="elementList"
                    v-model="elements"
                    :error-messages="errors.collect('element')"
                    v-validate="''"
                    data-vv-name="element"></v-select>
        </v-flex>
        <v-flex sm8>
          <v-select combobox
                    label="Search"
                    :items="querySelectItems"
                    v-model="query"
                    :filter="customFilter"
                    :error-messages="errors.collect('query')"
                    v-validate="''"
                    aria-placeholder="Space separated list of search terms. eg oxygen transport 1000:2000 -1.6"
                    hint="Space separated list of search terms. eg oxygen transport 1000:2000 -1.6"
                    persistent-hint
                    data-vv-name="query"
                    :loading="isWorking"
                    item-text="text"
                    item-value="value"
                    return-object
                    :search-input.sync="search"></v-select>
        </v-flex>
        <v-flex sm1>
          <v-select label="PDB History"
                    :items="pdbSelectItems"
                    v-model="pdb"
                    :error-messages="errors.collect('pdb')"
                    v-validate="'length:4'"
                    data-vv-name="pdb"
                    cache-items></v-select>
        </v-flex>
      </v-layout>
      <v-layout row
                wrap
                fill-height=true
                id="joleculeView">
        <v-flex xs12
                fill-height=true>
          <div id="jolecule">
          </div>
        </v-flex>
      </v-layout>
    </v-container>
  </div>
  <div v-else>{{this.loadErrorMessage}}</div>
</template>
<script>
import { mapMutations, mapGetters } from 'vuex';
import { initEmbedJolecule } from '../../jolecule/jolecule';
import { Validator } from 'vee-validate';
import rpc from '../../modules/rpc';

export default {
  computed: {
    ...mapGetters(['elementList', 'searchQuery']),
    isWorking: {
      get() {
        return this.$store.state.isWorking;
      },
      set(v) {
        this.$store.commit('SET_ISWORKING', v);
      }
    },
    elements: {
      get() {
        return this.$store.state.elements;
      },
      set(v) {
        if (Array.isArray(v)) {
          this.$store.commit('SET_ELEMENTS', v);
        }
      }
    },
    pdb: {
      get() {
        return this.$store.state.pdb;
      },
      set(v) {
        this.$store.commit('SET_PDB', v);
      }
    },
    user: function() {
      return this.$store.state.user;
    }
  },
  data() {
    return {
      query: {
        text: '',
        value: ''
      },
      embededJolecule: null,
      search: null,
      pdbSelectItems: [],
      querySelectItems: [],
      customFilter(item, queryText, itemText) {
        return itemText;
      },
      dataServers: null,
      loadedElements: [],
      isDisplayed: false,
      loadErrorMessage:
        'You need to be logged in to view any PDB file other than the example 2bmm'
    };
  },
  methods: {
    getElementIndex(element) {
      for (var i = 0; i < this.elementList.length; i += 1) {
        if (this.elementList[i]['value'] === element) {
          return i + 1;
        }
      }
      return -1;
    },
    addDataServer: function(dataServer) {
      let dataServerFn = eval(dataServer);
      this.embededJolecule.asyncAddDataServer(dataServerFn());
    },
    async querySelections(query) {
      this.isWorking = true;
      let limit = 100;
      let response = await rpc.rpcRun('getNobleGasBindingsByQuery', {
        limit,
        query
      });
      let searchResults = [];
      response.result.rows.forEach(row => {
        searchResults.push({
          text: `[${row.pdb}]:${row.protein_type} - ${
            row.protein_description
          } (${row.binding_energy} kcal/mol)`,
          value: row.pdb
        });
      });
      this.querySelectItems = searchResults;
      this.isWorking = false;
    },
    updateURL() {
      let host = window.location.href.split('/#')[0];
      let newURL =
        host + `/#/?pdb=${this.pdb}&elements=${this.elements.join(',')}`;
      if (window.location.href !== newURL) {
        window.history.pushState(null, '', newURL);
      }
    },
    loadElementDataServer(element) {
      if (this.loadedElements.includes(element) || !this.dataServers) {
        return;
      }
      let elementDataServer = this.dataServers.result[
        this.getElementIndex(element)
      ];
      this.addDataServer(elementDataServer);
      this.loadedElements.push(element);
    },
    async loadDataServers() {
      let payload = { pdb: this.pdb };
      try {
        this.loadErrorMessage = '';
        this.dataServers = await rpc.rpcRun('getDataServers', payload);
        if (this.dataServers.error) {
          console.error(this.dataServers.error);
          this.loadErrorMessage = this.dataServers.error.message;
          document.getElementById(
            'loading-message'
          ).innerHTML = this.loadErrorMessage;
        } else {
          let pdbDataServer = this.dataServers.result[0];
          this.addDataServer(pdbDataServer);
          this.elements.forEach(element => {
            this.loadElementDataServer(element);
          });
        }
      } catch (error) {
        alert(error);
      }
    },
    embedJolecule(tag) {
      if (document.getElementById(tag)) {
        document.getElementById(tag).innerHTML = '';
      }
      return jolecule.initEmbedJolecule({
        divTag: '#' + tag,
        viewId: '',
        viewHeight: 100,
        isLoop: false,
        isGrid: true,
        backgroundColor: '#cccccc',
        isEditable: false
      });
    },
    async reDisplayJolecule() {
      this.embededJolecule = this.embedJolecule('jolecule');
      this.isDisplayed = true;
      this.updateURL();
      this.loadedElements = [];
      this.pdbSelectItems.push(this.pdb);
      this.loadDataServers();
    },
    setParamValues() {
      let pdb = this.$route.query.pdb;
      let urlElements = this.$route.query.elements;
      let elements = [];
      if (urlElements) {
        urlElements = this.$route.query.elements.split(',');
        elements = urlElements.filter(element => {
          return this.getElementIndex(element) > -1;
        });
      }
      if (pdb && pdb > '') {
        this.pdb = pdb;
      }
      if (elements && elements.length > 0) {
        this.elements = elements;
      }
    },
    displayJolecule() {
      this.setParamValues();
      this.reDisplayJolecule();
    }
  },
  watch: {
    search(val) {
      val && this.querySelections(val);
    },
    query(val) {
      if (val.text && val.value) {
        this.pdbSelectItems = [this.pdb];
        this.pdb = val.value;
      }
    },
    elements(val) {
      console.log('local', 'element set to', val);
      this.updateURL();
      this.loadedElements.forEach(element => {
        let id = 'grid-button-' + element.toLowerCase();
        if (document.getElementById(id).style.backgroundColor) {
          document.getElementById(id).click();
        }
      });
      val.forEach(element => {
        console.log('local', 'selectedElement', element);
        let id = 'grid-button-' + element.toLowerCase();
        if (
          this.loadedElements.includes(element) &&
          !document.getElementById(id).style.backgroundColor
        ) {
          document.getElementById(id).click();
        } else {
          this.loadElementDataServer(element);
        }
      });
    },
    pdb: {
      handler() {
        if (this.isDisplayed) this.reDisplayJolecule();
      },
      deep: true
    },
    $route: {
      handler() {
        console.log('local', 'route change', this.$route, window.history);
        if (this.isDisplayed) this.reDisplayJolecule();
      },
      deep: true
    }
  },
  mounted() {
    this.displayJolecule();
  }
};
</script>

<style >
#joleculeControls {
  padding-top: 0px !important;
  padding-bottom: 0px !important;
}
#loading-message {
  font-size: 2em;
  padding: 15px 15px;
  width: 50%;
  color: #b4b4b4;
  background-color: rgba(102, 102, 102, 0.9);
}
.container.fluid.grid-list-xl {
  padding: 0px;
  height: 100%;
}
.container.fluid.grid-list-xl .layout {
  margin: auto;
}
#joleculeView {
  height: calc(100% - 74px);
}
#jolecule {
  height: 100%;
}
#joleculeView .flex,
#joleculeControls .flex {
  padding: 0px;
}
</style>
