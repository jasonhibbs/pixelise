<template lang="pug">

  transition(name="message-slide" appear)
    .context-message
      .context-message-content
        slot

</template>
<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'

@Component
export default class ContextMessage extends Vue {}
</script>

<style lang="scss">
@import '@/assets/scss/_util';

.context-message {
  @extend %backdrop-blur;

  padding: rem(6) rem(8);
  border-radius: 4px;
  text-align: center;
  user-select: none;

  p {
    font-size: em(13);
    line-height: (18.000001/13);
    margin: 0;
  }
}

.message-slide-enter-active,
.message-slide-leave-active {
  transition: transform, opacity;
  transition-duration: 0.3s;
  transition-timing-function: cubic-bezier(0.25, 0.83, 0.1, 1);
}

.message-slide-enter,
.message-slide-leave-to {
  transform: translateY(1rem);
  opacity: 0;
}
</style>
