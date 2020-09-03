<template lang="pug">

  main(
    :data-step="step"
  )

    .editor(:class="{ _preview: showingPreview,  _loading: this.ui.isLoadingPreview }")
      canvas#canvas(ref="baseCanvas")
      editor-uploader(
        :hidden="images.input"
      )
      editor-stage(
        v-model="masks"
        @imageload="onLoadStageImage"
      )

      transition(name="fade" appear)
        .editor-info(v-if="this.highlightedMask")
          .bits
            .bit
              .bit-key X
              .bit-value {{ this.highlightedMask.x }}
            .bit
              .bit-key Y
              .bit-value {{ this.highlightedMask.y }}
            .bit
              .bit-key W
              .bit-value {{ this.highlightedMask.w }}
            .bit
              .bit-key H
              .bit-value {{ this.highlightedMask.h }}

      transition(name="fade-in" appear)
        .editor-info(v-if="this.ui.isLoadingPreview")
          loader Loading…

    .intro(v-if="step === 'start'")
      .layout
        ol
          li
            h2
              label.link(for="input-editor") Add an image
            p #[label.link(for="input-editor") Choose one from your device] or drag one in, any time.
          li
            h2 Mask it
            p Place and size rectangles over the bits to pixelised.
          li
            h2 Save it
            p Tap next, adjust the pixels, and download your image.

    .context._masks(v-if="step === 'mask'")
      .context-controls
        button(
          v-if="!showingPreview && images.input"
          title="Add Mask"
          @click="onClickAddMask"
        )
          icon-svg(name="plus")

        .tip

        button._primary(
          v-if="images.input"
          title="Next"
          :disabled="!masks.length"
          @click="onClickGoToSave"
        )
          icon-svg(name="arrow-right")

    .context._save(v-if="step === 'save'")
      .context-controls
        button(
          title="Back"
          @click="onClickBackToMask"
        )
          icon-svg(name="arrow-left")


        .field.field-range
          .field-control
            input#input-density(
              type="range"
              min="0.03"
              max="0.26"
              step="0.01"
              title="Pixel Density"
              v-model="pixelScale"
              @input="updateOutput"
            )
          //- p.field-message(v-if="isLargeImage") Big images take longer to update

        a.button._primary(
          title="Save Image"
          :disabled="!images.output"
          :href="images.output"
          :download="strings.download"
        )
          icon-svg(name="download")

</template>
<script lang="ts">
import { Component, Ref, Vue } from 'vue-property-decorator'
import { mapState } from 'vuex'
import throttle from 'lodash.throttle'
import Loader from '@/components/Loader.vue'
import ContextUploader from '@/components/ContextUploader.vue'
import EditorUploader from '@/components/EditorUploader.vue'
import EditorStage from '@/components/EditorStage.vue'
import ImageMask from '@/components/ImageMask.vue'
import LayerMask from '@/components/LayerMask.vue'
import IconSvg from '@/components/IconSvg.vue'

@Component({
  components: {
    IconSvg,
    Loader,
    ContextUploader,
    EditorUploader,
    EditorStage,
    ImageMask,
    LayerMask,
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

  get pixelScale() {
    return this.settings.pixelScale
  }

  set pixelScale(value: number) {
    this.$store.commit('updateSetting', { key: 'pixelScale', value })
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

  isLoadingPreview = false

  onClickPreviewToggle() {
    if (!this.showingPreview) {
      this.updateOutput()
    }
    this.showingPreview = !this.showingPreview
  }

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

  // Layers

  get highlightedMask() {
    if (!this.ui.maskHighlight) {
      return null
    }
    return this.masks.find((x: any) => x.id === this.ui.maskHighlight)
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

.editor {
  background-image: linear-gradient(transparent 60%, var(--color-contrast-10));
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

.editor-info {
  background-color: var(--color-root-alpha-20);
  backdrop-filter: brightness(300%) blur(20px);
  pointer-events: none;
  position: absolute;
  top: 3.5rem;
  padding: rem(4) rem(8);
  border-radius: 2px;

  @media (prefers-color-scheme: dark) {
    backdrop-filter: brightness(40%) blur(20px);
  }

  .bits {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    align-items: center;
    margin: rem(-1) 0 rem(1) rem(6);
  }

  .loader {
    --size: 16px;
    font-size: em(13);
  }
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

#canvas {
  display: none;
}

.intro {
  position: absolute;
  top: 12rem;
  width: 100%;

  .layout {
    max-width: em(280);
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
      left: rem(-40);
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

  .field {
    background-color: var(--color-root);
    border-radius: rem(48);
    box-shadow: 0 0 0 1px var(--color-contrast-alpha-10);
    display: flex;
    align-items: center;
    min-height: rem(48);
    flex: auto;
    padding: 0 rem(12);
  }

  .field-control {
    flex: auto;
  }

  .field-range {
    padding: 0 rem(18);

    input {
      padding: rem(16) 0;
      border: none;
      display: block;
      width: 100%;
    }
  }
}

.layers {
  margin: 1rem 0;
}

.fields,
.field + .field {
  margin-top: 1rem;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s;
}

.fade-enter,
.fade-leave-to {
  opacity: 0;
}

.fade-in-enter {
  opacity: 0;
  transition: opacity 0.2s 0.2s;
}
</style>
