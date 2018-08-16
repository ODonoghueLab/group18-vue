<template>
  <v-container>
    <v-card>
    <v-toolbar>
      <v-toolbar-title>Login to {{ title }}</v-toolbar-title>
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
              <v-text-field hint="At least 6 characters"
                            v-model="rawPassword"
                            :append-icon="passwordHidden ? 'visibility' : 'visibility_off'"
                            :append-icon-cb="() => (passwordHidden = !passwordHidden)"
                            :type="passwordHidden ? 'password' : 'text'"
                            counter
                            label="Password"
                            :error-messages="errors.collect('rawPassword')"
                            v-validate="'required|min:6'"
                            data-vv-name="rawPassword"></v-text-field>
              <p>
                <router-link to="/forgotPassword">Forgot</router-link> your password? </p>
            </v-flex>
          </v-layout>
          <v-btn type="submit"
                 class="v-accent">Login</v-btn>

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
  name: 'Login',
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
      let payload = {
        email: this.user.email,
        rawPassword: this.rawPassword
      }
      console.log('> Login.submit', payload)
      let response = await auth.login(payload)
      console.log('> Login.submit response', response)

      if (response.result) {
        this.$router.push('/')
      } else {
        this.error = response.error.message
      }
    }
  }
}
</script>
