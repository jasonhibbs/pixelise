<template lang="pug">

  main

    .editor(:class="{ _preview: isPreviewing }")

      label.editor-uploader(
        for="file-input"
        v-if="!readerImage"
      )
        span Upload an image
        input#file-input(
          type="file"
          accept="image/*"
          @change="onFileChange"
        )


      stage(
        v-model="masks"
        :base-image="readerImage"
        :preview-image="finalImage"
        :highlight="maskHighlighted"
        @maskmouseenter="onMouseenterMask"
        @maskmouseleave="onMouseleaveMask"
        @change="onStageChange"
        @imageload="onLoadStageImage"
      )

      canvas#canvas(ref="baseCanvas")

    .context

      button(
        v-if="finalImage"
        :disabled="!masks.length"
        @click="onClickPreviewToggle"
      )
        span(v-if="isPreviewing") Edit
        span(v-if="!isPreviewing") Preview

      .layers(v-if="!isPreviewing")
        .layer(v-if="this.readerImage")
          button(@click="onClickAddMask") Add Mask
          .layer(
            v-for="mask in masks"
            :key="mask.id"
            :class="{_highlight: mask.id === maskHighlighted}"
            @mouseenter="onMouseenterMask(mask.id)"
            @mouseleave="onMouseleaveMask(mask.id)"
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


      .output(v-if="isPreviewing")

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
            v-if="finalImage"
            :download="imageDownloadName"
            :href="finalImage"
          ) Download

</template>
<script lang="ts">
import { Component, Ref, Vue } from 'vue-property-decorator'
import Loader from '@/components/Loader.vue'
import Stage from '@/components/Stage.vue'
import ImageMask from '@/components/ImageMask.vue'

@Component({
  components: {
    Loader,
    Stage,
    ImageMask,
  },
})
export default class Home extends Vue {
  @Ref('baseCanvas') readonly canvasElement!: HTMLCanvasElement

  readerImage: FileReader['result'] = null
  imageDownloadName = 'pixelated'
  finalImage = ''
  pixelScale = 0.22
  masks: any[] = []
  maskHighlighted: number | null = null

  // Lifecycle

  canvasContext!: CanvasRenderingContext2D | null
  mounted() {
    this.canvasContext = this.canvasElement.getContext('2d')
  }

  // Preview

  isPreviewing = false

  onClickPreviewToggle() {
    this.isPreviewing = !this.isPreviewing
  }

  // Upload

  onLoadStageImage(image: HTMLImageElement) {
    if (!this.masks.length) {
      const windowCentreX = window.innerWidth / 2
      const imageRect = image.getBoundingClientRect()
      const x = Math.floor(windowCentreX - imageRect.x - 64)
      const y = Math.floor(window.innerHeight * 0.28 - imageRect.y)
      this.addMask(x, y)
    }
  }

  onLoadReader(result: FileReader['result']) {
    this.readerImage = result
    this.updateOutput()
  }

  updateImage(file: File) {
    this.imageDownloadName = `pixelated-${file.name}`
    const reader = new FileReader()
    reader.onload = e => {
      this.onLoadReader(reader.result)
    }
    reader.readAsDataURL(file)
  }

  onFileChange(e: InputEvent) {
    const files = (e.target as HTMLInputElement).files
    if (files?.length) {
      this.updateImage(files[0])
    }
  }

  // Mask Highlight

  onMouseenterMask(id: number) {
    this.maskHighlighted = id
  }
  onMouseleaveMask(id: number) {
    this.maskHighlighted = null
  }

  // Layers

  addMask(x = 40, y = 40, w = 128, h = 32) {
    this.masks.push({ id: new Date().getTime(), x, y, w, h })
    this.updateOutput()
  }

  onClickDeleteMask(id: number) {
    const i = this.masks.findIndex(x => x.id === id)
    this.masks.splice(i, 1)
    this.updateOutput()
  }

  onClickAddMask() {
    this.addMask()
  }

  // Stage

  onStageChange() {
    this.updateOutput()
  }

  // Output

  updateOutput() {
    const ctx = this.canvasContext
    const img = new Image()
    img.onload = e => {
      if (ctx) {
        ctx.canvas.width = img.width
        ctx.canvas.height = img.height
        ctx.drawImage(img, 0, 0)
        this.drawMasks(ctx, img)
        this.finalImage = ctx.canvas.toDataURL()
      }
    }
    img.src = this.readerImage as string
  }

  drawMasks(
    originalContext: CanvasRenderingContext2D,
    originalImage: HTMLImageElement
  ) {
    originalContext.imageSmoothingEnabled = false
    this.masks.forEach(mask => {
      const { x, y, w, h } = mask
      const newWidth = w * this.pixelScale
      const newHeight = h * this.pixelScale
      const newCanvas = document.createElement('canvas')
      newCanvas.width = newWidth
      newCanvas.height = newHeight
      const newContext = newCanvas.getContext('2d')
      newContext!.drawImage(
        originalImage,
        x,
        y,
        w,
        h,
        0,
        0,
        newWidth,
        newHeight
      )
      originalContext.drawImage(newCanvas, x, y, w, h)
    })
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
