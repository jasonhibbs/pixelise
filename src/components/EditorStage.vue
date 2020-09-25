<template lang="pug">

  .stage(
    ref="stage"
    :class="classes"
  )
    .stage-inner
      .stage-context(
        @click.left="onClickStage"
        @dblclick.left="onDblclickStage"
        @mousedown.left="onMousedownStage"
      )
        transition(
          name="grow"
          appear
          @after-enter="onAfterEnter"
        )
          img.stage-image-base(
            v-if="images.input"
            ref="baseImage"
            draggable="false"
            :src="images.input"
            @load="onImageLoad"
          )
        img.stage-image-preview(
          ref="previewImage"
          draggable="false"
          :src="images.output"
        )

        .mask._drawn(
          v-if="isDrawing"
          ref="drawnMask"
          :style="drawnMaskStyles"
        )
          .box

        template(v-for="mask in value")
          image-mask(
            :data="mask"
            :key="mask.id"
            @drag="onDragMask"
            @resize="onResizeMask"
            @change="$emit('change')"
          )

</template>
<script lang="ts">
import { Component, Prop, Ref, Vue } from 'vue-property-decorator'
import { mapState } from 'vuex'
import debounce from 'lodash.debounce'
import throttle from 'lodash.throttle'
import ImageMask from '@/components/ImageMask.vue'

@Component({
  components: {
    ImageMask,
  },
  computed: mapState(['ui', 'images']),
})
export default class EditorStage extends Vue {
  @Ref('stage') readonly stage!: HTMLDivElement
  @Ref('baseImage') readonly imgBase!: HTMLImageElement
  @Ref('previewImage') readonly imgPreview!: HTMLImageElement

  @Prop() value!: Mask[]

  ui!: any
  images!: any

  get classes() {
    return {
      _drawing: this.isDrawing,
    }
  }

  mounted() {
    window.addEventListener('resize', this.onResizeThrottle)
    window.addEventListener('resize', this.onResizeDebounce)
  }

  beforeDestroy() {
    window.removeEventListener('resize', this.onResizeThrottle)
    window.removeEventListener('resize', this.onResizeDebounce)
  }

  // New Image

  isFirstImage = true

  onImageLoad() {
    this.stage.scrollTop = 0
    this.stage.scrollLeft = 0
    this.$emit('imageload', this.imgBase)

    if (!this.isFirstImage) {
      this.refreshRect()
    }
  }

  onAfterEnter() {
    this.refreshRect()
    this.isFirstImage = false
  }

  // Image Rect

  imageRect: DOMRect = new DOMRect()
  imageScale = 1

  refreshRect() {
    this.imageRect = this.imgBase.getBoundingClientRect()
    this.imageScale = this.imgBase.naturalWidth / this.imageRect.width
    this.$store.commit('updateUI', {
      key: 'imageScale',
      value: this.imageScale,
    })
    this.$store.commit('updateUI', { key: 'imageRect', value: this.imageRect })
  }

  // Resize

  onResizeThrottle = throttle(() => {
    document.documentElement.classList.add('_resizing')
  }, 200)

  onResizeDebounce = debounce(() => {
    document.documentElement.classList.remove('_resizing')
    this.onResizeEnd()
  }, 400)

  onResizeEnd() {
    if (!this.imgBase) {
      return
    }
    const oldWidth = this.imageRect.width
    this.refreshRect()
    this.$store.dispatch('resizeMasks', oldWidth / this.imageRect.width)
  }

  // Drawing

  isDrawing = false
  drawingTimeout = 0

  drawnMask: DrawnMask = {
    startX: 0,
    startY: 0,
    x: 0,
    y: 0,
    w: 0,
    h: 0,
  }

  get drawnMaskStyles() {
    const { x, y, w, h } = this.drawnMask
    return {
      left: `${x}px`,
      top: `${y}px`,
      width: `${w}px`,
      height: `${h}px`,
    }
  }

  onMousedownStage(e: MouseEvent) {
    if (this.ui.isApp && this.ui.isIos && this.ui.showingPreview) {
      return
    }
    if (this.images.input) {
      this.refreshRect()
      this.drawnMask.startX = e.clientX - this.imageRect.x
      this.drawnMask.startY = e.clientY - this.imageRect.y
      this.drawnMask.x = this.drawnMask.startX
      this.drawnMask.y = this.drawnMask.startY
      this.drawnMask.w = 0
      this.drawnMask.h = 0
      document.addEventListener('mousemove', this.onMousemoveDrawing)
      document.addEventListener('mouseup', this.onMouseupDrawing)

      this.drawingTimeout = setTimeout(() => {
        this.isDrawing = true
        this.$store.commit('updateUI', { key: 'showingPreview', value: false })
      }, 100)
    }
  }

  onMousemoveDrawing(e: MouseEvent) {
    const newX = Math.max(0, e.clientX - this.imageRect.x)
    const newY = Math.max(0, e.clientY - this.imageRect.y)
    const maxW = this.imgBase.width - this.drawnMask.x
    const maxH = this.imgBase.height - this.drawnMask.y

    if (newX < this.drawnMask.startX) {
      this.drawnMask.x = Math.max(0, Math.floor(newX))
      this.drawnMask.w = Math.floor(this.drawnMask.startX - newX)
    } else {
      const w = newX - this.drawnMask.startX
      this.drawnMask.x = Math.floor(this.drawnMask.startX)
      this.drawnMask.w = Math.max(1, Math.min(maxW, Math.floor(w)))
    }

    if (newY < this.drawnMask.startY) {
      this.drawnMask.y = Math.max(0, Math.floor(newY))
      this.drawnMask.h = Math.floor(this.drawnMask.startY - newY)
    } else {
      const h = newY - this.drawnMask.startY
      this.drawnMask.y = Math.floor(this.drawnMask.startY)
      this.drawnMask.h = Math.max(1, Math.min(maxH, Math.floor(h)))
    }
  }

  onMouseupDrawing() {
    document.removeEventListener('mousemove', this.onMousemoveDrawing)
    document.removeEventListener('mouseup', this.onMouseupDrawing)

    if (this.isDrawing && this.drawnMask.w >= 12 && this.drawnMask.h >= 12) {
      this.$store.commit('addMask', this.drawnMask)
    }

    clearTimeout(this.drawingTimeout)
    this.isDrawing = false
  }

  // Stage

  onClickStage() {
    clearTimeout(this.drawingTimeout)
    if (this.ui.showingPreview) {
      this.$store.commit('updateUI', { key: 'showingPreview', value: false })
    }
  }

  onDblclickStage(e: MouseEvent) {
    this.$store.commit('updateUI', { key: 'showingPreview', value: false })
    this.refreshRect()
    const w = 128
    const h = 32
    const maxX = this.imgBase.width - w
    const maxY = this.imgBase.height - h
    const targetX = Math.floor(e.clientX - this.imageRect.x - w / 2)
    const targetY = Math.floor(e.clientY - this.imageRect.y - h / 2)
    const x = Math.max(0, Math.min(maxX, targetX))
    const y = Math.max(0, Math.min(maxY, targetY))
    this.$store.commit('addMask', { x, y })
  }

  // Masks

  onDragMask(e: Mask) {
    const mask = this.value.find(x => x.id === e.id)
    if (mask === undefined) {
      return
    }
    const maxX = this.imgBase.width - mask.w
    const maxY = this.imgBase.height - mask.h
    mask.x = Math.max(0, Math.min(maxX, Math.floor(e.x)))
    mask.y = Math.max(0, Math.min(maxY, Math.floor(e.y)))
    this.$emit('input', this.value)
  }

  onResizeMask(e: Mask) {
    const mask = this.value.find(x => x.id === e.id)
    if (mask === undefined) {
      return
    }
    const min = 10
    const maxW = this.imgBase.width - mask.x
    const maxH = this.imgBase.height - mask.y
    mask.w = Math.max(min, Math.min(maxW, Math.floor(e.w)))
    mask.h = Math.max(min, Math.min(maxH, Math.floor(e.h)))
    this.$emit('input', this.value)
  }
}
</script>
<style lang="scss">
.stage {
  display: flex;
  overflow: auto;
  width: 100%;
  height: 100%;
  user-select: none;
}

.stage-inner {
  padding: calc(8rem + env(safe-area-inset-bottom)) 3.25rem;
  padding-top: calc(8rem + env(safe-area-inset-top));
  margin: auto;
}

.stage-context {
  position: relative;
  box-shadow: 0 0 4rem var(--color-contrast-alpha-5);
}

.stage img {
  display: block;
  user-select: none;
  box-shadow: 0 0 0 1px var(--color-contrast-alpha-10);
  max-width: min(120vw, 80rem);
  height: auto;
}

.stage-image-base {
  -webkit-touch-callout: none;
}

.stage-image-preview {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: auto;
  opacity: 0;
  will-change: opacity;
  transition: opacity 0.4s;
}

._preview {
  .stage-image-preview {
    opacity: 1;
    transition: opacity 0.1s;
  }
}

._resizing .mask {
  opacity: 0;
}

.grow-enter {
  transform: scale(0.9);
}

.grow-enter-active {
  transition: transform 0.5s cubic-bezier(0.25, 0.83, 0.1, 1);
}
</style>
