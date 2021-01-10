<template>
  <form @submit.prevent="changePassword">
    <p v-if="errors.token">{{ errors.token.message }}</p>
    <InputField
      :error="errors.newPassword"
      name="newPassword"
      placeholder="New Password..."
      type="password"
      v-model="newPassword"
    />
    <Button value="Change password" type="submit" />
  </form>
</template>

<script>
import gql from 'graphql-tag';
import InputField from '../components/InputField.vue';
import { changePassword } from '../graphql/ChangePasswordGraphQL';
import Button from '../components/Button.vue';

export default {
  components: {
    InputField,
    Button,
  },
  data() {
    return {
      newPassword: '',
      token: this.$route.query.q,
      errors: {},
    };
  },
  methods: {
    async changePassword() {
      await this.$apollo.mutate({
        mutation: gql(changePassword),
        variables: { newPassword: this.newPassword, token: this.token },
      });
    },
  },
};
</script>

<style lang="scss" scoped></style>
