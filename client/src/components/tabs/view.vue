<template>
  <div style="height:100%;">
    <v-container fluid
                 grid-list-xl>
      <v-layout id="joleculeControls"
                row
                wrap>
        <v-flex sm1>
          <v-select id="PDBHistory"
                    label="History"
                    :items="pdbSelectItems"
                    v-model="pdb"
                    :error-messages="errors.collect('pdb')"
                    v-validate="'length:4'"
                    data-vv-name="pdb"
                    cache-items></v-select>
        </v-flex>
        <v-flex sm11>
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
    <v-dialog v-model="loginNotificationDialog"
              max-width="500px">
      <v-card>
        <v-card-title>
          <v-toolbar card>
            <v-toolbar-title>Please consider logging in</v-toolbar-title>
          </v-toolbar>
        </v-card-title>
        <v-card-text>
          You have now looked up {{ this.pdbSelectItems.length }} PDBs and may benefit from the advanced search features.
        </v-card-text>
        <v-card-actions>
          <v-btn to='/login'>
            Login
          </v-btn>
          <v-btn to='/register'>
            Register
          </v-btn>
          <v-btn flat
                 @click.stop="loginNotificationDialog=false">Close</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>
<script>
import { mapMutations, mapGetters, mapActions } from "vuex";
import { initEmbedJolecule } from "../../jolecule/jolecule";
import { Validator } from "vee-validate";
import rpc from "../../modules/rpc";
import debugConsole from "../../modules/debugConsole";

const PROMPT_COUNT = 3;

export default {
  computed: {
    ...mapGetters(["elementList", "searchQuery", "errors"]),
    isWorking: {
      get() {
        return this.$store.state.isWorking;
      },
      set(v) {
        this.$store.commit("SET_ISWORKING", v);
      }
    },
    elements: {
      get() {
        return this.$store.state.jolecule.elements;
      },
      set(v) {
        if (Array.isArray(v)) {
          this.$store.commit("SET_ELEMENTS", v);
        }
      }
    },
    pdb: {
      get() {
        return this.$store.state.jolecule.pdb;
      },
      set(v) {
        this.$store.commit("SET_PDB", v);
      }
    },
    user: function() {
      return this.$store.state.user;
    }
  },
  data() {
    return {
      loginNotificationDialog: false,
      query: {
        text: "",
        value: ""
      },
      currentQueryId: 0,
      autocompleteDelay: 500, //time in ms to wait before sending query
      embededJolecule: null,
      search: null,
      pdbSelectItems: [],
      querySelectItems: [],
      customFilter(item, queryText, itemText) {
        return itemText;
      },
      dataServers: null,
      energyCutoffs: null,
      loadedElements: [],
      isDisplayed: false,
      loadErrorMessage:
        ""
    };
  },
  methods: {
    ...mapActions(["getDataServers", "getEnergyCutoffs", "querySelections"]),
    timeout(ms) {
      return new Promise(res => setTimeout(res, ms));
    },
    embedJolecule(tag) {
      if (this.embededJolecule) {
        this.embededJolecule.clear();
        return this.embededJolecule;
      }
      return jolecule.initEmbedJolecule({
        divTag: "#" + tag,
        viewId: "",
        viewHeight: 100,
        isLoop: false,
        isGrid: true,
        backgroundColor: "#cccccc",
        isEditable: false
      });
    },
    displayJolecule() {
      this.setParamValues();
      this.isDisplayed = true;
      if (this.pdb === "2bmm") {
        this.reDisplayJolecule();
      }
    },
    async reDisplayJolecule() {
      this.embededJolecule = this.embedJolecule("jolecule");
      this.isDisplayed = true;
      this.updateURL();
      this.loadedElements = [];
      this.pdbSelectItems.push(this.pdb);
      await this.loadDataServers();
      this.setupElements();
    },
    launchLoginDialog() {
      localStorage.setItem("pdbSelectItemsCount", this.pdbSelectItems.length);
      this.loginNotificationDialog = true;
    },
    setParamValues() {
      let pdb = this.$route.query.pdb;
      let urlElements = this.$route.query.elements;
      let elements = [];
      if (urlElements) {
        urlElements = this.$route.query.elements.split(",");
        elements = urlElements.filter(element => {
          return this.getElementIndex(element) > -1;
        });
      }
      if (pdb && pdb > "") {
        this.pdb = pdb;
      }
      if (elements && elements.length > 0) {
        this.elements = elements;
      }
      if (!this.elements || (this.elements && this.elements.length < 1)) {
        this.elements = ["Xe"];
      }
    },
    updateURL() {
      let host = window.location.href.split("/#")[0];
      let newURL =
        host + `/#/?pdb=${this.pdb}&elements=${this.elements.join(",")}`;
      if (window.location.href !== newURL) {
        window.history.pushState(null, "", newURL);
      }
    },
    async addDataServer(dataServer) {
      let dataServerFn = eval(dataServer);
      return this.embededJolecule.asyncAddDataServer(dataServerFn());
    },
    async loadDataServers() {
      this.loadErrorMessage = "Preparing data...";
      this.energyCutoffs = this.getEnergyCutoffs();
      this.dataServers = await this.getDataServers();
      document.getElementById(
        "loading-message"
      ).innerHTML = this.loadErrorMessage;
      let pdbDataServer = this.dataServers[0];
      await this.addDataServer(pdbDataServer);
      let dataServersToLoad = [];
      this.elements.forEach(element => {
        dataServersToLoad.push(this.loadElementDataServer(element));
      });
      return Promise.all(dataServersToLoad);
    },
    getElementIndex(element) {
      for (var i = 0; i < this.elementList.length; i += 1) {
        if (this.elementList[i]["value"] === element) {
          return i + 1;
        }
      }
      return -1;
    },
    async loadElementDataServer(element) {
      if (this.loadedElements.includes(element) || !this.dataServers) {
        return;
      }
      let elementDataServer = this.dataServers[this.getElementIndex(element)];
      let result = await this.addDataServer(elementDataServer);
      console.log("added element", element);
      this.setElementCutoff(element);
      this.loadedElements.push(element);
      return result;
    },
    async setElementCutoff(element) {
      let energyCutoffs = await this.energyCutoffs;
      let elementCutoff = energyCutoffs[this.getElementIndex(element) - 1];
      this.setCutoff(elementCutoff);
    },
    setCutoff(val) {
      let bCutoff = -1 * parseFloat(val);
      this.embededJolecule.controller.setGridCutoff(bCutoff);
      this.embededJolecule.gridControlWidget.update();
      console.log("bCutoff", bCutoff);
    },
    setupElements() {
      let y = 10;
      document.getElementById("grid-control-buttons").innerHTML = "";
      this.elementList.forEach(({ text, value }) => {
        this.embededJolecule.gridControlWidget.makeElemButton(value, y);
        let id = "grid-button-" + value.toLowerCase();
        document.getElementById(id).onclick = this.toggleElement;
        y += 40;
      });
    },
    async toggleElement(e) {
      let element = e.srcElement.innerText;
      let usedElements = [];
      for (const [key, value] of Object.entries(
        this.embededJolecule.soupView.soup.grid.isElem
      )) {
        if (value) usedElements.push(key);
      }
      this.elements = usedElements;
      if (this.loadedElements.includes(element)) {
        return;
      }
      await this.loadElementDataServer(element);
      this.setupElements();
    }
  },
  watch: {
    async search(val) {
      if (val) {
        this.lastAutoCompleteQueryStarted = new Date().getTime();
        await this.timeout(this.autocompleteDelay);
        let autoCompleteQueryStarted = new Date().getTime();
        if (
          autoCompleteQueryStarted - this.lastAutoCompleteQueryStarted <
          this.autocompleteDelay
        ) {
          return;
        }
        let queryId = ++this.currentQueryId;
        let result = await this.querySelections(val);
        if (result && this.currentQueryId === queryId) {
          this.querySelectItems = result;
        }
      }
    },
    query(val) {
      if (val.text && val.value) {
        debugConsole.log("updating PDB history", this.pdbSelectItems, this.pdb);
        this.pdbSelectItems.push(this.pdb);
        this.pdb = val.value;
      }
    },
    elements(val) {
      this.updateURL();
    },
    pdbSelectItems: {
      handler() {
        let uniqueItems = [...new Set(this.pdbSelectItems)];
        if (this.pdbSelectItems.length !== uniqueItems.length) {
          this.pdbSelectItems = uniqueItems;
          return;
        }
        if (this.pdbSelectItems.length > 0) {
          localStorage.setItem(
            "pdbSelectItems",
            JSON.stringify([...new Set(this.pdbSelectItems)])
          );
          if (
            !this.user.authenticated &&
            this.pdbSelectItems.length % PROMPT_COUNT === 0 &&
            this.pdbSelectItems.length !=
              localStorage.getItem("pdbSelectItemsCount")
          ) {
            this.launchLoginDialog();
          }
        }
      },
      deep: true
    },
    pdb: {
      handler() {
        if (this.isDisplayed) this.reDisplayJolecule();
      },
      deep: true
    },
    $route: {
      handler() {
        debugConsole.log("route change", this.$route, window.history);
        if (this.isDisplayed) this.reDisplayJolecule();
      },
      deep: true
    }
  },
  mounted() {
    this.displayJolecule();
  },
  beforeMount() {
    let pdbSelectedItems =
      JSON.parse(localStorage.getItem("pdbSelectItems")) || [];
    this.pdbSelectItems = pdbSelectedItems.filter(item => {
      return item;
    });
  }
};
</script>

<style >
#pdb,
#joleculeControls {
  padding-top: 0px !important;
  padding-bottom: 0px !important;
}
#loading-message {
  font-size: 2em;
  line-height: 1em;
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
  height: calc(100vh - 74px - 48px);
}
#jolecule {
  height: 100%;
}
#joleculeView .flex,
#joleculeControls .flex {
  padding: 0px;
}
#PDBHistory .input-group__selections,
#PDBHistory .input-group__details {
  display: none;
}
</style>
