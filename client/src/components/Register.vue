<template>
  <v-container>
    <v-card>
    <v-toolbar>
      <v-toolbar-title>Register to {{ title }}</v-toolbar-title>
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
                            ref="password"
                            name="password"
                            :append-icon="passwordHidden ? 'visibility' : 'visibility_off'"
                            :append-icon-cb="() => (passwordHidden = !passwordHidden)"
                            :type="passwordHidden ? 'password' : 'text'"
                            counter
                            label="Password"
                            :error-messages="errors.collect('password')"
                            v-validate="'required|min:6'"
                            data-vv-name="password"
                            data-vv-delay="300"></v-text-field>
              <v-text-field hint="At least 6 characters"
                            v-model="rawPasswordConfirm"
                            :append-icon="confirmPasswordHidden ? 'visibility' : 'visibility_off'"
                            ref="password_confirmation"
                            :append-icon-cb="() => (confirmPasswordHidden = !confirmPasswordHidden)"
                            :type="confirmPasswordHidden ? 'password' : 'text'"
                            counter
                            label="Confirm Password"
                            :error-messages="errors.collect('password_confirmation')"
                            target="password"
                            v-validate="'required|confirmed:password'"
                            data-vv-name="password_confirmation"
                            data-vv-delay="300"></v-text-field>
            </v-flex>
          </v-layout>
          <v-btn type="submit"
                 class="v-accent">Register</v-btn>

          <div v-if="error"
               style="color: red">
            {{ error }}
          </div>
        </v-container>
      </form>
    </v-card-text>
  </v-card>
  </v-container>
</template>

<script>
import auth from "../modules/auth";
import config from "../config";

export default {
  name: "Register",
  data() {
    return {
      title: config.title,
      name: "",
      email: "",
      rawPassword: "",
      passwordHidden: true,
      rawPasswordConfirm: "",
      confirmPasswordHidden: true,
      user: auth.user,
      error: ""
    };
  },
  methods: {
    async submit() {
      let payload = {
        name: this.$data.name,
        email: this.$data.email,
        rawPassword: this.$data.rawPassword,
        rawPasswordConfirm: this.$data.rawPasswordConfirm
      };
      let response = await auth.register(payload);

      if (response.result) {
        console.log("> Register.submit register success", response.result);
        response = await auth.login({
          email: payload.email,
          rawPassword: payload.rawPassword
        });
      }

      if (response.result) {
        console.log("> Register.submit login success", response.result);
        this.$router.push("/");
      } else {
        console.log("> Register.submit fail", response.error);
        this.error = response.error.message;
      }
    }
  }
};
</script>
