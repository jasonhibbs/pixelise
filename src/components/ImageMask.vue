<template lang="pug">

  .mask(
    :data-id="data.id"
    :style="styles"
    @mousedown.stop="onMousedownMask"
    @touchstart.stop.prevent="onTouchstartMask"
  )
    .handle(
      @mousedown.stop="onMousedownHandle"
      @touchstart.stop.prevent="onTouchstartHandle"
    )

</template>
<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator'

@Component
export default class ImageMask extends Vue {
  @Prop() data: any

  get styles() {
    return {
      width: `${this.data.w}px`,
      height: `${this.data.h}px`,
      left: `${this.data.x}px`,
      top: `${this.data.y}px`,
    }
  }

  // Drag & Resize

  dragStartX = 0
  dragStartY = 0
  maskStartX = 0
  maskStartY = 0
  maskStartW = 0
  maskStartH = 0

  onMouseup(e: MouseEvent) {
    document.removeEventListener('mousemove', this.onMousemoveMask)
    document.removeEventListener('mousemove', this.onMousemoveHandle)
    document.removeEventListener('mouseup', this.onMouseup)
  }

  onTouchend(e: TouchEvent) {
    document.removeEventListener('touchmove', this.onTouchmoveMask)
    document.removeEventListener('touchmove', this.onTouchmoveHandle)
    document.removeEventListener('touchend', this.onTouchend)
  }

  // Drag

  emitFromDragCoordinates(x: number, y: number) {
    this.$emit('drag', {
      id: this.data.id,
      x: this.maskStartX + (x - this.dragStartX),
      y: this.maskStartY + (y - this.dragStartY),
    })
  }

  // Drag Mouse

  onMousemoveMask(e: MouseEvent) {
    this.emitFromDragCoordinates(e.clientX, e.clientY)
  }

  onMousedownMask(e: MouseEvent) {
    this.dragStartX = e.clientX
    this.dragStartY = e.clientY
    this.maskStartX = this.data.x
    this.maskStartY = this.data.y

    document.addEventListener('mousemove', this.onMousemoveMask)
    document.addEventListener('mouseup', this.onMouseup)
  }

  // Drag Touch

  onTouchmoveMask(e: TouchEvent) {
    this.emitFromDragCoordinates(e.touches[0].pageX, e.touches[0].pageY)
  }

  onTouchstartMask(e: TouchEvent) {
    this.dragStartX = e.touches[0].pageX
    this.dragStartY = e.touches[0].pageY
    this.maskStartX = this.data.x
    this.maskStartY = this.data.y

    document.addEventListener('touchmove', this.onTouchmoveMask)
    document.addEventListener('touchend', this.onTouchend)
  }

  // Resize

  emitFromResizeCoordinates(x: number, y: number) {
    this.$emit('resize', {
      id: this.data.id,
      w: this.maskStartW + (x - this.dragStartX),
      h: this.maskStartH + (y - this.dragStartY),
    })
  }

  // Resize Mouse

  onMousemoveHandle(e: MouseEvent) {
    this.emitFromResizeCoordinates(e.clientX, e.clientY)
  }

  onMousedownHandle(e: MouseEvent) {
    this.dragStartX = e.clientX
    this.dragStartY = e.clientY
    this.maskStartW = this.data.w
    this.maskStartH = this.data.h

    document.addEventListener('mousemove', this.onMousemoveHandle)
    document.addEventListener('mouseup', this.onMouseup)
  }

  // Resize Touch

  onTouchmoveHandle(e: TouchEvent) {
    this.emitFromResizeCoordinates(e.touches[0].pageX, e.touches[0].pageY)
  }

  onTouchstartHandle(e: TouchEvent) {
    this.dragStartX = e.touches[0].pageX
    this.dragStartY = e.touches[0].pageY
    this.maskStartW = this.data.w
    this.maskStartH = this.data.h

    document.addEventListener('touchmove', this.onTouchmoveHandle)
    document.addEventListener('touchend', this.onTouchend)
  }
}
</script>
<style lang="scss">
.mask {
  background-color: black;
  position: absolute;
  cursor: grab;
}

.handle {
  cursor: nwse-resize;
  --size: 24px;
  position: absolute;
  width: var(--size);
  height: var(--size);
  left: 100%;
  top: 100%;
  background-color: #f0f;
}
</style>
