<template lang="pug">


  a.disc-button(
    v-if="href"
    v-bind="$attrs"
    v-on="$listeners"
    :href="href"
  )
    disc(:data="disc")
    span.disc-button-label
      slot

  router-link.disc-button(
    v-else-if="route"
    v-bind="$attrs"
    v-on="$listeners"
    :to="route"
  )
    disc(:data="disc")
    span.disc-button-label
      slot

  button.disc-button(
    v-else
    v-bind="$attrs"
    v-on="$listeners"
  )
    disc(:data="disc")
    span.disc-button-label
      slot

</template>
<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator'
import Disc from '@/components/Disc.vue'

@Component({
  components: { Disc },
})
export default class DiscButton extends Vue {
  @Prop() href?: string
  @Prop() route?: any
  @Prop() disc!: any
}
</script>

<style lang="scss">
@import '@/assets/scss/_util';

.disc-button {
  display: flex;
  align-items: center;
  background-color: var(--color-root);
  color: currentColor;
  border: none;
  padding: rem(10) rem(16);
  width: 100%;

  &:focus,
  &:hover {
    outline-offset: -3px;
  }

  &:hover {
    color: inherit;
    background-color: var(--color-contrast-5);
  }

  &:disabled {
    .disc-button-label {
      opacity: (2/5);
    }
  }

  .disc {
    flex: none;
    margin-right: rem(12);
  }
}
</style>
