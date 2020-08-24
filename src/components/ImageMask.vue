<template lang="pug">

  .mask(
    :style="styles"
    @mousedown="onMaskMousedown"
  )
    .handle(
      @mousedown.stop="onHandleMousedown"
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

  onMouseup(e: MouseEvent) {
    document.removeEventListener('mousemove', this.onMaskMove)
    document.removeEventListener('mousemove', this.onHandleMove)
    document.removeEventListener('mouseup', this.onMouseup)
    console.log('mouseup')
  }

  dragStartX = 0
  dragStartY = 0
  maskStartX = 0
  maskStartY = 0
  maskStartW = 0
  maskStartH = 0

  onMaskMove(e: MouseEvent) {
    const dragNewX = e.clientX
    const dragNewY = e.clientY
    const maskNewX = this.maskStartX + (dragNewX - this.dragStartX)
    const maskNewY = this.maskStartY + (dragNewY - this.dragStartY)
    this.$emit('drag', {
      id: this.data.id,
      x: maskNewX,
      y: maskNewY,
    })
  }

  onMaskMousedown(e: MouseEvent) {
    this.dragStartX = e.clientX
    this.dragStartY = e.clientY
    this.maskStartX = this.data.x
    this.maskStartY = this.data.y

    document.addEventListener('mousemove', this.onMaskMove)
    document.addEventListener('mouseup', this.onMouseup)
  }

  onHandleMove(e: MouseEvent) {
    const dragNewX = e.clientX
    const dragNewY = e.clientY
    const maskNewW = this.maskStartW + (dragNewX - this.dragStartX)
    const maskNewH = this.maskStartH + (dragNewY - this.dragStartY)
    this.$emit('resize', {
      id: this.data.id,
      w: maskNewW,
      h: maskNewH,
    })
  }

  onHandleMousedown(e: MouseEvent) {
    this.dragStartX = e.clientX
    this.dragStartY = e.clientY
    this.maskStartW = this.data.w
    this.maskStartH = this.data.h

    document.addEventListener('mousemove', this.onHandleMove)
    document.addEventListener('mouseup', this.onMouseup)
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
