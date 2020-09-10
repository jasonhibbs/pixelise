<template lang="pug">

  .context-input-range(:class="classes")
    .context-input-range-control
      input(
        type="range"
        v-bind="$attrs"
        v-on="listeners"
        :value="value"
        @focus="onFocus"
        @blur="onBlur"
        @mouseenter="onMouseenter"
        @mouseleave="onMouseleave"
      )
    .context-input-range-display
      .context-input-range-track
      .context-input-range-progress(:style="{ width: progressPercent }")
        .context-input-range-thumb


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

  get classes() {
    return {
      _focus: this.isFocussed,
      _hover: this.isHovered,
    }
  }

  // Progress

  get progress() {
    const val = this.value || 0
    const { min = '0', max = '1' } = this.$attrs
    const range = +max - +min
    return (val - +min) / range
  }

  get progressPercent() {
    return `${this.progress * 100}%`
  }

  // Events

  isFocussed = false
  isHovered = false

  onFocus() {
    this.isFocussed = true
  }

  onBlur() {
    this.isFocussed = false
  }

  onMouseenter() {
    this.isHovered = true
  }

  onMouseleave() {
    this.isHovered = false
  }
}
</script>
<style lang="scss">
@import '@/assets/scss/_util';

.context-input-range {
  --thumb-size: 24px;

  user-select: none;
  position: relative;
  background-color: var(--color-root);
  border-radius: rem(48);
  display: flex;
  align-items: center;
  min-height: rem(48);
  flex: auto;
  box-shadow: 0 0 0 1px var(--color-contrast-alpha-10);
  transition: box-shadow 0.1s;

  &._focus {
    box-shadow: 0 0 0 3px var(--color-focus);
  }
}

.context-input-range-control {
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  margin: auto;
  padding: 0 rem(16);
  opacity: 0;
  z-index: 1;

  input {
    border: none;
    display: block;
    width: 100%;
    height: 100%;
  }
}

.context-input-range-display {
  width: 100%;
  margin: 0 rem(24);
  pointer-events: none;
}

.context-input-range-track {
  position: relative;
  height: 2px;
  border-radius: 2px;
  top: 2px;
  right: -4px;
  background-color: var(--color-contrast-20);
}

.context-input-range-progress {
  position: relative;
  top: -1px;
  margin-left: -5px;
  height: 4px;
  border-radius: 4px;
  background-color: var(--color-key);
}

.context-input-range-thumb {
  position: absolute;
  top: 50%;
  right: 0;
  width: var(--thumb-size);
  height: var(--thumb-size);
  border-radius: var(--thumb-size);
  background-color: var(--color-key);
  transform: translate3d(50%, -50%, 0);
  transition: box-shadow 0.1s;
  margin-right: -5px;

  .context-input-range._hover & {
    box-shadow: 0 0 0 3px var(--color-focus);
  }
}
</style>
