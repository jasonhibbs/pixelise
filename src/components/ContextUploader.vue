<template lang="pug">

  label.context-uploader(
    :for="id"
  )
    .button(
      role="button"
      tabindex="0"
      :aria-controls="id"
      @keydown.enter="onActiveButton"
    )
      slot New image
    input(
      ref="input"
      tabindex="-1"
      type="file"
      accept="image/*"
      :id="id"
      @change="onFileChange"
    )

</template>
<script lang="ts">
import { Component, Ref, Vue } from 'vue-property-decorator'
import { mapState } from 'vuex'

@Component({ computed: mapState(['ui']) })
export default class ContextUploader extends Vue {
  @Ref() readonly input!: HTMLInputElement

  ui!: any

  get id() {
    return 'input-context'
  }

  onActiveButton() {
    this.input.click()
  }

  // Read Image

  onLoadReader(result: FileReader['result']) {
    this.$store.commit('updateImage', { key: 'input', value: result })
    this.$store.commit('updateUI', { key: 'isPreview', value: false })
    this.$store.dispatch('updateOutput')
  }

  updateImage(file: File) {
    const reader = new FileReader()
    reader.onload = e => {
      this.onLoadReader(reader.result)
    }
    reader.readAsDataURL(file)
    this.$store.commit('updateString', {
      key: 'download',
      value: `pixelated-${file.name}`,
    })
  }

  // Input

  onFileChange(e: InputEvent) {
    const files = (e.target as HTMLInputElement).files
    if (files?.length) {
      this.updateImage(files[0])
    }
  }
}
</script>
<style lang="scss">
.context-uploader {
  display: contents;

  input {
    position: absolute;
    clip: rect(0 0 0 0);
    width: 0;
    height: 1px;
  }
}
</style>
