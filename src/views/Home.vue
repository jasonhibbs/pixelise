<template lang="pug">

  main
    .layout
      input(
        type="file"
        accept="image/*"
        @change="onFileChange"
      )

    stage(
      :image="readerImage"
      v-model="masks"
      @maskmouseenter="onMouseenterMask"
      @maskmouseleave="onMouseleaveMask"
    )

    .layers
      .layer(v-if="this.readerImage")
        button(@click="onClickAddMask") Add Mask
      template(v-for="mask in masks")
        .layer(
          :class="{_highlight: mask.id === maskHighlighted}"
          @mouseenter="onMouseenterMask(mask.id)"
          @mouseleave="onMouseleaveMask(mask.id)"
        )
          h2 Mask
          span id: {{ mask.id }}
          | &puncsp;
          span w: {{ mask.w }}
          | &puncsp;
          span h: {{ mask.h }}
          | &puncsp;
          span x: {{ mask.x }}
          | &puncsp;
          span y: {{ mask.y }}
          | &puncsp;

          button(@click="onClickDeleteMask(mask.id)") Delete


</template>
<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import Loader from '@/components/Loader.vue'
import Stage from '@/components/Stage.vue'
import ImageMask from '@/components/ImageMask.vue'

@Component({
  components: {
    Loader,
    Stage,
    ImageMask,
  },
})
export default class Home extends Vue {
  readerImage: FileReader['result'] = null
  masks: any[] = []

  maskHighlighted: number | null = null

  onMouseenterMask(id: number) {
    console.log(id)
    this.maskHighlighted = id
  }
  onMouseleaveMask(id: number) {
    this.maskHighlighted = null
  }

  onClickDeleteMask(id: number) {
    const i = this.masks.findIndex(x => x.id === id)
    console.log(id, i)
    this.masks.splice(i, 1)
  }

  onClickAddMask() {
    this.masks.push({
      id: new Date().getTime(),
      x: 0,
      y: 0,
      w: 100,
      h: 30,
    })
  }

  onLoadReader(result: FileReader['result']) {
    this.readerImage = result
  }

  updateImage(file: File) {
    const reader = new FileReader()
    reader.onload = e => {
      this.onLoadReader(reader.result)
    }
    reader.readAsDataURL(file)
  }

  onFileChange(e: InputEvent) {
    const files = (e.target as HTMLInputElement).files
    if (files?.length) {
      this.updateImage(files[0])
    }
  }
}
</script>
<style lang="scss">
.stage {
  display: flex;
  background-color: var(--grey-lightest);
  overflow: auto;
}
.stage-inner {
  padding: 2rem;
  margin: auto;
}
.context {
  position: relative;
}

.stage img {
  user-select: none;
}

.layer {
  background-color: var(--color-root);

  &._highlight {
    background-color: var(--grey-lightest);
  }
}
</style>
