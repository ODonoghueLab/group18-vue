<template>
  <div>
    <v-card class="md-layout-item md-elevation-3">
      <v-toolbar>
        <v-toolbar-title>Results</v-toolbar-title>
      </v-toolbar>

      <v-card-text>
        <v-data-table :headers="headers"
                      :items="searchResults"
                      :search="search"
                      :pagination.sync="pagination"
                      :total-items="totalResults"
                      :loading="isWorking"
                      hide-actions
                      class="elevation-1">
          <template slot="no-data">
            <v-alert :value="true"
                     color="error"
                     icon="warning">
              No matching binding sites found for this search `{{this.searchErrors}}`
            </v-alert>
          </template>
          <template slot="items"
                    slot-scope="props">
            <td class="text-xs-right">{{ props.item.element }}</td>
            <td class="text-xs-right">
              <a :href="`/#/?pdb=${ props.item.pdb }`">{{ props.item.pdb }}</a>
            </td>
            <td class="text-xs-right">{{ props.item.n_atoms }}</td>
            <td class="text-xs-right">{{ props.item.binding_energy }}</td>
            <td class="text-xs-right">{{ props.item.ligand_name }}</td>
            <td class="text-xs-right">{{ props.item.ligand }}</td>
            <td class="text-xs-right">{{ props.item.protein_type }}</td>
            <td class="text-xs-right">{{ props.item.protein_description }}</td>
          </template>
        </v-data-table>
        <v-layout>
          <v-flex xs12
                  sm9
                  offset-sm3
                  md6
                  offset-md6
                  lg3
                  offset-lg9>
            <v-layout>
              <v-flex xs2>
                <v-select :items="pageSizes"
                          v-model="pagination.rowsPerPage"
                          label="Page Size"
                          single-line></v-select>
              </v-flex>
              <v-flex xs10>
                <v-pagination v-model="pagination.page"
                              :length="pages"
                              total-visible="7"></v-pagination>
              </v-flex>
            </v-layout>
          </v-flex>
        </v-layout>
      </v-card-text>
    </v-card>
  </div>
</template>

<script>
import { mapState, mapActions, mapMutations, mapGetters } from 'vuex';
import debugConsole from '../../modules/debugConsole'

export default {
  data() {
    return {
      headers: [
        { text: 'Element', value: 'element' },
        { text: 'PDB', value: 'pdb' },
        { text: 'N Atoms', value: 'n_atoms' },
        { text: 'Binding Energy (kcal/mol)', value: 'binding_energy' },
        { text: 'Ligand Name', value: 'ligand_name' },
        { text: 'Ligand Id', value: 'ligand' },
        { text: 'Type', value: 'protein_type' },
        { text: 'Description', value: 'protein_description' },
      ],
      pageSizes: [5, 10, 25],
    };
  },
  computed: {
    ...mapGetters([
      'isWorking',
      'searchQuery',
      'searchErrors',
      'searchResults',
      'totalResults',
    ]),
    pagination: {
      get() {
        return this.$store.state.search.searchPagination;
      },
      set(v) {
        this.$store.commit('SET_SEARCHPAGINATION', v);
      },
    },
    pages() {
      debugConsole.log('pagination for pages', this.pagination);
      return this.pagination.rowsPerPage
        ? Math.ceil(this.pagination.totalItems / this.pagination.rowsPerPage)
        : 0;
    },
  },
  methods: {
    ...mapMutations(['SET_ISSUBMITTED', 'SET_SEARCHPAGINATION']),
    ...mapActions(['search']),
    onSort(value) {
      this.search();
      return value;
    },
  },
  watch: {
    pagination: {
      handler() {
        this.search();
      },
      deep: true,
    },
  },
};
</script>
<style scoped>

</style>
