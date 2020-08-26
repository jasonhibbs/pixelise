<template lang="pug">

  label.editor-uploader(
    for="file-input"
  )
    span Upload an image
    input#file-input(
      type="file"
      accept="image/*"
      @change="onFileChange"
    )

</template>
<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import { mapState } from 'vuex'

@Component({ computed: mapState(['ui']) })
export default class EditorUploader extends Vue {
  ui!: any

  get isDragging() {
    return this.ui.isDragging
  }

  set isDragging(value: boolean) {
    this.$store.commit('updateUI', { key: 'isDragging', value })
  }

  // Lifecycle

  mounted() {
    document.addEventListener('dragenter', this.onDragenterDocument)
    document.addEventListener('dragleave', this.onDragleaveDocument)
    document.addEventListener('dragover', this.onDragoverDocument)
    document.addEventListener('drop', this.onDropDocument)
  }

  beforeDestroy() {
    document.removeEventListener('dragenter', this.onDragenterDocument)
    document.removeEventListener('dragleave', this.onDragleaveDocument)
    document.removeEventListener('dragover', this.onDragoverDocument)
    document.removeEventListener('drop', this.onDropDocument)
  }

  // Read Image

  onLoadReader(result: FileReader['result']) {
    this.$store.commit('updateImage', { key: 'input', value: result })
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

  // Dragging

  onDragenterDocument(e: DragEvent) {
    e.preventDefault()
    this.isDragging = true
  }

  onDragleaveDocument(e: DragEvent) {
    this.isDragging = false
  }

  onDragoverDocument(e: DragEvent) {
    e.preventDefault()
  }

  onDropDocument(e: DragEvent) {
    e.preventDefault()
    this.isDragging = false

    if (e.dataTransfer?.items) {
      const item = e.dataTransfer?.items[0]
      const file = item.type.includes('image/') && item.getAsFile()
      if (file) {
        this.updateImage(file)
      }
    }
  }

  // Load from Input

  onFileChange(e: InputEvent) {
    const files = (e.target as HTMLInputElement).files
    if (files?.length) {
      this.updateImage(files[0])
    }
  }
}
</script>
