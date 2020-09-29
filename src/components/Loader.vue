<template lang="pug">

  span.loader
    span.loader-spinner
      span
    span.loader-label
      slot

</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'

@Component
export default class Loader extends Vue {}
</script>
<style lang="scss">
.loader {
  --size: 1.25em;
  --width: 1px;
  --ring-color: var(--color-contrast-50, currentColor);
  --segment-color: var(--color-contrast-20, transparent);
  --speed: #{(1s/2)};

  display: flex;
  align-items: center;
  color: currentColor;

  .loader-spinner,
  .loader-label {
    flex: none;
  }

  .loader-spinner {
    display: block;
    overflow: hidden;

    > span {
      display: block;
      width: var(--size);
      height: var(--size);
      border: var(--width) solid var(--ring-color);
      border-top-color: var(--segment-color) !important;
      border-radius: var(--size);
      will-change: transform;
      backface-visibility: hidden;
      animation: spin var(--speed) linear infinite;
    }
  }

  .loader-label:not(:empty) {
    margin-left: 0.5em;
  }

  @keyframes spin {
    from {
      transform: rotateZ(0deg);
    }
    to {
      transform: rotateZ(360deg);
    }
  }
}
</style>
