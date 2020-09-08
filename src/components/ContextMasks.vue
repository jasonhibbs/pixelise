<template lang="pug">

  .context._masks
    .context-controls
      button(
        v-if="!ui.showingPreview && images.input"
        title="Add Mask"
        @click="onClickAddMask"
      )
        icon-svg(name="plus")

      context-message(v-if="!this.masks.length")
        p #[strong No masks:] Add one #[span.nowrap to&nbsp;continue]

      button._primary(
        v-if="images.input"
        title="Preview Pixels"
        :disabled="!masks.length"
        @click="onClickGoToSave"
      )
        icon-svg(name="arrow-right")

</template>
<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import { mapState } from 'vuex'
import IconSvg from '@/components/IconSvg.vue'
import ContextMessage from '@/components/ContextMessage.vue'

@Component({
  components: {
    IconSvg,
    ContextMessage,
  },
  computed: mapState(['ui', 'masks', 'strings', 'images']),
})
export default class ContextMasks extends Vue {
  ui!: any
  strings!: any
  images!: any
  masks!: any

  onClickAddMask() {
    this.$emit('masksadd')
  }

  onClickGoToSave() {
    this.$emit('masksdone')
  }
}
</script>
