<template lang="pug">

  transition(name="fade" appear)
    .dropzone(v-if="ui.isDragging")
      .dropzone-content
        icon-svg(name="download")
        p Drop it anywhere

</template>
<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import { mapState } from 'vuex'
import IconSvg from '@/components/IconSvg.vue'

@Component({
  components: { IconSvg },
  computed: mapState(['ui']),
})
export default class NewComponent extends Vue {
  ui!: any
}
</script>
<style lang="scss">
.dropzone {
  background: var(--color-root-alpha-80);
  backdrop-filter: blur(20px);
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  margin: auto;
  z-index: 10;
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;

  .icon {
    font-size: 2em;
  }

  svg {
    margin: auto;

    path {
      stroke-width: 1.5px;
    }
  }

  p {
    width: calc(100vh - 4rem);
    max-width: 18em;
    margin: 1.5rem auto;
  }

  &:after {
    $inset: 1rem;
    content: '';
    position: absolute;
    top: $inset;
    right: $inset;
    bottom: $inset;
    left: $inset;
    margin: auto;
    border: 2px dashed var(--color-contrast-20);
  }
}
</style>
