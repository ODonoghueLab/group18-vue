<template>
  <form method="POST" action="http://localhost:8081/api/nobleGasBindings/search" @submit.prevent="search" class="v-layout">
    <v-card class="v-layout-item v-elevation-3">
      <v-toolbar>
        <v-toolbar-title>Query</v-toolbar-title>
      </v-toolbar>
      <v-card-text>
        <v-container fluid grid-list-xl>
        <v-layout  row wrap>
          <v-flex class=" xs12 sm6 md3">
            <v-text-field
              v-model="searchQuery.pdb"
              label="PDB"
              :error-messages="errors.collect('pdb')"
              v-validate="'max:4'"
              data-vv-name="pdb"
            ></v-text-field>
            <v-subheader>N Atoms</v-subheader>
              <v-text-field
                v-model="searchQuery.min_n_atoms"
                label="Min"
                :error-messages="errors.collect('min_n_atoms')"
                v-validate="'numeric'"
                data-vv-name="min_n_atoms"
            ></v-text-field>
              <v-text-field
                v-model="searchQuery.max_n_atoms"
                label="Max"
                :error-messages="errors.collect('max_n_atoms')"
                v-validate="'numeric'"
                data-vv-name="max_n_atoms"
            ></v-text-field>
          </v-flex>
          <v-flex class="  xs12 sm6 md3">  
              <v-subheader>
                Binding Site
              </v-subheader>  
              <v-select
                label="Select"
                :items="elements"
                v-model="searchQuery.element"
                :error-messages="errors.collect('element')"
                v-validate="''"
                data-vv-name="element"
              >
              </v-select> 
              <v-subheader>
                Binding Energy (kcal/mol)          
              </v-subheader>
              <v-text-field
                v-model="searchQuery.min_binding_energy"
                label="Min"
                :error-messages="errors.collect('min_binding_energy')"
                v-validate="'regex:^-?\\d*(\\.\\d+)?$'"
                data-vv-name="min_binding_energy"
              ></v-text-field>
              <v-text-field
                v-model="searchQuery.max_binding_energy"
                label="Max"
                :error-messages="errors.collect('max_binding_energy')"
                v-validate="'regex:^-?\\d*(\\.\\d+)?$'"
                data-vv-name="max_binding_energy"
              ></v-text-field>
          </v-flex>
          <v-flex class="  xs12 sm6 md3"> 
            <v-subheader>Protein</v-subheader>
            <v-text-field
              v-model="searchQuery.protein_type"
              label="Type"
              :error-messages="errors.collect('protein_type')"
              v-validate="''"
              data-vv-name="protein_type"
            ></v-text-field>
            <v-text-field
              v-model="searchQuery.protein_description"
              label="Description"
              :error-messages="errors.collect('protein_description')"
              v-validate="''"
              data-vv-name="protein_description"
            ></v-text-field>
          </v-flex>
          <v-flex class="  xs12 sm6 md3">
            <v-subheader>
              <v-checkbox
                label="Ligand"
                v-model="searchQuery.has_ligand"
                :error-messages="errors.collect('has_ligand')"
                v-validate="''"
                data-vv-name="has_ligand"
              ></v-checkbox>
            </v-subheader>   
            <v-text-field
              v-model="searchQuery.ligand"
              label="Component Id"
              :error-messages="errors.collect('ligand')"
              v-validate="'max:3'"
              data-vv-name="ligand"
            ></v-text-field>    
            <v-text-field
              v-model="searchQuery.ligand_name"
              label="Name"
              :error-messages="errors.collect('ligand_name')"
              v-validate="''"
              data-vv-name="ligand_name"
            ></v-text-field>   
          </v-flex>
        </v-layout>
        <v-btn type="submit" class="v-accent" >SEARCH</v-btn>
        <v-btn type="button" class="v-primary" @click="clearForm">Cancel</v-btn>
        </v-container>
      </v-card-text>
    </v-card>
  </form>
</template>
<script>
import { mapState, mapActions, mapMutations, mapGetters } from 'vuex';

export default {
  name: 'search-form',
  computed: {
    ...mapGetters([
      'isWorking',
      'isSubmitted',
      'searchQuery',
      'searchErrors',
      'elements',
    ]),
  },
  methods: {
    ...mapMutations(['SET_ISSUBMITTED', 'SET_SEARCHQUERY']),
    ...mapActions(['search']),
    clearForm() {
      this.SET_ISSUBMITTED(false);
      this.SET_SEARCHQUERY({});
      this.errors.clear();
      this.search();
    },
  },
};
</script>
<style scoped>

</style>
