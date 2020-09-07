<template lang="pug">

  .context._save
    .context-controls
      button(
        title="Back"
        @click="onClickBackToMask"
      )
        icon-svg(name="arrow-left")


      .field.field-range
        .field-control
          input#input-density(
            type="range"
            min="0.03"
            max="0.26"
            step="0.01"
            title="Pixel Density"
            v-model="pixelScale"
            @input="updateOutput"
          )
        //- p.field-message(v-if="isLargeImage") Big images take longer to update

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

@Component({
  components: {
    IconSvg,
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
