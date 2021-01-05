<template>
  <div>
    <h1>Login</h1>
    <div class="about">
      <form @submit.prevent="register">
        <label for="email">Email</label>
        <input type="text" name="email" placeholder="Email..." v-model="email" />
        <p v-if="errors.email" class="error">{{ errors.email }}</p>
        <label for="password">Password</label>
        <input type="password" name="password" placeholder="Password..." v-model="password" />
        <p v-if="errors.password" class="error">{{ errors.password }}</p>
        <button>Login</button>
      </form>
    </div>
  </div>
</template>

<script>
import gql from 'graphql-tag';
import { mapErrorsToObject } from '../utils/funcs/mapErrorsToObject';

export default {
  data() {
    return {
      email: '',
      password: '',
      errors: {},
    };
  },
  methods: {
    async register() {
      const res = await this.$apollo.mutate({
        mutation: gql`
          mutation Login($email: String!, $password: String!) {
            login(options: { email: $email, password: $password }) {
              user {
                id
                email
                name
                username
              }
              errors {
                message
                field
              }
            }
          }
        `,

        variables: { email: this.email, password: this.password },
      });

      if (res.data.login.errors) {
        this.errors = mapErrorsToObject(res.data.login.errors);
      } else {
        this.errors = {};
        this.$store.state.user = res.data.login.user;
        this.$router.push('/');
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.about {
  display: flex;
  justify-content: center;

  form {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
  }

  .error {
    color: red;
  }
}
</style>
