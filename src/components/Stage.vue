<template lang="pug">

  .stage
    .stage-inner
      .stage-context
        img.stage-image-base(
          ref="baseImage"
          draggable="false"
          :src="baseImage"
        )
        img.stage-image-preview(
          ref="previewImage"
          draggable="false"
          :src="previewImage"
        )

        template(v-for="mask in value")
          image-mask(
            :data="mask"
            @drag="onDragMask"
            @resize="onResizeMask"
            @mouseenter="$emit('maskmouseenter', mask.id)"
            @mouseleave="$emit('maskmouseleave', mask.id)"
            @change="$emit('change')"
          )

</template>
<script lang="ts">
import { Component, Prop, Ref, Vue } from 'vue-property-decorator'
import ImageMask from '@/components/ImageMask.vue'

@Component({
  components: {
    ImageMask,
  },
})
export default class Stage extends Vue {
  @Prop() baseImage!: FileReader['result']
  @Prop() previewImage!: string
  @Prop() value!: any[]

  @Ref('baseImage') readonly imgBase!: HTMLImageElement
  @Ref('previewImage') readonly imgPreview!: HTMLImageElement

  onDragMask(e: any) {
    const mask = this.value.find(x => x.id === e.id)
    const maxX = this.imgBase.width - mask.w
    const maxY = this.imgBase.height - mask.h
    mask.x = Math.max(0, Math.min(maxX, e.x))
    mask.y = Math.max(0, Math.min(maxY, e.y))
    this.$emit('input', this.value)
  }

  onResizeMask(e: any) {
    const mask = this.value.find(x => x.id === e.id)
    const min = 10
    const maxW = this.imgBase.width - mask.x
    const maxH = this.imgBase.height - mask.y
    mask.w = Math.max(min, Math.min(maxW, e.w))
    mask.h = Math.max(min, Math.min(maxH, e.h))
    this.$emit('input', this.value)
  }
}
</script>
<style lang="scss">
.stage {
  display: flex;
  background-color: var(--grey-lightest);
  overflow: auto;
  width: 100%;
  min-height: 58vh;
}
.stage-inner {
  padding: 2rem;
  padding-top: calc(2rem + env(safe-area-inset-top));
  margin: auto;
}
.stage-context {
  position: relative;
}

.stage img {
  user-select: none;
}

.stage-image-preview {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: auto;
  opacity: 0;
}
</style>
