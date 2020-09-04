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

header {
  pointer-events: none;
  position: absolute;
  top: 0;
  top: env(safe-area-inset-top);
  left: 0;
  width: 100%;
  z-index: 2;
  padding: 1rem;
  will-change: width;
  transition: width 0.5s cubic-bezier(0.25, 0.83, 0.1, 1);

  h1 {
    display: inline-block;
    font-size: 1.25rem;
    font-weight: 900;
    margin: 0;
    transform: none;
    will-change: font-size, margin, transform;
    transition: font-size, margin, transform;
    transition-duration: 0.5s;
    transition-timing-function: cubic-bezier(0.25, 0.83, 0.1, 1);
  }
}

header._intro {
  h1 {
    font-size: 4em;
    margin-top: 4rem;
    margin-left: 50%;
    transform: translateX(-50%);
  }
}
</style>
