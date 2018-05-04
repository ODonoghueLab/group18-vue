<template>
  <div id='app'>
    <v-app>
      <navbar></navbar>
      <router-view></router-view>
    </v-app>
  </div>
</template>

<style>
@import 'http://fonts.googleapis.com/css?family=Roboto:300,400,500,700,400italic';
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
.menuable__content__active{
  z-index: 101 !important;
}
</style>

<script>
import Navbar from '@/components/Navbar.vue';
export default {
  name: 'app',
  components: { Navbar },
};
</script>

