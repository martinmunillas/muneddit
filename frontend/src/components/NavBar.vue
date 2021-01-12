<template>
  <nav id="nav">
    <Overlay v-if="login || register" />

    <router-link to="/" class="logo">
      <img
        src="https://logodownload.org/wp-content/uploads/2018/02/reddit-logo.png"
        alt="Reddit"
      />
    </router-link>
    <SearchInput v-model="search" />
    <div class="buttons">
      <Button
        value="Log In"
        variant="secondary"
        :click="openLogin"
        v-if="!me"
      />
      <Button value="Sign Up" :click="openRegister" v-if="!me" />
      <p v-if="me">{{ me.username }}</p>
      <NavUser :click="toggleUser" v-if="me" />

      <UserOptions v-if="user" />
      <Login
        v-if="login"
        :closeLogin="closeLogin"
        :toSignUp="fromLoginToRegister"
      />
      <Register
        v-if="register"
        :closeRegister="closeRegister"
        :toLogin="fromRegisterToLogin"
      />
    </div>
  </nav>
</template>

<script>
import gql from 'graphql-tag';
import { meGQL } from '../graphql/MeGraphQl';
import { logout as logoutQuery } from '../graphql/LogoutGraphQL';
import Button from '../components/Button';
import SearchInput from './SearchInput.vue';
import NavUser from './NavUser.vue';
import Login from './Login.vue';
import Register from './Register.vue';
import Overlay from './Overlay.vue';
import UserOptions from './UserOptions.vue';

export default {
  name: 'NavBar',
  components: {
    Button,
    SearchInput,
    NavUser,
    Login,
    Register,
    Overlay,
    UserOptions,
  },
  data() {
    return {
      search: '',
      login: false,
      register: false,
      user: false,
    };
  },
  apollo: {
    me: gql(meGQL),
  },
  props: {
    msg: String,
  },
  methods: {
    openLogin() {
      this.login = true;
    },

    closeLogin() {
      this.login = false;
    },

    openRegister() {
      this.register = true;
    },

    closeRegister() {
      this.register = false;
    },

    toggleUser() {
      this.user = !this.user;
    },

    async logout() {
      await this.$apollo.mutate({
        mutation: gql(logoutQuery),
      });

      window.location.href = '/login';
    },

    fromRegisterToLogin() {
      this.register = false;
      this.login = true;
    },

    fromLoginToRegister() {
      this.register = true;
      this.login = false;
    },
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
#nav {
  padding: 10px 20px;
  height: 48px;
  background-color: #ffffff;
  display: flex;
  justify-content: space-between;
  align-items: center;

  .logo {
    width: 95px;
    display: flex;
    align-items: center;

    img {
      max-width: 100%;
    }
  }

  .buttons {
    display: flex;
    align-items: center;

    button {
      width: 120px;
      margin: 0 10px;
    }
  }
}
</style>
