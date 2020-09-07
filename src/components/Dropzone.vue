<template lang="pug">

  transition(name="fade" appear)
    .dropzone
      .dropzone-content
        disc(:data="{ icon: 'download' }")
        p Drop it anywhere

</template>
<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import { mapState } from 'vuex'
import Disc from '@/components/Disc.vue'

@Component({
  components: { Disc },
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

  .disc {
    --size: #{(56em/16)};
    background-color: var(--color-contrast);
    color: var(--color-root);
    vertical-align: bottom;
  }

  .icon {
    --size: #{(28em/16)};
    --stroke-width: 2px;
  }

  p {
    width: calc(100vh - 4rem);
    max-width: 18em;
    margin: 1rem auto 0;
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
