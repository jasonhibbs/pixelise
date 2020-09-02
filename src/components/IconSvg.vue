<template lang="pug">

  i.icon
    inline-svg(:src="src")

</template>
<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator'
import InlineSvg from 'vue-inline-svg'

@Component({
  components: { InlineSvg },
})
export default class IconSvg extends Vue {
  @Prop() readonly name!: string

  get src() {
    return require(`../assets/svg/icon-${this.name}.svg`)
  }
}
</script>
<style lang="scss">
$size-base: (20em/16);

.icon {
  display: block;
  min-width: $size-base;
  min-height: $size-base;

  svg {
    display: block;
    height: auto;
    width: $size-base;

    path {
      stroke: currentColor;
    }
  }
}
</style>
