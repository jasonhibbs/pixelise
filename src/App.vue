<template lang="pug">

  #app(
    :class="{ _dragging: ui.isDragging }"
  )

    header(:class="{_intro: !images.input}")
      h1 Pixelise

    router-view

    transition(name="fade" appear)
      .dropzone(v-if="ui.isDragging")
        .dropzone-content
          icon-svg(name="download")
          p Drop it anywhere

</template>

<style lang="scss" src="@/assets/scss/style.scss"></style>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import { mapState } from 'vuex'
import IconSvg from '@/components/IconSvg.vue'

@Component({
  components: { IconSvg },
  computed: mapState(['ui', 'images']),
})
export default class App extends Vue {
  images!: any
  ui!: any
}
</script>

<style lang="scss">
html,
body,
#app,
main {
  height: 100%;
}

#app._dragging {
  pointer-events: none;
}

header {
  pointer-events: none;
  position: absolute;
  top: 0;
  top: env(safe-area-inset-top);
  left: 0;
  width: 100%;
  z-index: 2;
  padding: 1rem;
  will-change: width;
  transition: width 0.5s cubic-bezier(0.25, 0.83, 0.1, 1);

  h1 {
    display: inline-block;
    font-size: 1.25rem;
    font-weight: 900;
    margin: 0;
    transform: none;
    will-change: font-size, margin, transform;
    transition: font-size, margin, transform;
    transition-duration: 0.5s;
    transition-timing-function: cubic-bezier(0.25, 0.83, 0.1, 1);
  }
}

header._intro {
  h1 {
    font-size: 4em;
    margin-top: 4rem;
    margin-left: 50%;
    transform: translateX(-50%);
  }
}

.dropzone {
  background: var(--color-root-alpha-80);
  backdrop-filter: blur(20px);
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  margin: auto;
  z-index: 10;
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;

  .icon {
    font-size: 2em;
  }

  svg {
    margin: auto;

    path {
      stroke-width: 1.5px;
    }
  }

  p {
    width: calc(100vh - 4rem);
    max-width: 18em;
    margin: 1.5rem auto;
  }

  &:after {
    $inset: 1rem;
    content: '';
    position: absolute;
    top: $inset;
    right: $inset;
    bottom: $inset;
    left: $inset;
    margin: auto;
    border: 2px dashed var(--color-contrast-20);
  }
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s;
}

.fade-enter,
.fade-leave-to {
  opacity: 0;
}
</style>
