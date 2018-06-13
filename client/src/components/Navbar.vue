<template>
  <v-toolbar dark
             color="grey darken-4"
             dense>
    <v-toolbar-title style="cursor: pointer;"
                     @click="home()">
      <span class="group18_title">
        <span class="letter1">G</span>
        <span class="letter2">r</span>
        <span class="letter3">o</span>
        <span class="letter4">u</span>
        <span class="letter5">p</span>
        <span class="numbers">18</span>
      </span>
    </v-toolbar-title>
    <v-spacer></v-spacer>
    <v-tabs dark
            color="grey darken-4">
      <v-tab v-show="user.authenticated"
             id="tab-home"
             to="/"
             router>Home
      </v-tab>
      <v-tab v-show="user.authenticated"
             id="tab-search"
             to="/search"
             router>Search
      </v-tab>
      <v-tab id="tab-about"
             to="/about"
             router>About
      </v-tab>
      <v-tab v-show="!user.authenticated"
             id="tab-login"
             to="/login"
             router>Login
      </v-tab>
    </v-tabs>
    <v-spacer></v-spacer>
    <div v-if="isUser">
      <v-menu bottom
              left
              open-on-hover
              v-if="user.authenticated">
        <v-btn slot="activator"
               color="grey darken-4">
          {{user.name}}
          <v-icon dark>arrow_drop_down</v-icon>
        </v-btn>
        <v-list>
          <v-list-tile @click="editUser">
            <v-list-tile-title>Edit User</v-list-tile-title>
          </v-list-tile>
          <v-list-tile @click="logout">
            <v-list-tile-title>Logout</v-list-tile-title>
          </v-list-tile>
        </v-list>
      </v-menu>
    </div>
  </v-toolbar>
</template>

<script>
import auth from '../modules/auth';
import config from '../config';

export default {
  name: 'navbar',
  data() {
    return {
      title: config.title,
      isUser: config.isUser
    };
  },
  computed: {
    user: function() {
      return this.$store.state.user;
    }
  },
  methods: {
    editUser() {
      this.$router.push('/edit-user');
    },
    home() {
      this.$router.push('/');
    },
    async logout() {
      await auth.logout();
      this.$router.push('/login');
    }
  }
};
</script>
<style scoped>
@font-face {
  font-family: Clip;
  src: url('/static/assets/Clip.ttf');
}
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 0px;
}
.group18_title {
  font-size: 0;
}
.group18_title span {
  font-size: 24px;
  font-family: Clip;
  font-style: italic;
}
.tabs {
  width: 50%;
}
.letter1 {
  font-weight: 200;
  text-shadow: 0 0 8px #f59f7f;
  color: #f59f7f;
}
.letter2 {
  font-weight: 100;
  text-shadow: 0 0 5px #add27a;
  color: #add27a;
}
.letter3 {
  font-weight: 100;
  text-shadow: 0 0 5px #61c4be;
  color: #61c4be;
}
.letter4 {
  font-weight: 100;
  text-shadow: 0 0 5px #a0d2e3;
  color: #a0d2e3;
}
.letter5 {
  font-weight: 100;
  text-shadow: 0 0 5px #7b87c0;
  color: #7b87c0;
}
</style>