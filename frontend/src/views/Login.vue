<template>
  <div class="about">
    <img
      src="https://www.redditstatic.com/accountmanager/bbb584033aa89e39bad69436c504c9bd.png"
      alt="reddit"
    />
    <div class="content">
      <h1 class="login">Login</h1>
      <p>By continuing, you agree to our User Agreement and Privacy Policy.</p>
      <form @submit.prevent="register">
        <InputField
          type="text"
          name="email"
          placeholder="Email..."
          v-model="email"
          label="Email"
          :error="errors.email"
        />
        <InputField
          type="password"
          name="password"
          placeholder="Password..."
          v-model="password"
          label="Password"
          :error="errors.password"
        />
        <Button value="Log In" />
      </form>
      <div class="otherInfo">
        <p>
          Forgot your <a href="forgot-password" class="password"> password</a> ?
        </p>
        <br />
        <p>
          New to Reddit?
          <router-link to="/register" class="signUp"> SIGN UP</router-link>
        </p>
      </div>
    </div>
  </div>
</template>

<script>
import gql from 'graphql-tag';
import { mapErrorsToObject } from '../utils/funcs/mapErrorsToObject';
import { login } from '../graphql/LoginGraphQL';
import InputField from '../components/InputField.vue';
import Button from '../components/Button.vue';

export default {
  components: {
    InputField,
    Button,
  },
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
        mutation: gql(login),

        variables: { email: this.email, password: this.password },
      });

      if (res.data.login.errors) {
        this.errors = mapErrorsToObject(res.data.login.errors);
      } else {
        this.errors = {};
        window.location.href = '/';
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.about {
  display: flex;
  background: #fff;
  border-radius: 4px;
  box-shadow: 1px 7px 20px 2px rgba(0, 0, 0, 0.4);
  height: 650px;
  left: 50%;
  overflow: hidden;
  position: fixed;
  top: 50%;
  transform: translate(-50%, -50%);
  width: 850px;
  z-index: 1;

  .content {
    width: 250px;

    .login {
      font-size: 18px;
      font-weight: 500;
      line-height: 22px;
      margin: 20px 0;
    }

    .otherInfo {
      font-size: 13px;

      a {
        text-decoration: none;
      }

      .password {
        color: #2591e4;
      }

      .signUp {
        color: #0079d3;
        font-weight: 600;
      }
    }
  }
}
</style>
