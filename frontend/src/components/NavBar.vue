<template>
  <nav id="nav">
    <router-link to="/" class="logo">
      <img
        src="https://logodownload.org/wp-content/uploads/2018/02/reddit-logo.png"
        alt="Reddit"
      />
    </router-link>
    <SearchInput v-model="search" />
    <div class="buttons">
      <Button value="Log In" variant="secondary" />
      <Button value="Sign Up" />
      <NavUser />
    </div>
  </nav>
</template>

<script>
import gql from 'graphql-tag';
import { me } from '../graphql/MeGraphQl';
import { logout as logoutQuery } from '../graphql/LogoutGraphQL';
import Button from '../components/Button';
import SearchInput from './SearchInput.vue';
import NavUser from './NavUser.vue';

export default {
  name: 'NavBar',
  components: {
    Button,
    SearchInput,
    NavUser,
  },
  data() {
    return {
      search: '',
    };
  },
  apollo: {
    me: gql(me),
  },
  props: {
    msg: String,
  },
  methods: {
    async logout() {
      await this.$apollo.mutate({
        mutation: gql(logoutQuery),
      });

      window.location.href = '/login';
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

    button {
      width: 120px;
      margin: 0 10px;
    }
  }
}
</style>
