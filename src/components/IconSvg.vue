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
.icon {
  --size: 1.25em;
  display: block;
  min-width: var(--size);
  min-height: var(--size);

  svg {
    display: block;
    height: auto;
    width: var(--size);

    path {
      stroke: currentColor;
    }
  }
}
</style>
