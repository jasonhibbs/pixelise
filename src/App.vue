<template lang="pug">

  #app(:class="classes")

    header
      h1 Pixelise
      button.link(@click="drawerExpanded = !drawerExpanded") Menu
    router-view

    drawer#drawer(
      v-if="ui.drawerExpanded"
      ref="drawer"
      role="dialog"
      aria-label="Pixelise Menu"
      @clickoverlay="drawerExpanded = false"
      @overscrolldown="drawerExpanded = false"
    )

      template(#header)
        button.link(
          aria-controls="drawer"
          :aria-expanded="ui.drawerExpanded"
          @click="drawerExpanded = false"
        )
          span Close

      template(#content)

        .buttons
          disc-button(
            :disc="{ icon: 'cross', color: 'red' }"
            @click="onClickClearMasks"
          ) Clear all masks
          disc-button(
            :disc="{ image: 'ko-fi' }"
            href="https://ko-fi.com/jasonhibbs"
          ) Buy me a coffee

        footer
          .layout
            p Built with #[a(href="https://vuejs.org/") Vue]
            p Powered by #[a(href="https://www.netlify.com/") Netlify]
            p.vcard.h-card Made by #[a.p-name.u-url.fn.url(href="https://jasonhibbs.co.uk") Jason Hibbs]

    dropzone(v-if="ui.isDragging")

</template>

<style lang="scss" src="@/assets/scss/style.scss"></style>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import { mapState } from 'vuex'
import IconSvg from '@/components/IconSvg.vue'
import Drawer from '@/components/Drawer.vue'
import Dropzone from '@/components/Dropzone.vue'
import DiscButton from '@/components/DiscButton.vue'

@Component({
  components: { IconSvg, DiscButton, Drawer, Dropzone },
  computed: mapState(['ui', 'images']),
})
export default class App extends Vue {
  images!: any
  ui!: any

  get classes() {
    return {
      _dragging: this.ui.isDragging,
      _intro: !this.images.input,
    }
  }

  // Drawer

  get drawerExpanded() {
    return this.ui.drawerExpanded
  }

  set drawerExpanded(value) {
    this.$store.commit('updateUI', { key: 'drawerExpanded', value })
  }

  // Buttons

  onClickClearMasks() {
    console.log('clear masks')
  }
}
</script>

<style lang="scss">
@import '@/assets/scss/_util';

html,
body,
#app,
main {
  height: 100%;
}

html {
  overflow: hidden;
}

#app._dragging {
  pointer-events: none;
}

// Header

header {
  pointer-events: none;
  position: relative;
  z-index: 2;
  display: flex;
  width: 100%;
  margin-top: env(safe-area-inset-top);

  h1 {
    position: absolute;
    top: 0;
    top: env(safe-area-inset-top);
    left: 0;
    display: inline-block;
    font-size: rem(20);
    font-weight: 900;
    line-height: 1;
    padding: rem(11) rem(14);
    margin: 0;
    transform: none;
    will-change: font-size, margin, transform;
    transition: font-size, margin, transform;
    transition-duration: 0.5s;
    transition-timing-function: cubic-bezier(0.25, 0.83, 0.1, 1);
  }

  button.link {
    pointer-events: auto;
    padding: rem(11) rem(14);
    margin-left: auto;
    outline-offset: -3px;
  }
}

#app._intro {
  h1 {
    font-size: 4em;
    margin-top: 4rem;
    margin-left: 50%;
    transform: translateX(-50%);
  }
}

// Transitions

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s;
}

.fade-enter,
.fade-leave-to {
  opacity: 0;
}
</style>
