<template lang="pug">

  .intro
    .layout
      ol
        li
          h2
            label.link(for="input-editor") Add an image
          p #[label.link(for="input-editor") Choose one from your device], or drag one in any time.
        li
          h2 Mask it
          p Place and size rectangles over the bits to be pixelised.
        li
          h2 Save it
          p Tap next, adjust the pixels, and download your image.

</template>
<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'

@Component
export default class Intro extends Vue {}
</script>
<style lang="scss">
@import '@/assets/scss/_util';

// Intro

.intro {
  margin-top: 9rem;
  padding-bottom: 5vh;
  width: 100%;

  .layout {
    max-width: em(260);
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
    margin: rem(12) 0;
  }

  ol {
    counter-reset: counter-intro;
    padding-left: rem(40);
    list-style: none;
    margin-left: rem(-20);
  }

  li {
    position: relative;
    counter-increment: counter-intro;
    margin-bottom: rem(32);
  }
}
</style>
