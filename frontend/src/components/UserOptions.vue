<template>
  <div class="userOptions" @click="logout">
    Logout 🡆
  </div>
</template>

<script>
import gql from 'graphql-tag';
import { logout } from '../graphql/LogoutGraphQL';

export default {
  components: {},
  methods: {
    async logout() {
      await this.$apollo.mutate({
        mutation: gql(logout),
      });
      document.location.reload();
    },
  },
};
</script>

<style lang="scss" scoped>
.userOptions {
  display: flex;
  background: #fff;
  border-radius: 4px;
  box-shadow: 1px 7px 20px 2px rgba(0, 0, 0, 0.4);
  overflow: hidden;
  position: fixed;
  width: 100px;
  padding: 10px;
  z-index: 1;
  top: 45px;
  right: 30px;
  cursor: pointer;
}
</style>
