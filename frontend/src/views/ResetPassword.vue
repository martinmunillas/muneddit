<template>
  <h1>{{ q }}</h1>
</template>

<script>
export default {
  data() {
    return {
      q: this.$route.query.q,
    };
  },
};
</script>

<style lang="scss" scoped></style>
