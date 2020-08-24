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
    console.log(id)
    this.maskHighlighted = id
  }
  onMouseleaveMask(id: number) {
    this.maskHighlighted = null
  }

  onClickDeleteMask(id: number) {
    const i = this.masks.findIndex(x => x.id === id)
    console.log(id, i)
    this.masks.splice(i, 1)
  }

  onClickAddMask() {
    this.masks.push({
      id: new Date().getTime(),
      x: 0,
      y: 0,
      w: 100,
      h: 30,
    })
  }

  canvasContext!: CanvasRenderingContext2D | null

  mounted() {
    this.canvasContext = (this.$refs.canvas as HTMLCanvasElement).getContext(
      '2d'
    )
    console.log(this.canvasContext)
  }

  imageDownloadName = 'pixelated'
  imageDownloadHref = ''

  updateCanvas() {
    if (this.canvasContext) {
      const img = new Image()
      img.onload = e => {
        this.canvasContext!.canvas.width = img.width
        this.canvasContext!.canvas.height = img.height
        this.canvasContext!.drawImage(img, 0, 0)
        this.imageDownloadHref = this.canvasContext!.canvas.toDataURL()
      }
      img.src = this.readerImage as string
    }
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
      console.log(reader)
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
