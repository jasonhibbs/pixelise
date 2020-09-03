<template lang="pug">

  #app

    header(:class="{_intro: !images.input}")
      h1 Pixelise

    router-view

</template>

<style lang="scss" src="@/assets/scss/style.scss"></style>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import { mapState } from 'vuex'

@Component({
  computed: mapState(['ui', 'images']),
})
export default class App extends Vue {
  images!: any
}
</script>

<style lang="scss">
html,
body,
#app,
main {
  height: 100%;
}

#app > header {
  pointer-events: none;
  position: absolute;
  top: 0;
  top: env(safe-area-inset-top);
  left: 0;
  width: 100%;
  text-align: center;
  z-index: 2;
  padding: 1rem;

  h1 {
    font-size: 1.25rem;
    font-weight: 900;
    margin: 0;
    will-change: font-size;
    transition: font-size 0.5s cubic-bezier(0.25, 0.83, 0.1, 1);
  }

  &._intro h1 {
    font-size: 4em;
  }
}
</style>
