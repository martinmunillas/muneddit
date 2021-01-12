<template>
  <div class="login">
    <Button value="✖" :click="closeRegister" class="closeButton" size="l" />
    <img
      src="https://www.redditstatic.com/accountmanager/bbb584033aa89e39bad69436c504c9bd.png"
      alt="reddit"
    />
    <div class="content">
      <h1 class="title">Sign Up</h1>
      <p>
        By continuing, you agree to our
        <span class="userInfo">User Agreement</span> and
        <span class="userInfo">Privacy Policy</span>.
      </p>
      <form @submit.prevent="register">
        <Spacer />
        <InputField
          type="text"
          name="email"
          placeholder="Email..."
          v-model="email"
          label="Email"
          :error="errors.email"
        />
        <Spacer />
        <InputField
          type="password"
          name="password"
          placeholder="Password..."
          v-model="password"
          label="Password"
          :error="errors.password"
        />
        <Spacer />
        <InputField
          type="password"
          name="confirmPassword"
          placeholder="Confirm Password..."
          v-model="confirmPassword"
          label="Confirm Password"
          :error="errors.confirmPassword"
        />
        <Spacer />
        <Button value="Sign Up" type="submit" />
      </form>
      <div class="otherInfo">
        <Spacer />
        <p>
          Already a redditor?
          <span @click="toLogin" class="signUp"> LOG IN</span>
        </p>
      </div>
    </div>
  </div>
</template>

<script>
import gql from 'graphql-tag';
import { mapErrorsToObject } from '../utils/funcs/mapErrorsToObject';
import { register } from '../graphql/RegisterGraphQL';
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
      confirmPassword: '',
      errors: {},
    };
  },
  props: {
    closeRegister: {
      required: true,
    },
    toLogin: {
      required: true,
    },
  },
  methods: {
    async register() {
      if (this.password !== this.confirmPassword) {
        this.errors = { confirmPassword: 'Passwords should match' };
        return;
      }
      const res = await this.$apollo.mutate({
        mutation: gql(register),

        variables: { email: this.email, password: this.password },
      });

      if (res.data.register.errors) {
        this.errors = mapErrorsToObject(res.data.register.errors);
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
