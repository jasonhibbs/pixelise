<template lang="pug">

  .logo
    inline-svg(:src="src")

</template>
<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import InlineSvg from 'vue-inline-svg'

@Component({
  components: { InlineSvg },
})
export default class IconSvg extends Vue {
  get src() {
    return `./img/svg/logo.svg`
  }
}
</script>
<style lang="scss">
.logo {
  --size: 1.25em;

  display: block;
  min-width: var(--size);

  svg {
    display: block;
    height: auto;
    width: var(--size);
    overflow: visible;

    g {
      fill: var(--color-key);
    }
  }
}
</style>
