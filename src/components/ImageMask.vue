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
    this.$emit('change')
  }

  onTouchend(e: TouchEvent) {
    this.isDragging = false
    this.isResizing = false
    document.removeEventListener('touchmove', this.onTouchmoveMask)
    document.removeEventListener('touchmove', this.onTouchmoveHandle)
    document.removeEventListener('touchend', this.onTouchend)
    this.$emit('change')
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
$mask-box-color: #447;
$mask-handle-color: #0f6;
$mask-handle-inset: 10px;

.mask {
  position: absolute;
}

.mask .box {
  cursor: grab;
  background-color: $mask-box-color;
  box-shadow: 0 0 0 1px transparent;
  width: 100%;
  height: 100%;
  transition: background-color 0.2s, box-shadow 0.1s;
}

.mask._drag .box {
  cursor: grabbing;
}

.mask:hover .box {
  background-color: fade-out($mask-box-color, 0.4);
  // box-shadow: inset 0 0 0 1px $mask-box-color;
}

.mask .handle {
  --handle-touch-size: 36px;
  --handle-dot-size: 10px;

  cursor: nwse-resize;

  position: absolute;
  left: 100%;
  top: 100%;
  z-index: 0;

  width: var(--handle-touch-size);
  height: var(--handle-touch-size);
  margin: (-$mask-handle-inset) 0 0 (-$mask-handle-inset);

  mix-blend-mode: exclusion;
  transition: opacity 0.1s;

  &:hover {
    opacity: 1;
    --handle-dot-size: 16px;
  }

  &:after {
    content: '';
    display: block;
    position: absolute;
    left: $mask-handle-inset - 0.5px;
    top: $mask-handle-inset;

    width: calc(32px - var(--handle-dot-size));
    height: 0;
    transform: rotateZ(45deg);
    transform-origin: 0 0;

    background-color: $mask-handle-color;
    box-shadow: 0 0 0 0.5px $mask-handle-color;

    transition: width 0.1s;
    will-change: width;
  }
}

.mask .handle-actual {
  position: absolute;
  bottom: 2px;
  right: 2px;

  width: var(--handle-dot-size);
  height: var(--handle-dot-size);

  background-color: black;
  border: 1.5px solid $mask-handle-color;
  border-radius: 100px;

  transition: width 0.1s, height 0.1s;
  will-change: width, height;
}
</style>
