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

    button(
      title="Remove Mask"
      @mousedown.stop
      @click.stop="onClickDelete"
    )
      .button
        icon-svg(name="cross")

</template>
<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator'
import { mapState } from 'vuex'
import IconSvg from '@/components/IconSvg.vue'

@Component({
  components: { IconSvg },
  computed: mapState(['ui']),
})
export default class ImageMask extends Vue {
  @Prop() data!: Mask

  ui!: any

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

  // Lifecycle

  beforeDestroy() {
    if (this.ui.maskHighlight === this.data.id) {
      this.$store.commit('updateUI', { key: 'maskHighlight', value: null })
    }
  }

  // Interaction

  interactionTimeout = 0

  onInteractionStart() {
    clearTimeout(this.interactionTimeout)
    this.$store.commit('updateUI', {
      key: 'maskHighlight',
      value: this.data.id,
    })
  }

  onInteractionEnd() {
    this.isDragging = false
    this.isResizing = false
    this.$emit('change')

    this.interactionTimeout = setTimeout(() => {
      if (this.ui.maskHighlight === this.data.id) {
        this.$store.commit('updateUI', { key: 'maskHighlight', value: null })
      }
    }, 1200)
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

  onMouseup() {
    document.removeEventListener('mousemove', this.onMousemoveMask)
    document.removeEventListener('mousemove', this.onMousemoveHandle)
    document.removeEventListener('mouseup', this.onMouseup)
    this.onInteractionEnd()
  }

  onTouchend() {
    document.removeEventListener('touchmove', this.onTouchmoveMask)
    document.removeEventListener('touchmove', this.onTouchmoveHandle)
    document.removeEventListener('touchend', this.onTouchend)
    this.onInteractionEnd()
  }

  onDblclick() {
    this.$store.commit('removeMask', this.data.id)
  }

  // Drag

  emitFromDragCoordinates(x: number, y: number) {
    this.$emit('drag', {
      ...this.data,
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
    this.onInteractionStart()
    document.addEventListener('mousemove', this.onMousemoveMask)
    document.addEventListener('mouseup', this.onMouseup)
  }

  // Drag Touch

  onTouchmoveMask(e: TouchEvent) {
    this.emitFromDragCoordinates(e.touches[0].pageX, e.touches[0].pageY)
  }

  dblclickTouchAwait = false
  dblclickTouchTimeout = 0

  onTouchstartMask(e: TouchEvent) {
    if (this.dblclickTouchAwait) {
      this.onDblclick()
    } else {
      this.dblclickTouchAwait = true
      this.dblclickTouchTimeout = setTimeout(() => {
        this.dblclickTouchAwait = false
      }, 200)
    }

    this.isDragging = true
    this.dragStartX = e.touches[0].pageX
    this.dragStartY = e.touches[0].pageY
    this.maskStartX = this.data.x
    this.maskStartY = this.data.y
    this.onInteractionStart()
    document.addEventListener('touchmove', this.onTouchmoveMask)
    document.addEventListener('touchend', this.onTouchend)
  }

  // Resize

  emitFromResizeCoordinates(x: number, y: number) {
    this.$emit('resize', {
      ...this.data,
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
    this.onInteractionStart()
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
    this.onInteractionStart()
    document.addEventListener('touchmove', this.onTouchmoveHandle)
    document.addEventListener('touchend', this.onTouchend)
  }

  // Delete

  onClickDelete() {
    this.$store.commit('removeMask', this.data.id)
  }
}
</script>
<style lang="scss">
.mask {
  --mask-inner-color: black;
  --mask-outer-color: white;
  --mask-hover-color: #{fade-out(black, 0.4)};
  --mask-shadow-color: #{fade-out(white, 0.2)};
  --mask-handle-color: var(--color-key);
  --mask-control-inset: 10px;
  --mask-control-size: 44px;
  --mask-handle-size: 14px;
  --mask-button-size: 20px;

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

// Box

.mask .box {
  cursor: grab;
  background-color: var(--mask-inner-color);
  box-shadow: 0 0 0 1px var(--mask-shadow-color);
  width: 100%;
  height: 100%;
  transition: background-color 0.2s, box-shadow 0.1s;
}

// Handle

.mask .handle {
  cursor: nwse-resize;
  position: absolute;
  left: 100%;
  top: 100%;
  z-index: -1;
  width: var(--mask-control-size);
  height: var(--mask-control-size);
  margin: calc(0px - var(--mask-control-inset));
  margin-bottom: 0;
  margin-right: 0;
  transition: opacity 0.4s;

  &:hover {
    --mask-handle-size: 20px;
    opacity: 1;
  }

  &:after {
    content: '';
    display: block;
    position: absolute;
    left: var(--mask-control-inset);
    top: var(--mask-control-inset);
    width: calc(var(--mask-control-size) - var(--mask-handle-size));
    height: 1.5px;
    transform: translateX(-1px) translateY(-50%) rotateZ(45deg);
    transform-origin: 1px 50%;
    box-shadow: inset 0 0 0 2px var(--mask-handle-color),
      1.5px 0 0 1px var(--mask-shadow-color);
    transition: width 0.1s;
    will-change: width;
  }
}

.mask .handle-actual {
  position: absolute;
  bottom: 2px;
  right: 2px;
  z-index: 1;
  width: var(--mask-handle-size);
  height: var(--mask-handle-size);
  background-color: var(--mask-handle-color);
  box-shadow: 0 0 0 1px var(--mask-shadow-color);
  border-radius: 100px;
  transition: width 0.1s, height 0.1s;
  will-change: width, height;
}

// Remove

.mask button {
  background: none;
  border: none;
  padding: 0;
  position: absolute;
  right: 100%;
  bottom: 100%;
  z-index: -1;
  width: var(--mask-control-size);
  height: var(--mask-control-size);
  margin: calc(0px - var(--mask-control-inset));
  margin-left: 0;
  margin-top: 0;

  opacity: 0;
  transform: scale(0.9);
  transform-origin: 100% 100%;
  transition: opacity 0.1s ease-out, transform 0.1s ease-out;

  .button {
    background-color: var(--mask-inner-color);
    box-shadow: 0 0 0 1px var(--mask-shadow-color);
    color: white;
    border-radius: var(--mask-button-size);
    width: var(--mask-button-size);
    height: var(--mask-button-size);

    svg {
      --size: 16px;
      margin: 1px;
    }
  }

  &:focus,
  &:hover {
    outline: none;

    .button {
      background-color: var(--color-key);
    }
  }
}

.mask:hover:not(._drag):not(._resize) button {
  opacity: 1;
  transform: scale(1);
}

// Interactive

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
.mask._drawn .box {
  background-color: var(--mask-hover-color);
}
</style>
