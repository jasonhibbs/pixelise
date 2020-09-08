<template lang="pug">

  .context._save
    .context-controls
      button(
        title="Edit Masks"
        @click="onClickBackToMask"
      )
        icon-svg(name="arrow-left")

      context-input-range#input-density(
        min="0.03"
        max="0.26"
        step="0.01"
        title="Pixel Density"
        v-model="pixelScale"
        @input="updateOutput"
      )

      a.button._primary(
        title="Save Image"
        :disabled="!images.output"
        :href="downloadHref"
        :download="strings.download"
      )
        icon-svg(name="download")

</template>
<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import { mapState } from 'vuex'
import IconSvg from '@/components/IconSvg.vue'
import ContextInputRange from '@/components/ContextInputRange.vue'

@Component({
  components: {
    IconSvg,
    ContextInputRange,
  },
  computed: mapState(['ui', 'strings', 'settings', 'images']),
})
export default class ContextSave extends Vue {
  ui!: any
  settings!: any
  strings!: any
  images!: any

  get downloadHref() {
    const uri = this.images.output.replace(/^data:image\/\w+;base64,/, '')
    return `data:application/octet-stream;base64,${uri}`
  }

  get pixelScale() {
    return this.settings.pixelScale
  }

  set pixelScale(value: number) {
    this.$store.commit('updateSetting', { key: 'pixelScale', value })
  }

  onClickBackToMask() {
    this.$emit('masksedit')
  }

  updateOutput() {
    this.$emit('settingschange')
  }
}
</script>
