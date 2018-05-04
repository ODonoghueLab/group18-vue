<template>
  <v-card>
    <v-toolbar>
      <v-toolbar-title>{{ title }}</v-toolbar-title>
    </v-toolbar>
    <v-card-text>
      <form novalidate
            class="login-screen"
            v-on:submit.prevent="submit">
        <v-container fluid
                     grid-list-xl>
          <v-layout row
                    wrap>
            <v-flex class="xs12">
              <v-text-field v-model="name"
                            label="User name"
                            :error-messages="errors.collect('name')"
                            v-validate="'name'"
                            data-vv-name="name"></v-text-field>
              <v-text-field v-model="email"
                            label="E-mail address"
                            :error-messages="errors.collect('email')"
                            v-validate="'email'"
                            data-vv-name="email"></v-text-field>
              <v-text-field hint="At least 6 characters"
                            v-model="rawPassword"
                            :append-icon="passwordHidden ? 'visibility' : 'visibility_off'"
                            :append-icon-cb="() => (passwordHidden = !passwordHidden)"
                            :type="passwordHidden ? 'password' : 'text'"
                            counter
                            label="New Password"
                            :error-messages="errors.collect('Password')"
                            v-validate="'required|min:6'"
                            data-vv-name="Password"></v-text-field>
              <v-text-field hint="At least 6 characters"
                            v-model="rawConfirmPassword"
                            :append-icon="confirmPasswordHidden ? 'visibility' : 'visibility_off'"
            
                            :append-icon-cb="() => (confirmPasswordHidden = !confirmPasswordHidden)"
            
                            :type="confirmPasswordHidden ? 'password' : 'text'"
                            counter
                            label="Confirm New Password"
                            :error-messages="errors.collect('Confirm_Password')"
                            v-validate="'required|confirmed:Password'"
                            data-vv-name="Confirm_Password"></v-text-field>
              <div class="alert alert-danger">{{loginMessage}}</div>
            </v-flex>
          </v-layout>
          <v-btn type="submit"
                 class="v-accent">Save</v-btn>

          <div v-if="error"
               style="color: red">
            {{ error }}
          </div>
        </v-container>
      </form>
    </v-card-text>
  </v-card>
</template>

<script>
import auth from '../modules/auth';
import _ from 'lodash';

export default {
  name: 'EditUser',
  data() {
    let result = {};
    _.assign(result, this.$store.state.user);
    _.assign(result, {
      title: 'Edit Your Details',
      rawPassword: '',
      passwordHidden: true,
      rawPasswordConfirm: '',
      confirmPasswordHidden: true,
      error: '',
    });
    return result;
  },
  methods: {
    async submit() {
      this.error = '';

      let payload = {};
      const keys = ['id', 'name', 'email', 'rawPassword', 'rawPasswordConfirm'];
      for (let key of keys) {
        if (this.$data[key]) {
          payload[key] = this.$data[key];
        }
      }

      let response = await auth.update(payload);
      if (response.result) {
        this.error = 'User updated';
      } else {
        console.log('> EditUser.submit fail', response);
        this.error = response.error.message;
      }
    },
  },
};
</script>
