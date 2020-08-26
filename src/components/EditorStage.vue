<template lang="pug">

  .stage
    .stage-inner
      .stage-context(
        @click="onClickStage"
        @dblclick="onDblclickStage"
      )
        img.stage-image-base(
          ref="baseImage"
          draggable="false"
          :src="images.input"
          @load="$emit('imageload', imgBase)"
        )
        img.stage-image-preview(
          ref="previewImage"
          draggable="false"
          :src="images.output"
        )

        template(v-for="mask in value")
          image-mask(
            :class="{ _highlight: mask.id === ui.maskHighlight}"
            :data="mask"
            @drag="onDragMask"
            @resize="onResizeMask"
            @mouseenter="onMouseenterMask(mask.id)"
            @mouseleave="onMouseleaveMask(mask.id)"
            @change="$emit('change')"
          )

</template>
<script lang="ts">
import { Component, Prop, Ref, Vue } from 'vue-property-decorator'
import { mapState } from 'vuex'
import ImageMask from '@/components/ImageMask.vue'

@Component({
  components: {
    ImageMask,
  },
  computed: mapState(['ui', 'images']),
})
export default class EditorStage extends Vue {
  @Ref('baseImage') readonly imgBase!: HTMLImageElement
  @Ref('previewImage') readonly imgPreview!: HTMLImageElement

  @Prop() value!: any[]

  ui!: any
  images!: any

  // Stage

  onClickStage(e: MouseEvent) {
    if (this.ui.isPreview) {
      this.$store.commit('updateUI', { key: 'isPreview', value: false })
    }
  }

  onDblclickStage(e: MouseEvent) {
    this.$store.commit('updateUI', { key: 'isPreview', value: false })
    const box = (e.target as HTMLElement).getBoundingClientRect()
    const w = 128
    const h = 32
    const maxX = this.imgBase.width - w
    const maxY = this.imgBase.height - h
    const x = Math.max(0, Math.min(maxX, e.clientX - box.x - w / 2))
    const y = Math.max(0, Math.min(maxY, e.clientY - box.y - h / 2))
    this.$store.commit('addMask', { x, y })
    this.$store.dispatch('updateOutput')
  }

  // Masks

  onDragMask(e: any) {
    const mask = this.value.find(x => x.id === e.id)
    const maxX = this.imgBase.width - mask.w
    const maxY = this.imgBase.height - mask.h
    mask.x = Math.max(0, Math.min(maxX, Math.floor(e.x)))
    mask.y = Math.max(0, Math.min(maxY, Math.floor(e.y)))
    this.$emit('input', this.value)
  }

  onResizeMask(e: any) {
    const mask = this.value.find(x => x.id === e.id)
    const min = 10
    const maxW = this.imgBase.width - mask.x
    const maxH = this.imgBase.height - mask.y
    mask.w = Math.max(min, Math.min(maxW, Math.floor(e.w)))
    mask.h = Math.max(min, Math.min(maxH, Math.floor(e.h)))
    this.$emit('input', this.value)
  }

  onMouseenterMask(id: number) {
    this.$store.commit('updateUI', { key: 'maskHighlight', value: id })
  }

  onMouseleaveMask(id: number) {
    this.$store.commit('updateUI', { key: 'maskHighlight', value: null })
  }
}
</script>
<style lang="scss">
.stage {
  display: flex;
  overflow: auto;
  width: 100%;
  height: 100%;
}

.stage-inner {
  padding: 4rem 2.5rem;
  padding-top: calc(4rem + env(safe-area-inset-top));
  margin: auto;
}

.stage-context {
  position: relative;
}

.stage img {
  user-select: none;
  box-shadow: 0 0 0 0.5px var(--contrast-lighter);
}

.stage-image-preview {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: auto;
  opacity: 0;
  will-change: opacity;
  transition: opacity 0.2s;
}

._preview {
  .stage-image-preview {
    opacity: 1;
  }
}
</style>
