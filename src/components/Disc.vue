<template lang="pug">

  .disc(:data-color="data.color")
    template(v-if="data.icon")
    template(v-if="data.image")

</template>
<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator'

@Component
export default class Disc extends Vue {
  @Prop() data!: any
}
</script>
<style lang="scss">
.disc {
  --size: (20em/16);

  display: inline-block;
  min-width: var(--size);
  height: var(--size);
  border-radius: var(--size);
  background-color: var(--color-grey-10);
}
</style>
