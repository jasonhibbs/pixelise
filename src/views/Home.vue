<template lang="pug">

  main(:data-step="step")

    // Editor

    .editor(:class="{ _preview: showingPreview,  _loading: ui.isLoadingPreview }")
      canvas#canvas(ref="baseCanvas")
      editor-uploader(
        :hidden="images.input"
      )
      editor-stage(
        v-model="masks"
        @imageload="onLoadStageImage"
      )

      transition(name="fade" appear)
        .editor-info(v-if="!showingPreview && highlightedMask")
          .bits
            .bit
              .bit-key X
              .bit-value {{ highlightedMask.x }}
            .bit
              .bit-key Y
              .bit-value {{ highlightedMask.y }}
            .bit
              .bit-key W
              .bit-value {{ highlightedMask.w }}
            .bit
              .bit-key H
              .bit-value {{ highlightedMask.h }}

      transition(name="fade-delay" appear)
        .editor-info._loader(v-if="ui.isLoadingPreview")
          loader Loading…

    // Steps

    intro(v-if="step === 'start'")

    context-masks(
      v-if="step === 'mask'"
      @masksadd="onClickAddMask"
      @masksdone="onClickGoToSave"
    )

    context-save(
      v-if="step === 'save'"
      @masksedit="onClickBackToMask"
      @settingschange="updateOutput"
    )

</template>
<script lang="ts">
import { Component, Ref, Vue } from 'vue-property-decorator'
import { mapState } from 'vuex'
import throttle from 'lodash.throttle'
import Loader from '@/components/Loader.vue'
import EditorUploader from '@/components/EditorUploader.vue'
import EditorStage from '@/components/EditorStage.vue'
import ImageMask from '@/components/ImageMask.vue'
import Intro from '@/components/Intro.vue'
import ContextMasks from '@/components/ContextMasks.vue'
import ContextSave from '@/components/ContextSave.vue'

@Component({
  components: {
    Loader,
    EditorUploader,
    EditorStage,
    ImageMask,
    Intro,
    ContextMasks,
    ContextSave,
  },
  computed: mapState(['ui', 'settings', 'strings', 'images']),
})
export default class Home extends Vue {
  @Ref('baseCanvas') readonly canvasElement!: HTMLCanvasElement

  // Vuex

  ui!: any
  settings!: any
  strings!: any
  images!: any

  get masks() {
    return this.$store.state.masks
  }

  set masks(value) {
    this.$store.commit('updateMasks', value)
  }

  // Step

  get step(): 'start' | 'mask' | 'save' {
    switch (true) {
      case !this.images.input:
        return 'start'
      case !this.showingPreview:
        return 'mask'
      case this.showingPreview:
        return 'save'
      default:
        return 'start'
    }
  }

  // Lifecycle

  mounted() {
    this.$store.commit('updateImage', {
      key: 'context',
      value: this.canvasElement.getContext('2d'),
    })
  }

  // Preview

  get showingPreview() {
    return this.ui.showingPreview
  }

  set showingPreview(value: boolean) {
    this.$store.commit('updateUI', { key: 'showingPreview', value })
  }

  // Context

  onClickGoToSave() {
    this.updateOutput()
    this.showingPreview = true
  }

  onClickBackToMask() {
    this.showingPreview = false
  }

  // Upload

  isLargeImage = false

  onLoadStageImage(image: HTMLImageElement) {
    this.isLargeImage = image.width > 999 || image.height > 999
    this.$store.commit('removeAllMasks')
    const { x, y } = this.getStageCentre()
    this.addMask(x - 64, y - 16)
  }

  // Masks

  get highlightedMask() {
    if (!this.ui.maskHighlight) {
      return null
    }
    return this.masks.find((x: Mask) => x.id === this.ui.maskHighlight)
  }

  getStageCentre() {
    let x = 20
    let y = 20
    const stage = document.querySelector('.stage') as HTMLElement
    const context = document
      .querySelector('.stage-context')
      ?.getBoundingClientRect()
    if (stage && context) {
      const stageCentreX = stage.clientWidth / 2
      const stageCentreY = stage.clientHeight / 2
      x = Math.floor(stageCentreX - context.x)
      y = Math.floor(stageCentreY - context.y)
    }
    return { x, y }
  }

  addMask(x = 40, y = 40, w = 128, h = 32) {
    this.$store.commit('addMask', { x, y, w, h })
  }

  onClickAddMask() {
    const { x, y } = this.getStageCentre()
    this.addMask(x - 64, y - 16)
  }

  // Output

  updateOutput = throttle(() => {
    this.$store.dispatch('updateOutput')
  }, 100)
}
</script>
<style lang="scss">
@import '@/assets/scss/_util';

#canvas {
  display: none;
}

// Editor

.editor {
  background-image: linear-gradient(
    to bottom,
    var(--color-root) 60%,
    var(--color-contrast-10)
  );
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
}

// Editor Info

.editor-info {
  background-color: var(--color-root-alpha-40);
  backdrop-filter: brightness(300%) blur(20px);
  pointer-events: none;
  position: absolute;
  top: 3.5rem;
  padding: rem(4) rem(8);
  border-radius: 2px;
  z-index: 2;

  @media (prefers-color-scheme: dark) {
    backdrop-filter: brightness(40%) blur(20px);
  }

  .bits {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    align-items: center;
    margin: 0 0 0 rem(6);
  }

  .loader {
    --size: 16px;
    font-size: em(13);
  }
}

.editor-info._loader.fade-delay-enter-active {
  transition-delay: 0.6s;
}

.bit {
  display: flex;
  align-items: baseline;
}

.bit-key {
  font-size: em(10);
  line-height: 1;
  flex: none;
  opacity: 0.6;
  margin-right: rem(6);
}

.bit-value {
  flex: auto;
  font-size: em(13);
  line-height: (16/13);
  margin-right: rem(10);
  font-feature-settings: 'tnum' 1;
  font-variant-numeric: tabular-nums;
}

// Contexts

.context {
  display: flex;
  justify-content: center;
  position: absolute;
  bottom: 0;
  width: 100%;
  margin-bottom: clamp(max(2rem, env(safe-area-inset-bottom)), 5vw, 3rem);
  pointer-events: none;
}

.context button,
.context .button {
  background-color: var(--color-root);
  padding: em(13);
  border-radius: rem(48);
  box-shadow: 0 0 0 1px var(--color-contrast-alpha-10);

  &:focus,
  &:hover {
    outline: none;
    box-shadow: 0 0 0 3px var(--color-focus);
  }

  &:active {
    animation: pulse 0.2s ease 1;
  }

  &._primary {
    color: var(--color-white);
    background-color: var(--color-key);

    &:focus,
    &:hover {
      background-color: var(--color-key-70);
    }
  }
}

@keyframes pulse {
  30% {
    transform: scale(0.9);
  }
  60% {
    transform: scale(1.05);
  }
  100% {
    transform: scale(1);
  }
}

.context-controls {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin: 0 1rem;
  width: 100%;
  max-width: 20rem;

  > * {
    pointer-events: auto;
  }

  > *:not(:last-child) {
    margin-inline-end: rem(12);
  }
}
</style>
