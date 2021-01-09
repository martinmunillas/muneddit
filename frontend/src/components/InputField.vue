<template>
  <fieldset class="inputField">
    <input
      class="input"
      :type="type"
      :name="name"
      :value="value"
      @input="$emit('input', $event.target.value)"
      :data-empty="JSON.stringify(!value.length)"
    />
    <label class="animatedPlaceholder">{{ placeholder }}</label>
    <p v-if="error" class="error">{{ error }}</p>
  </fieldset>
</template>

<script>
export default {
  name: 'InputField',
  props: {
    error: { required: false, default: null },
    name: { required: true },
    type: { required: false, default: 'text' },
    placeholder: { required: false, default: '' },
    value: { required: true },
  },
};
</script>

<style lang="scss" scoped>
.inputField {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  position: relative;
  border: none;

  .animatedPlaceholder {
    font-size: 10px;
    font-weight: 600;
    letter-spacing: 0.5px;
    line-height: 12px;
    position: absolute;
    display: inline-block;
    vertical-align: middle;
    top: 14px;
    left: 12px;
    color: #a5a4a4;
    text-transform: uppercase;
    -webkit-transform: translateZ(0);
    transform: translateZ(0);
    -webkit-transform-origin: 0 50%;
    transform-origin: 0 50%;
    transition: all 0.2s ease-in-out;
    pointer-events: none;
    line-height: 23px;
  }
  .input {
    -webkit-transform: translateZ(0);
    transform: translateZ(0);
    outline: 0;
    width: 100%;
    -webkit-appearance: none;
    appearance: none;
    transition: all 0.2s ease-in-out;
    height: 48px;
    padding: 22px 12px 10px;
    border: 1px solid rgba(0, 0, 0, 0.1);
    border-radius: 4px;
    background-color: #fcfcfb;
  }

  .input:-webkit-autofill + .animatedPlaceholder,
  .input:active + .animatedPlaceholder,
  .input:hover + .animatedPlaceholder,
  .input[data-empty='false'] + .animatedPlaceholder {
    -webkit-transform: translate3d(0, -8px, 0) scale(0.83333333);
    transform: translate3d(0, -8px, 0) scale(0.83333333);
    line-height: 14px;
  }

  .error {
    color: red;
  }
}
</style>
