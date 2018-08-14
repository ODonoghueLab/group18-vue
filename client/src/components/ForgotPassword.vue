<template>
  <v-container>
    <v-card>
    <v-toolbar>
      <v-toolbar-title>Forgot your password to {{ title }}?</v-toolbar-title>
    </v-toolbar>
    <v-card-text>
      <form novalidate
            v-on:submit.prevent="submit">
        <v-container fluid
                     grid-list-xl>
          <v-layout row
                    wrap>
            <v-flex class="xs12">
              <v-text-field v-model="user.email"
                            label="E-mail address"
                            :error-messages="errors.collect('email')"
                            v-validate="'email'"
                            data-vv-name="email"></v-text-field>
            </v-flex>
          </v-layout>
          <v-btn type="submit"
                 class="v-accent">Send password reset email</v-btn>
          <div v-if="error"
               style="color: red">
            {{ error }}
          </div>
          <div style="margin-top: 3em">
            New to {{ title }}? &nbsp;
            <router-link to="/register">Register</router-link>
          </div>
        </v-container>
      </form>
    </v-card-text>
  </v-card>
  </v-container>
</template>

<script>
import auth from '../modules/auth'
import config from '../config'

export default {
  name: 'ForgotPassword',
  data () {
    return {
      title: config.title,
      passwordHidden: true,
      rawPassword: '',
      error: ''
    }
  },
  computed: {
    user: {
      get () {
        return this.$store.state.user
      },
      set (u) {
        this.$store.commit('setUser', u)
      }
    }
  },
  methods: {
    async submit () {
      let payload = this.user.email
      console.log('> ForgotPassword.submit', payload)
      let response = await auth.forgotPassword(payload)
      console.log('> ForgotPassword.submit response', response)

      if (response.result) {
        this.$router.push('/')
      } else {
        this.error = response.error.message
      }
    }
  }
}
</script>
