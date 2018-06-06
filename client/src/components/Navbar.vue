<template>
  <v-toolbar dark>
    <v-layout>
      <v-flex xs2>
        <h2 class="v-title"
            style="
        padding-left: 1em;
        cursor: pointer;
        flex: 1"
            @click="home()">
          {{ title }}
        </h2>
      </v-flex>
      <v-flex xs8>
        <v-tabs>
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
      </v-flex>
      <v-flex xs2>
        <div v-if="isUser">
          <v-menu bottom
                  left
                  open-on-hover
                  v-if="user.authenticated">
            <v-btn slot="activator">
              {{user.name}}
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
      </v-flex>
    </v-layout>
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
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 0px;
}
</style>