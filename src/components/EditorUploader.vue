<template lang="pug">

  .editor-uploader
    input(
      :id="id"
      type="file"
      accept="image/png, image/jpeg"
      @change="onFileChange"
      @focus="onFocus"
      @blur="onBlur"
    )

</template>
<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import { mapState } from 'vuex'

@Component({ computed: mapState(['ui']) })
export default class EditorUploader extends Vue {
  ui!: any

  get id() {
    return 'input-editor'
  }

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
    this.$store.commit('updateUI', { key: 'showingPreview', value: false })
  }

  updateImage(file: File) {
    const reader = new FileReader()
    reader.onload = () => {
      this.onLoadReader(reader.result)
    }
    reader.readAsDataURL(file)
    this.$store.commit('updateImage', { key: 'type', value: file.type })
    this.$store.commit('updateString', {
      key: 'download',
      value: `pixelised-${file.name}`,
    })
    this.$store.commit('updateUI', { key: 'drawerExpanded', value: false })
  }

  // Dragging

  onDragenterDocument(e: DragEvent) {
    e.preventDefault()
    this.isDragging = true
  }

  onDragleaveDocument(e: DragEvent) {
    if (e.target === document.body) {
      this.isDragging = false
    }
  }

  onDragoverDocument(e: DragEvent) {
    e.preventDefault()
  }

  onDropDocument(e: DragEvent) {
    e.preventDefault()
    this.isDragging = false

    if (e.dataTransfer?.items) {
      const item = e.dataTransfer?.items[0]
      const acceptableImageTypes = RegExp(/^(image\/)(png|jpeg)$/g)
      const file = acceptableImageTypes.test(item.type) && item.getAsFile()
      if (file) {
        this.updateImage(file)
      }
    }
  }

  // Input

  onFileChange(e: InputEvent) {
    const input = e.target as HTMLInputElement
    const files = input.files
    if (files?.length) {
      this.updateImage(files[0])
      input.value = ''
    }
  }

  // Events

  onFocus() {
    const label = document.querySelector(`label[for="${this.id}"]`)
    label?.classList.add('focus-visible')
  }

  onBlur() {
    const labels = document.querySelectorAll(`label[for="${this.id}"]`)
    labels.forEach(label => label.classList.remove('focus-visible'))
  }
}
</script>
<style lang="scss">
.editor-uploader {
  text-align: center;
  position: absolute;
  top: 50%;
  left: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;

  input {
    position: absolute;
    clip: rect(0 0 0 0);
    width: 0;
    height: 1px;
  }

  &[hidden] {
    display: none;
  }
}
</style>
