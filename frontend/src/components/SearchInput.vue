<template>
  <div class="search">
    <form class="searchForm">
      <svg
        class="searchIcon"
        viewBox="0 0 20 20"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M15.59,13.91l2.78,2.69a1.25,1.25,0,1,1-1.74,1.8l-2.82-2.73a8,8,0,1,1,1.78-1.76ZM14.64,9.2A5.45,5.45,0,1,0,9.2,14.64,5.45,5.45,0,0,0,14.64,9.2Z"
        ></path>
      </svg>
      <input
        type="search"
        id="header-search-bar"
        name="q"
        class="searchInput"
        placeholder="Search"
        :value="value"
        @input="$emit('input', $event.target.value)"
      />
    </form>
  </div>
</template>

<script>
export default {
  name: 'InputField',
  props: {
    value: { required: true },
  },
};
</script>

<style lang="scss" scoped>
.search {
  width: 38%;
  .searchForm {
    position: relative;

    .searchIcon {
      fill: #878a8c;
      width: 18px;
      height: 18px;
      position: absolute;
      top: 50%;
      left: 0;
      height: 18px;
      margin-left: 16px;
      margin-top: -9px;
    }
    .searchInput {
      -webkit-appearance: none;
      appearance: none;
      background-color: #f6f7f8;
      border-radius: 4px;
      border: 1px solid #edeff1;
      box-shadow: none;
      color: #1c1c1c;
      display: block;
      height: 36px;
      outline: none;
      padding: 0 16px 0 40px;
      width: 100%;

      &:hover,
      &:focus {
        border-color: #0079d3;
      }
    }
  }
}
</style>
