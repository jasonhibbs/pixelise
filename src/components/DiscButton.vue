<template lang="pug">


  router-link(v-if="href" :to="href")
    disc(:data="disc")
    slot

  button(v-else)
    disc(:data="disc")
    slot

</template>
<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator'
import Disc from '@/components/Disc.vue'

@Component({
  components: { Disc },
})
export default class DiscButton extends Vue {
  @Prop() href?: string
  @Prop() disc!: any
}
</script>
