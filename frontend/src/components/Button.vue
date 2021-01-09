<template>
  <button :type="type" :class="`button ${color + variant} ${size}`">
    {{ value }}
  </button>
</template>

<script>
export default {
  props: {
    color: {
      required: false,
      default: 'blue',
    },
    value: {
      required: true,
    },
    type: {
      required: false,
      default: 'submit',
    },
    variant: {
      required: false,
      default: 'primary',
    },
    size: {
      required: false,
      default: 'm',
    },
  },
};
</script>

<style lang="scss" scoped>
.button {
  font-size: 16px;
  font-weight: 600;
  border-radius: 50px;
  border: none;
  cursor: pointer;
  outline: none;
}
// sizes

.s {
  max-width: 150px;
  padding: 4px 8px;
}

.m {
  max-width: 200px;
  padding: 6px 12px;
}

.l {
  max-width: 250px;
  padding: 10px 20px;
}

// colors
.blueprimary {
  background: #0079d3;
  color: #ffffff;

  &:hover {
    background-color: #2591e4;
  }
}

.bluesecondary {
  background-color: transparent;
  border: 1px solid #0079d3;
  color: #0079d3;

  &:hover {
    border-color: #2591e4;
    color: #2591e4;
  }
}
</style>
