<template lang="pug">

  main
    .layout
      input(
        type="file"
        accept="image/*"
        @change="onFileChange"
      )

    .stage
      .stage-inner
        .context
          img(
            ref="image"
            :src="readerImage"
          )
          template(v-for="mask in masks")
            image-mask(
              :data="mask"
              @drag="onMaskDrag"
              @resize="onMaskResize"
            )

    .layers
      .layer(v-if="this.readerImage")
        button(@click="onClickAddMask") Add Mask
      template(v-for="mask in masks")
        .layer
          .span Mask
          button Select
          button Delete


</template>
<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import Loader from '@/components/Loader.vue'
import ImageMask from '@/components/ImageMask.vue'

@Component({
  components: {
    Loader,
    ImageMask,
  },
})
export default class Home extends Vue {
  readerImage: FileReader['result'] = ''
  masks: any[] = []

  onMaskDrag(e) {
    const mask = this.masks.find(x => x.id === e.id)
    const maxX = (this.$refs.image as HTMLImageElement).width - mask.w
    const maxY = (this.$refs.image as HTMLImageElement).height - mask.h
    let { x, y } = e

    if (e.x < 0) {
      x = 0
    }

    if (e.x > maxX) {
      x = maxX
    }

    if (e.y < 0) {
      y = 0
    }

    if (e.y > maxY) {
      y = maxY
    }

    mask.x = x
    mask.y = y
  }

  onMaskResize(e) {
    console.log(e)
    const mask = this.masks.find(x => x.id === e.id)
    const min = 10
    const maxW = (this.$refs.image as HTMLImageElement).width - mask.x
    const maxH = (this.$refs.image as HTMLImageElement).height - mask.y
    let { w, h } = e

    if (e.w < min) {
      w = min
    }

    if (e.w > maxW) {
      w = maxW
    }

    if (e.h < min) {
      h = min
    }

    if (e.h > maxH) {
      h = maxH
    }

    mask.w = w
    mask.h = h
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

  onLoadReader(result: FileReader['result']) {
    this.readerImage = result
  }

  updateImage(file: File) {
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
</style>
