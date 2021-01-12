<template>
  <div class="navUser" @click="click">
    <svg
      viewBox="0 0 250 250"
      xmlns="http://www.w3.org/2000/svg"
      class="userSvg"
    >
      <g fill="inherit">
        <path
          d="M146.8 142.6h-37.6c-31.1 0-56.5 25.3-56.5 56.5 0 5.2 4.2 9.4 9.4 9.4h131.8c5.2 0 9.4-4.2 9.4-9.4 0-31.2-25.3-56.5-56.5-56.5zM128 130.7c20.1 0 36.4-16.3 36.4-36.4v-9.4c0-20.1-16.3-36.4-36.4-36.4S91.6 64.8 91.6 84.9v9.4c0 20.1 16.3 36.4 36.4 36.4z"
        ></path>
      </g>
    </svg>
    <svg
      class="arrowDown"
      viewBox="0 0 20 20"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M14.17,9.35,10,13.53,5.83,9.35a.5.5,0,0,1,.35-.85h7.64a.5.5,0,0,1,.35.85"
      ></path>
    </svg>
  </div>
</template>

<script>
export default {
  props: {
    click: { required: false },
  },
};
</script>

<style lang="scss" scoped>
.navUser {
  width: 70px;
  display: flex;
  align-items: center;
  border-radius: 5px;
  border: 1px solid transparent;
  &:hover {
    border-color: #d1d1d1;
  }
  .userSvg {
    color: #878a8c;
    fill: #878a8c;
    width: 30px;
    height: 25px;
  }

  .arrowDown {
    width: 20px;
    color: #878a8c;
    fill: #878a8c;
  }
}
</style>
