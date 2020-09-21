<template lang="pug">

  figure.illustration
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
}
</script>
<style lang="scss">
.illustration {
  margin: 0 max(-10vw, -200px);

  svg {
    position: relative;
    display: block;
  }
}
</style>
