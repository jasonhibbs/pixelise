<template lang="pug">

  main(
    :data-step="step"
  )

    .editor(:class="{ _preview: showingPreview,  _loading: this.ui.isLoadingPreview }")

      editor-uploader(
        :hidden="images.input"
      )

      editor-stage(
        v-model="masks"
        @imageload="onLoadStageImage"
      )

      canvas#canvas(ref="baseCanvas")

      transition(name="fade-delayed")
        loader(v-if="this.ui.isLoadingPreview") Loading Preview




    .context
      .context-intro(v-if="step === 'start'")
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
              p Tap done to adjust the pixels, and download your image.


      .context-masks(v-if="step === 'mask'")
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

      .context-save(v-if="step === 'save'")
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

  ui!: any
  settings!: any
  strings!: any
  images!: any

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
  background-color: var(--color-contrast-5);
  background-image: linear-gradient(
    var(--color-root) 60%,
    var(--color-contrast-10)
  );
  height: 100%;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;

  .loader {
    position: absolute;
    bottom: 0;
    left: 0;
    margin: 1rem;
  }
}

#canvas {
  display: none;
}

.context {
  position: absolute;
  bottom: 0;
  width: 100%;
  padding-bottom: clamp(max(2rem, env(safe-area-inset-bottom)), 5vw, 3rem);
  pointer-events: none;
}

.context button,
.context .button {
  background-color: var(--color-root);
  padding: em(13);
  border-radius: rem(48);
  box-shadow: 0 0 0 1px var(--color-contrast-alpha-10);

  &._primary {
    color: var(--color-white);
    background-color: var(--color-key);
  }
}

.context-masks,
.context-save {
  display: flex;
  justify-content: center;
}

.context-controls {
  pointer-events: auto;
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin: 0 1rem;
  width: 100%;
  max-width: 20rem;

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
      padding: 0;
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

.fade-delayed-enter {
  opacity: 0;
  transition: opacity 0.2s 0.2s;
}
</style>
