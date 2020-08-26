<template lang="pug">

  main

    .editor(:class="{ _preview: isPreview }")

      editor-uploader(
        :hidden="images.input"
      )

      editor-stage(
        v-model="masks"
        @change="onStageChange"
        @imageload="onLoadStageImage"
      )

      canvas#canvas(ref="baseCanvas")

    .context

      .context-controls
        context-uploader(
          v-if="images.input"
        ) New Image

        button(
          v-if="images.output"
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

  onClickPreviewToggle() {
    this.isPreview = !this.isPreview
  }

  // Upload

  onLoadStageImage(image: HTMLImageElement) {
    if (!this.masks.length) {
      const { x, y } = this.getStageCentre()
      this.addMask(x - 64, y - 16)
    }
  }

  onLoadReader(result: FileReader['result']) {
    this.$store.commit('updateImage', { key: 'input', value: result })
    this.updateOutput()
  }

  updateImage(file: File) {
    const reader = new FileReader()
    reader.onload = e => {
      this.onLoadReader(reader.result)
    }
    reader.readAsDataURL(file)
    this.$store.commit('updateString', {
      key: 'download',
      value: `pixelated-${file.name}`,
    })
  }

  onFileChange(e: InputEvent) {
    const files = (e.target as HTMLInputElement).files
    if (files?.length) {
      this.updateImage(files[0])
    }
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
      console.log(stage, context)
      const stageCentreX = stage.clientWidth / 2
      const stageCentreY = stage.clientHeight / 2
      x = Math.floor(stageCentreX - context.x)
      y = Math.floor(stageCentreY - context.y)
    }
    return { x, y }
  }

  addMask(x = 40, y = 40, w = 128, h = 32) {
    this.$store.commit('addMask', { x, y, w, h })
    this.$store.dispatch('updateOutput')
  }

  onClickAddMask() {
    const { x, y } = this.getStageCentre()
    this.addMask(x - 64, y - 16)
  }

  // Stage

  onStageChange() {
    this.$store.dispatch('updateOutput')
  }

  // Output

  updateOutput() {
    this.$store.dispatch('updateOutput')
  }
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
}
</style>
