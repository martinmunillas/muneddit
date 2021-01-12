<template>
  <div class="login">
    <Button value="✖" :click="closeLogin" class="closeButton" size="l" />
    <img
      src="https://www.redditstatic.com/accountmanager/bbb584033aa89e39bad69436c504c9bd.png"
      alt="reddit"
    />
    <div class="content">
      <h1 class="title">Login</h1>
      <p>
        By continuing, you agree to our
        <span class="userInfo">User Agreement</span> and
        <span class="userInfo">Privacy Policy</span>.
      </p>
      <Spacer />
      <form @submit.prevent="login">
        <InputField
          type="text"
          name="email"
          placeholder="Email..."
          v-model="email"
          label="Email"
          :error="errors.email"
          :animated="true"
        />
        <Spacer />
        <InputField
          type="password"
          name="password"
          placeholder="Password..."
          v-model="password"
          label="Password"
          :animated="true"
          :error="errors.password"
        />
        <Spacer />
        <Button value="Log In" />
      </form>
      <div class="otherInfo">
        <Spacer />
        <p>
          Forgot your <a href="forgot-password" class="password"> password</a> ?
        </p>
        <br />
        <p>
          New to Reddit?
          <span class="signUp" @click="toSignUp"> SIGN UP</span>
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
import Spacer from './Spacer.vue';

export default {
  components: {
    InputField,
    Button,
    Spacer,
  },
  data() {
    return {
      email: '',
      password: '',
      errors: {},
    };
  },
  props: {
    closeLogin: {
      required: true,
    },
    toSignUp: {
      required: true,
    },
  },
  methods: {
    async login() {
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
.login {
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

  .userInfo {
    color: #0079d3;
    cursor: pointer;
  }

  .closeButton {
    position: absolute;
    right: 0px;
    top: 0px;
    background-color: transparent;
    color: grey;
  }

  .content {
    width: 250px;
    padding: 50px 20px;
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    text-align: left;

    .title {
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
        cursor: pointer;
      }
    }
  }
}
</style>
