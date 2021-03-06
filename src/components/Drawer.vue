<template lang="pug">


    transition(
      name="drawer"
      appear
      @after-enter="$emit('expand')"
    )
      .drawer(
        role="dialog"
      )

        .drawer-overlay(
          @click="$emit('clickoverlay')"
        )

        focus-trap(@deactivate="$emit('dismiss')")
          .drawer-card(
            ref="card"
            @mousewheel="onWheel"
            @touchstart="onTouchstart"
            @touchmove="onTouchmove"
          )

            .drawer-header(ref="header")
              slot(name="header")

            .drawer-content(ref="content")
              slot(name="content")

</template>
<script lang="ts">
import { Component, Ref, Vue } from 'vue-property-decorator'
import { FocusTrap } from 'focus-trap-vue'

@Component({ components: { FocusTrap } })
export default class Drawer extends Vue {
  @Ref('card') readonly cardElement!: HTMLElement
  @Ref('header') readonly headerElement!: HTMLElement
  @Ref('content') readonly contentElement!: HTMLElement

  focusFirstinContent() {
    const focusable = [
      ...this.contentElement.querySelectorAll(
        '[href], button, input, select, textarea, [tabindex]:not([tabindex="-1"])'
      ),
    ].filter((el) => !el.hasAttribute('disabled'))
    const first = focusable[0] as HTMLElement
    if (first) {
      first.focus()
    }
  }

  // Events

  onWheel(e: WheelEvent) {
    if (e.deltaX < -42) {
      this.$emit('dismiss')
    }
  }

  initialTouchX = 0

  onTouchstart(e: TouchEvent) {
    const firstTouch = e.touches[0]
    this.initialTouchX = firstTouch.pageX
  }

  onTouchmove(e: TouchEvent) {
    const firstTouch = e.touches[0]
    const delta = firstTouch.pageX - this.initialTouchX
    if (delta > 90) {
      this.$emit('dismiss')
    }
  }
}
</script>
<style lang="scss">
@import '@/assets/scss/_util';

.drawer {
  position: absolute;
  height: 100vh;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  z-index: 9;
}

.drawer-overlay {
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
}

.drawer-card,
.drawer-content {
  display: flex;
  flex-direction: column;
}

.drawer-card {
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  background-color: var(--color-root);
  height: 100%;
  width: em(320);
  max-width: calc(100vw - 2rem);
  box-shadow: 0 0 3rem var(--color-contrast-alpha-20);
}

// Header

.drawer-header {
  flex: none;
}

.drawer-header {
  button.link {
    display: block;
    text-align: left;
    width: 100%;
    padding: rem(11) rem(14);
    outline-offset: -3px;
  }
}

// Content

.drawer-content {
  flex: auto;
}

.drawer footer {
  @include font-size(13, 16);
  flex: none;
  justify-self: flex-end;
  box-shadow: 0 -1px 0 var(--color-contrast-10);
  color: var(--color-contrast-60);
  padding: rem(8) 0 5vh;
  margin-top: auto;

  p {
    margin: rem(8) 0;
  }
}

// Transition

.drawer {
  --drawer-transition-duration: 0.5s;
}

.drawer-enter-active {
  transition: visibility var(--drawer-transition-duration);
}

.drawer-leave-active {
  pointer-events: none;
  transition: visibility 0s var(--drawer-transition-duration);
}

.drawer-card {
  overflow-y: auto;
  -webkit-overflow-scrolling: touch;
  backface-visibility: hidden;
  will-change: transform;

  .drawer-enter-active &,
  .drawer-leave-active & {
    transition: transform 0.5s cubic-bezier(0.25, 0.83, 0.1, 1);
  }

  .drawer-enter &,
  .drawer-leave-to & {
    transform: translateX(110%);
  }
}
</style>
