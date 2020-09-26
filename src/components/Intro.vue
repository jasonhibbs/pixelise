<template lang="pug">

  .intro
    .layout
      illustration
      ol
        li
          h2 #[label.link(for="input-editor") Add an image]
          p #[label.link(for="input-editor") Upload] or drag one in any time.
        li
          h2 Mask it
          p Cover bits with rectangles.
        li
          h2 Save it
          p Set your pixels and save them.
    .cta
      label.button(for="input-editor")
        span Upload Image

</template>
<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import Illustration from '@/components/Illustration.vue'

@Component({
  components: { Illustration },
})
export default class Intro extends Vue {}
</script>
<style lang="scss">
@import '@/assets/scss/_util';

// Intro

.intro {
  position: relative;
  margin-top: 8.5rem;
  width: 100%;

  .layout {
    max-width: em(280);
  }

  .illustration {
    margin: 0 max(-5vw, -200px);
  }

  h2 {
    position: relative;
    line-height: 1;
    font-weight: 900;
    margin: 0;

    &:before {
      vertical-align: baseline;
      position: absolute;
      bottom: 0;
      left: rem(-32);
      font-size: em(12);
      font-weight: 900;
      line-height: inherit;
      content: counter(counter-intro);
    }
  }

  p {
    line-height: (24/16);
    margin: rem(8) 0;
  }

  ol {
    counter-reset: counter-intro;
    padding-left: rem(40);
    list-style: none;
    margin: rem(24) 0;
    margin-left: rem(-20);
  }

  li {
    position: relative;
    counter-increment: counter-intro;
    margin-bottom: rem(24);
  }

  .cta {
    margin: rem(36) rem(24);
    margin-bottom: max(env(safe-area-inset-bottom), rem(24));
  }

  .button {
    display: block;
    background-color: var(--color-key);
    color: var(--color-white);
    padding: rem(14) rem(12);
    border-radius: rem(10);
    margin: 0 auto;
    max-width: rem(320);

    &:hover,
    &.focus-visible {
      background-color: var(--color-key-60);
    }

    &.focus-visible {
      outline: none;
      box-shadow: 0 0 0 3px var(--color-focus);
    }
  }
}
</style>
