<template lang="pug">

  figure.illustration(:style="styles")
    inline-svg(:src="src")

</template>
<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import InlineSvg from 'vue-inline-svg'

@Component({
  components: { InlineSvg },
})
export default class Illustration extends Vue {
  get src() {
    return `./img/svg/illustration.svg`
  }

  tick = 0
  tickInterval = 0

  mounted() {
    this.tickInterval = setInterval(() => {
      this.tick++
    }, 1600)
  }

  beforeDestroy() {
    clearInterval(this.tickInterval)
  }

  getRandomColor() {
    const l = ~~(Math.random() * 80) + 0
    return `hsl(0, 0%, ${l}%)`
  }

  get styles() {
    const tick = this.tick
    const pixels: any = {}

    for (let i = 0; i < 15; i++) {
      pixels[`--color-pixel-${i + 1}`] = this.getRandomColor()
    }

    return pixels
  }
}
</script>
<style lang="scss">
.illustration {
  svg {
    position: relative;
    display: block;
  }

  #pixels path {
    transition: opacity 400ms, fill 400ms linear;
  }

  @for $i from 1 through 15 {
    #pixels path:nth-child(#{$i}) {
      fill: var(--color-pixel-#{$i});
    }
  }

  #pixels:hover path {
    opacity: 0.4;
    fill: black;
    transition: opacity 0.2s, fill 200ms;
  }
}

@keyframes {
}
</style>
