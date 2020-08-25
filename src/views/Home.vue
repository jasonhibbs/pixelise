<template lang="pug">

  main
    .layout
      input(
        type="file"
        accept="image/*"
        @change="onFileChange"
      )

    stage(
      :image="readerImage"
      v-model="masks"
      @maskmouseenter="onMouseenterMask"
      @maskmouseleave="onMouseleaveMask"
      @change="onStageChange"
    )

    .layers
      .layer(v-if="this.readerImage")
        button(@click="onClickAddMask") Add Mask
      template(v-for="mask in masks")
        .layer(
          :class="{_highlight: mask.id === maskHighlighted}"
          @mouseenter="onMouseenterMask(mask.id)"
          @mouseleave="onMouseleaveMask(mask.id)"
        )
          h2 Mask
          span id: {{ mask.id }}
          | &puncsp;
          span w: {{ mask.w }}
          | &puncsp;
          span h: {{ mask.h }}
          | &puncsp;
          span x: {{ mask.x }}
          | &puncsp;
          span y: {{ mask.y }}
          | &puncsp;

          button(@click="onClickDeleteMask") Delete


    .output
      canvas(ref="canvas")
      a(
        :download="imageDownloadName"
        :href="imageDownloadHref"
      ) Download

</template>
<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
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
  readerImage: FileReader['result'] = null
  masks: any[] = []

  maskHighlighted: number | null = null

  onMouseenterMask(id: number) {
    this.maskHighlighted = id
  }
  onMouseleaveMask(id: number) {
    this.maskHighlighted = null
  }

  onClickDeleteMask(id: number) {
    const i = this.masks.findIndex(x => x.id === id)
    this.masks.splice(i, 1)
    this.updateCanvas()
  }

  onClickAddMask() {
    this.masks.push({
      id: new Date().getTime(),
      x: 0,
      y: 0,
      w: 100,
      h: 30,
    })
    this.updateCanvas()
  }

  onStageChange() {
    this.updateCanvas()
  }

  canvasContext!: CanvasRenderingContext2D | null

  mounted() {
    this.canvasContext = (this.$refs.canvas as HTMLCanvasElement).getContext(
      '2d'
    )
  }

  imageDownloadName = 'pixelated'
  imageDownloadHref = ''

  pixelScale = 0.22

  addMasks(
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

  updateCanvas() {
    const ctx = this.canvasContext
    const img = new Image()
    img.onload = e => {
      if (ctx) {
        ctx.canvas.width = img.width
        ctx.canvas.height = img.height
        ctx.drawImage(img, 0, 0)
        this.addMasks(ctx, img)
        this.imageDownloadHref = ctx.canvas.toDataURL()
      }
    }
    img.src = this.readerImage as string
  }

  onLoadReader(result: FileReader['result']) {
    this.readerImage = result
    this.updateCanvas()
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
}
</script>
<style lang="scss">
.stage {
  display: flex;
  background-color: var(--grey-lightest);
  overflow: auto;
}
.stage-inner {
  padding: 2rem;
  margin: auto;
}
.context {
  position: relative;
}

.stage img {
  user-select: none;
}

.layer {
  background-color: var(--color-root);

  &._highlight {
    background-color: var(--grey-lightest);
  }
}
</style>
