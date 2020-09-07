<template lang="pug">

  .layer(
    :class="classes"
    @mouseenter="onMouseenterLayer"
    @mouseleave="onMouseleaveLayer"
  )
    .layer-data
      .bit
        .bit-key W
        .bit-value {{ data.w }}
      .bit
        .bit-key H
        .bit-value {{ data.h }}
      .bit
        .bit-key X
        .bit-value {{ data.x }}
      .bit
        .bit-key Y
        .bit-value {{ data.y }}

    button(
      title="Remove mask"
      @click="onClickDeleteMask"
    ) ❌

</template>
<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator'
import { mapState } from 'vuex'

@Component({
  computed: mapState(['ui']),
})
export default class NewComponent extends Vue {
  @Prop() data!: Mask

  ui!: any

  get id() {
    return this.data.id
  }

  get classes() {
    return {
      _highlight: this.id === this.ui.maskHighlight,
    }
  }

  onClickDeleteMask() {
    this.$store.commit('removeMask', this.id)
  }

  onMouseenterLayer() {
    this.$store.commit('updateUI', { key: 'maskHighlight', value: this.id })
  }
  onMouseleaveLayer() {
    this.$store.commit('updateUI', { key: 'maskHighlight', value: null })
  }
}
</script>
<style lang="scss">
.layer {
  display: flex;
  background-color: var(--grey-lightest);

  + .layer {
    margin-top: 1px;
  }

  &._highlight {
    background-color: var(--grey-lighter);
  }

  button {
    --padding-x: 12;
    text-indent: (-4em/16);
  }
}

.layer-data {
  flex: auto;
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  align-items: center;
  padding-left: 1rem;
}

.bit {
  display: flex;
  text-align: left;
  align-items: baseline;
}

.bit-key {
  font-size: (11em/16);
  line-height: 1rem;
  flex: none;
  opacity: 0.4;
  margin-right: 0.375rem;
}

.bit-value {
  font-size: (14em/16);
  line-height: 1rem;
  margin-right: 1rem;
}
</style>
