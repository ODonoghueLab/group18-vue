<template>
  <v-card>
    <v-toolbar>
      <v-toolbar-title>Users</v-toolbar-title>
    </v-toolbar>
    <v-card-text>
      <v-list>
        <v-list-item v-for="user of users"
                     :key="user.id">
          {{ user.name }} - {{user.email}}
          <v-button @click="deleteUser(user.id)">
            <v-icon v-mini>
              delete
            </v-icon>
          </v-button>
        </v-list-item>
      </v-list>
    </v-card-text>
  </v-card>
</template>

<script>
import rpc from '../modules/rpc';
import config from '../config';

export default {
  name: 'AdminUser',
  data() {
    return {
      title: config.title,
      users: [],
    };
  },
  async mounted() {
    let response = await rpc.rpcRun('adminGetUsers');
    if (response.result) {
      console.log('> AdminUsers.mounted users', response.result.users);
      this.users = response.result.users;
    }
  },
  methods: {
    async deleteUser(userId) {
      let response = await rpc.rpcRun('adminDeleteUser', userId);
      if (response.result) {
        console.log('> AdminUsers.deleteUser remaining', response.result.users);
        this.users = response.result.users;
      }
    },
  },
};
</script>
