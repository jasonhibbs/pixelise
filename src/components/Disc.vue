<template lang="pug">

  .disc(:data-color="data.color")
    .disc-content
      template(v-if="data.icon")
        icon-svg(:name="data.icon" )
      template(v-if="data.image")
        img(:src="imageSrc" alt=" ")

</template>
<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator'
import IconSvg from '@/components/IconSvg.vue'

@Component({
  components: { IconSvg },
})
export default class Disc extends Vue {
  @Prop() data!: any

  get imageSrc() {
    if (!this.data.image) {
      return null
    }
    return `./${this.data.image}`
  }
}
</script>
<style lang="scss">
.disc {
  --size: 2.25em;

  display: inline-block;

  min-width: var(--size);
  height: var(--size);
  border-radius: var(--size);
  overflow: hidden;
  background-color: var(--color-contrast-10);

  .disc-content {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100%;
    height: 100%;
  }

  img {
    display: block;
  }

  &[data-color='key'] {
    background-color: var(--color-key-alpha-20);
    color: var(--color-key);
  }
  &[data-color='red'] {
    background-color: var(--color-red-alpha-20);
    color: var(--color-red);
  }
  &[data-color='orange'] {
    background-color: var(--color-orange-alpha-20);
    color: var(--color-orange);
  }
  &[data-color='green'] {
    background-color: var(--color-green-alpha-20);
    color: var(--color-green);
  }
}
</style>
