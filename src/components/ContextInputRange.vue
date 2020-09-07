<template lang="pug">

  .context-input-range
    .context-input-range-control
      input(
        type="range"
        v-bind="$attrs"
        v-on="listeners"
        :value="value"
      )

</template>
<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator'

@Component({
  inheritAttrs: false,
})
export default class ContextInputRange extends Vue {
  @Prop() value?: number

  get listeners() {
    return {
      ...this.$listeners,
      input: (e: any) => this.$emit('input', e.target.value),
    }
  }
}
</script>
<style lang="scss">
@import '@/assets/scss/_util';

.context-input-range {
  background-color: var(--color-root);
  border-radius: rem(48);
  box-shadow: 0 0 0 1px var(--color-contrast-alpha-10);
  display: flex;
  align-items: center;
  min-height: rem(48);
  flex: auto;
  padding: 0 rem(18);

  input {
    padding: rem(16) 0;
    border: none;
    display: block;
    width: 100%;
  }
}

.context-input-range-control {
  flex: auto;
}
</style>
