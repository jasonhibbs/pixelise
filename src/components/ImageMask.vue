<template lang="pug">

  .mask(
    :data-id="data.id"
    :class="classes"
    :style="styles"
    @mouseenter="$emit('mouseenter')"
    @mouseleave="$emit('mouseleave')"
  )
    .box(
      @mousedown.stop="onMousedownMask"
      @touchstart.stop.prevent="onTouchstartMask"
    )
    .handle(
      @mousedown.stop="onMousedownHandle"
      @touchstart.stop.prevent="onTouchstartHandle"
    )
      .handle-actual

</template>
<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator'

@Component
export default class ImageMask extends Vue {
  @Prop() data: any

  get classes() {
    return {
      _drag: this.isDragging,
      _resize: this.isResizing,
    }
  }

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

  isDragging = false
  isResizing = false

  onMouseup(e: MouseEvent) {
    this.isDragging = false
    this.isResizing = false
    document.removeEventListener('mousemove', this.onMousemoveMask)
    document.removeEventListener('mousemove', this.onMousemoveHandle)
    document.removeEventListener('mouseup', this.onMouseup)
  }

  onTouchend(e: TouchEvent) {
    this.isDragging = false
    this.isResizing = false
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
    this.isDragging = true
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
    this.isDragging = true
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
    this.isResizing = true
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
    this.isResizing = true
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
$color-mask-box: #445;
$color-mask-handle: #f0f;

.mask {
  position: absolute;
}

.mask .box {
  cursor: grab;
  background-color: $color-mask-box;
  box-shadow: 0 0 0 1px transparent;
  width: 100%;
  height: 100%;
  transition: background-color 0.2s, box-shadow 0.1s;
}

.mask._drag .box {
  cursor: grabbing;
}

.mask:hover .box {
  background-color: fade-out($color-mask-box, 0.4);
  // box-shadow: inset 0 0 0 1px $color-mask-box;
}

.mask .handle {
  cursor: nwse-resize;
  --size: 36px;
  position: absolute;
  width: var(--size);
  height: var(--size);
  left: 100%;
  top: 100%;
  opacity: 0.8;
  transition: opacity 0.1s;
  margin: -10px 0 0 -10px;

  &:hover {
    opacity: 1;

    .handle-actual {
      --size: 14px;
    }
  }
}

.mask .handle-actual {
  --size: 8px;
  width: var(--size);
  height: var(--size);
  margin-top: 12px;
  margin-left: 12px;
  border-radius: 1px;
  background-color: $color-mask-handle;
  transition: width 0.2s, height 0.2s;
}
</style>
