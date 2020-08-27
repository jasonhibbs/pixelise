<template lang="pug">

  main

    .editor(:class="{ _preview: isPreview,  _loading: this.ui.isLoadingPreview }")

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

      .context-controls
        context-uploader(
          v-if="images.input"
        ) New Image

        button(
          v-if="images.input"
          :disabled="!masks.length"
          @click="onClickPreviewToggle"
        )
          span(v-if="isPreview") Edit
          span(v-if="!isPreview") Preview

      .layout

        .starting(v-if="!images.input")
          ol
            li Add an image
            li Cover it up
            li Download

        .editing(v-if="!isPreview")

          .layers
            layer-mask(
              v-for="mask in masks"
              :key="mask.id"
              :data="mask"
            )

          button(
            v-if="!isPreview && images.input"
            @click="onClickAddMask"
          ) Add Mask

        .exporting(v-if="isPreview")

          .fields
            .field
              label.field-label(for="input-density") Pixel Density
              .field-controls
                input#input-density(
                  type="range"
                  min="0.05"
                  max="0.3"
                  step="0.01"
                  v-model="pixelScale"
                  @input="updateOutput"
                )
              p.field-message(v-if="isLargeImage") Big images take longer to update

            .field
              .field-controls
                a.button(
                  v-if="images.output"
                  :href="images.output"
                  :download="strings.download"
                ) Download

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

@Component({
  components: {
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

  get isPreview() {
    return this.ui.isPreview
  }

  set isPreview(value: boolean) {
    this.$store.commit('updateUI', { key: 'isPreview', value })
  }

  isLoadingPreview = false

  onClickPreviewToggle() {
    if (!this.isPreview) {
      this.updateOutput()
    }
    this.isPreview = !this.isPreview
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
.editor {
  background-color: var(--grey-light);
  height: 58vh;
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
  padding-bottom: 8rem;
}

.context-controls {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  grid-gap: 1px;
}

.layers {
  margin: 1rem 0;
}

.fields,
.field + .field {
  margin-top: 1rem;
}

@media (min-width: 768px) {
  html,
  body,
  #app,
  main {
    height: 100%;
  }

  main {
    display: grid;
    grid-template-columns: minmax(0, 1fr) 20rem;
  }

  .editor {
    height: 100vh;
  }

  .context {
    z-index: 1;
    box-shadow: -3px 0 0 var(--contrast-lightest),
      -0.5px 0 0 var(--contrast-lighter);
  }
}

.fade-delayed-enter {
  opacity: 0;
  transition: opacity 0.2s 0.2s;
}
</style>
