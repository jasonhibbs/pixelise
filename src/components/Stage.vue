<template lang="pug">

  .stage
    .stage-inner
      .context
        img(
          ref="image"
          draggable="false"
          :src="image"
        )
        template(v-for="mask in value")
          image-mask(
            :data="mask"
            @drag="onDragMask"
            @resize="onResizeMask"
            @mouseenter="$emit('maskmouseenter', mask.id)"
            @mouseleave="$emit('maskmouseleave', mask.id)"
          )

</template>
<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator'
import ImageMask from '@/components/ImageMask.vue'

@Component({
  components: {
    ImageMask,
  },
})
export default class Stage extends Vue {
  @Prop() image!: FileReader['result']
  @Prop() value!: any[]

  onDragMask(e: any) {
    const mask = this.value.find(x => x.id === e.id)
    const maxX = (this.$refs.image as HTMLImageElement).width - mask.w
    const maxY = (this.$refs.image as HTMLImageElement).height - mask.h
    mask.x = Math.max(0, Math.min(maxX, e.x))
    mask.y = Math.max(0, Math.min(maxY, e.y))
    this.$emit('input', this.value)
  }

  onResizeMask(e: any) {
    const mask = this.value.find(x => x.id === e.id)
    const min = 10
    const maxW = (this.$refs.image as HTMLImageElement).width - mask.x
    const maxH = (this.$refs.image as HTMLImageElement).height - mask.y
    mask.w = Math.max(min, Math.min(maxW, e.w))
    mask.h = Math.max(min, Math.min(maxH, e.h))
    this.$emit('input', this.value)
  }
}
</script>
