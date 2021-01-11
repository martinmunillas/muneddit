<template>
  <div style="width: 100%">
    <fieldset class="inputField" v-if="animated">
      <input
        class="animatedInput white"
        :type="type"
        :name="name"
        :value="value"
        @input="$emit('input', $event.target.value)"
        :data-empty="JSON.stringify(!value.length)"
      />
      <label class="animatedPlaceholder white">{{ placeholder }}</label>
      <p v-if="error" class="error">{{ error }}</p>
    </fieldset>
    <fieldset class="inputField" v-if="!animated">
      <input
        :class="'input ' + color"
        :type="type"
        :name="name"
        :value="value"
        @input="$emit('input', $event.target.value)"
        :placeholder="placeholder"
        v-if="!textarea"
      />
      <textarea
        :class="'textarea ' + color"
        :name="name"
        :value="value"
        @input="$emit('input', $event.target.value)"
        :placeholder="placeholder"
        v-if="textarea"
      />
      <p v-if="error" class="error">{{ error }}</p>
    </fieldset>
  </div>
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
    animated: { required: false, default: false },
    textarea: { required: false, default: false },
    color: { required: false, default: 'white' },
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
  width: 100%;

  .input {
    transform: translateZ(0);
    outline: 0;
    width: 100%;
    appearance: none;
    transition: all 0.2s ease-in-out;
    height: 48px;
    padding: 10px 22px;
    border-radius: 4px;
  }

  .textarea {
    transform: translateZ(0);
    outline: 0;
    max-width: 100%;
    width: 100%;
    min-height: 100px;
    appearance: none;
    transition: all 0.2s ease-in-out;
    padding: 10px 22px;
    border-radius: 4px;
    font-family: inherit;
  }

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
    text-transform: uppercase;
    transform: translateZ(0);
    transform-origin: 0 50%;
    transition: all 0.2s ease-in-out;
    pointer-events: none;
    line-height: 23px;
  }
  .animatedInput {
    transform: translateZ(0);
    outline: 0;
    width: 100%;
    appearance: none;
    transition: all 0.2s ease-in-out;
    height: 48px;
    padding: 22px 12px 10px;
    border-radius: 4px;
  }

  .animatedInput:-webkit-autofill + .animatedPlaceholder,
  .animatedInput:active + .animatedPlaceholder,
  .animatedInput:hover + .animatedPlaceholder,
  .animatedInput[data-empty='false'] + .animatedPlaceholder {
    transform: translate3d(0, -8px, 0) scale(0.83333333);
    line-height: 14px;
  }

  .error {
    color: red;
  }
}

.grey {
  &.input {
    border: 1px solid #edeff1;
    background-color: #f6f7f8;
    color: #1c1c1c;
  }

  &.textarea {
    border: 1px solid #edeff1;
    background-color: #f6f7f8;
    color: #1c1c1c;
  }

  &.animatedPlaceholder {
    color: #1c1c1c;
  }
  &.animatedInput {
    border: 1px solid #edeff1;
    background-color: #f6f7f8;
  }
}

.white {
  &.input {
    border: 1px solid #cccccc;
    background-color: #fcfcfb;
  }

  &.textarea {
    border: 1px solid #cccccc;
    background-color: #fcfcfb;
  }

  &.animatedPlaceholder {
    color: #a5a4a4;
  }
  &.animatedInput {
    border: 1px solid #cccccc;
    background-color: #fcfcfb;
  }
}
</style>
