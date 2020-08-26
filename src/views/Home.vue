<template lang="pug">

  main

    .editor(:class="{ _preview: isPreview }")

      label.editor-uploader(
        for="file-input"
        v-if="!images.input"
      )
        span Upload an image
        input#file-input(
          type="file"
          accept="image/*"
          @change="onFileChange"
        )

      stage(
        v-model="masks"
        @change="onStageChange"
        @imageload="onLoadStageImage"
      )

      canvas#canvas(ref="baseCanvas")

    .context

      button(
        v-if="images.output"
        :disabled="!masks.length"
        @click="onClickPreviewToggle"
      )
        span(v-if="isPreview") Edit
        span(v-if="!isPreview") Preview

      .layers(v-if="!isPreview")
        .layer(v-if="images.input")
          button(@click="onClickAddMask") Add Mask
          .layer(
            v-for="mask in masks"
            :key="mask.id"
            :class="{_highlight: mask.id === ui.maskHighlight}"
            @mouseenter="onMouseenterLayer(mask.id)"
            @mouseleave="onMouseleaveLayer(mask.id)"
          )
            span w: {{ mask.w }}
            | &puncsp;
            span h: {{ mask.h }}
            | &puncsp;
            span x: {{ mask.x }}
            | &puncsp;
            span y: {{ mask.y }}
            | &puncsp;

            button(@click="onClickDeleteMask(mask.id)") Delete


      .output(v-if="isPreview")

        p
          input(
            type="range"
            min="0.05"
            max="0.3"
            step="0.01"
            v-model="pixelScale"
            @input="updateOutput"
          )

        p
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
import Stage from '@/components/Stage.vue'
import ImageMask from '@/components/ImageMask.vue'

@Component({
  components: {
    Loader,
    Stage,
    ImageMask,
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

  getStageImageCentre(image: HTMLImageElement) {
    const windowCentreX = window.innerWidth / 2
    const imageRect = image.getBoundingClientRect()
    const x = Math.floor(windowCentreX - imageRect.x)
    const y = Math.floor(window.innerHeight * 0.28 - imageRect.y)
    return { x, y }
  }

  onLoadStageImage(image: HTMLImageElement) {
    if (!this.masks.length) {
      const { x, y } = this.getStageImageCentre(image)
      this.addMask(x - 64, y)
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

  addMask(x = 40, y = 40, w = 128, h = 32) {
    this.$store.commit('addMask', { x, y, w, h })
    this.$store.dispatch('updateOutput')
  }

  onClickDeleteMask(id: number) {
    this.$store.commit('removeMask', id)
    this.$store.dispatch('updateOutput')
  }

  onClickAddMask() {
    this.addMask()
  }

  onMouseenterLayer(id: number) {
    this.$store.commit('updateUI', { key: 'maskHighlight', value: id })
  }
  onMouseleaveLayer(id: number) {
    this.$store.commit('updateUI', { key: 'maskHighlight', value: null })
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
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
}

.editor-uploader {
  text-align: center;
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;

  input {
    position: absolute;
    clip: rect(0 0 0 0);
  }
}

.layer {
  background-color: var(--color-root);

  &._highlight {
    background-color: var(--grey-lightest);
  }
}

#canvas {
  display: none;
}
</style>
