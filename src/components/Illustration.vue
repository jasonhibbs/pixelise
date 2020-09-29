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
  pixels: string[] = Array(15).fill('black')
  isHovering = false

  mounted() {
    const rate = 1000 / 12
    this.tickInterval = setInterval(() => {
      this.tick++
    }, rate)
  }

  beforeDestroy() {
    clearInterval(this.tickInterval)
  }

  getRandomColor() {
    const max = 10
    const lightness = ~~(Math.random() * max) + 0
    return `hsl(0, 0%, ${lightness * 8}%)`
  }

  get pixelVars() {
    const tick = this.tick % 6
    const pixels: any = {}

    const a = tick
    const b = tick + 6
    const c = tick + 12
    this.pixels[a] = this.getRandomColor()
    this.pixels[b] = this.getRandomColor()
    this.pixels[c] = this.getRandomColor()

    for (let i = 0; i < this.pixels.length; i++) {
      pixels[`--color-pixel-${i + 1}`] = this.pixels[i]
    }

    return pixels
  }

  get styles() {
    return this.pixelVars
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
    transition: opacity 400ms, fill 200ms linear;
  }

  @for $i from 1 through 15 {
    #pixels path:nth-child(#{$i}) {
      fill: var(--color-pixel-#{$i});
    }
  }

  #pupils {
    transform: translate3d(-1.2%, 0.4%, 0);
    transition: transform 0.6s;
  }

  &:hover #pixels path {
    opacity: 0.4;
    fill: black;
    transition: opacity 0.2s, fill 0.2s;
  }

  &:hover #pupils {
    transform: translateX(0);
    transition: transform 80ms 200ms ease-out;
  }
}

@keyframes {
}
</style>
