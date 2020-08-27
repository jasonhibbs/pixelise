<template lang="pug">

  .mask(
    :data-id="data.id"
    :class="classes"
    :style="styles"
    @mouseenter="$emit('mouseenter')"
    @mouseleave="$emit('mouseleave')"
    @dblclick.stop="onDblclick"
  )
    .box(
      @mousedown.left.stop="onMousedownMask"
      @touchstart.prevent="onTouchstartMask"
    )
    .handle(
      @mousedown.left.stop="onMousedownHandle"
      @touchstart.prevent.stop="onTouchstartHandle"
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

  onDblclick() {
    this.$store.commit('removeMask', this.data.id)
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

  dblclickTouchAwait = false
  dblclickTouchTimer: any

  onTouchstartMask(e: TouchEvent) {
    if (this.dblclickTouchAwait) {
      this.onDblclick()
    } else {
      this.dblclickTouchAwait = true
      this.dblclickTouchTimer = setTimeout(() => {
        this.dblclickTouchAwait = false
      }, 200)
    }

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
$mask-inner-color: black;
$mask-outer-color: white;
$mask-handle-inset: 10px;

.mask {
  position: absolute;
  will-change: opacity;
  transition: opacity 0.2s;

  ._preview & {
    pointer-events: none;
    opacity: 0;
  }

  ._drawing & {
    pointer-events: none;

    .handle {
      opacity: 0;
    }
  }
}

.mask .box {
  cursor: grab;
  background-color: $mask-inner-color;
  box-shadow: 0 0 0 1px fade-out($mask-outer-color, 0.6);
  width: 100%;
  height: 100%;
  transition: background-color 0.2s, box-shadow 0.1s;
}

.mask:hover,
.mask._drawn,
.mask._highlight,
.mask._drag,
.mask._resize {
  z-index: 1;
}

.mask._drag .box {
  cursor: grabbing;
}

.mask:hover .box,
.mask._drawn .box,
.mask._highlight .box {
  background-color: fade-out($mask-inner-color, 0.4);
}

.mask .handle {
  --handle-touch-size: 44px;
  --handle-dot-size: 12px;
  cursor: nwse-resize;
  position: absolute;
  left: 100%;
  top: 100%;
  z-index: 0;
  width: var(--handle-touch-size);
  height: var(--handle-touch-size);
  margin: (-$mask-handle-inset) 0 0 (-$mask-handle-inset);
  transition: opacity 0.4s;

  &:hover {
    --handle-dot-size: 16px;
    opacity: 1;
  }

  &:after {
    content: '';
    display: block;
    position: absolute;
    left: $mask-handle-inset;
    top: $mask-handle-inset;
    width: calc(var(--handle-touch-size) - var(--handle-dot-size));
    height: 0.5px;
    transform: translateY(-0.25px) rotateZ(45deg);
    transform-origin: 0 50%;
    box-shadow: inset 0 0 0 1px $mask-inner-color,
      1px 0 0 1px fade-out($mask-outer-color, 0.4);

    transition: width 0.1s;
    will-change: width;
  }
}

.mask .handle-actual {
  position: absolute;
  bottom: 2px;
  right: 2px;
  z-index: 1;
  width: var(--handle-dot-size);
  height: var(--handle-dot-size);
  background-color: $mask-inner-color;
  box-shadow: 0 0 0 1px fade-out($mask-outer-color, 0.4);
  border-radius: 100px;
  transition: width 0.1s, height 0.1s;
  will-change: width, height;
}
</style>
