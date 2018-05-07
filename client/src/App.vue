<template>
  <div id='app'>
    <v-app>
      <navbar></navbar>
      <router-view></router-view>
    </v-app>
  </div>
</template>

<style>
@import 'http://fonts.googleapis.com/css?family=Roboto:300,
  400,
  500,
  700,
  400italic';
@import 'http://fonts.googleapis.com/icon?family=Material+Icons';
@import 'vuetify/dist/vuetify.min.css';
@import 'http://jolecule.com/jolecule.css';
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 0px;
}
.menuable__content__active {
  z-index: 101 !important;
}
a.jolecule-button.element-He.active {
  background-color: #9ed2e4;
}
a.jolecule-button.element-Ne.active {
  background-color: #f79f7c;
}
a.jolecule-button.element-Ar.active {
  background-color: #7b86c2;
}
a.jolecule-button.element-Kr.active {
  background-color: #acd376;
}
a.jolecule-button.element-Xe.active {
  background-color: #5dc4be;
}
</style>

<script>
import Navbar from '@/components/Navbar.vue';
export default {
  name: 'app',
  components: { Navbar },
};
</script>

