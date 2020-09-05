<template lang="pug">

  .context._masks
    .context-controls
      button(
        v-if="!ui.showingPreview && images.input"
        title="Add Mask"
        @click="onClickAddMask"
      )
        icon-svg(name="plus")

      .tip

      button._primary(
        v-if="images.input"
        title="Next"
        :disabled="!masks.length"
        @click="onClickGoToSave"
      )
        icon-svg(name="arrow-right")

</template>
<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import { mapState } from 'vuex'

import throttle from 'lodash.throttle'
import IconSvg from '@/components/IconSvg.vue'

@Component({
  components: {
    IconSvg,
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
