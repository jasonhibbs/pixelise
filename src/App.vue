<template lang="pug">

  #app

    header
      h1 Pixelise

    router-view

</template>

<style lang="scss" src="@/assets/scss/style.scss"></style>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'

@Component
export default class App extends Vue {}
</script>

<style lang="scss">
html,
body,
#app,
main {
  height: 100%;
}

#app > header {
  position: absolute;
  top: 0;
  top: env(safe-area-inset-top);
  left: 0;
  z-index: 2;
  padding: 1rem;

  h1 {
    font-size: 1.25rem;
    margin: 0;
    text-shadow: 0 0 0.75em var(--color-root), 0 0 0.25em var(--color-root),
      0 0 1px var(--color-root);
  }
}
</style>
