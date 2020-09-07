<template lang="pug">

  #app(:class="classes")

    header
      h1 Pixelise
      button.link(@click="drawerExpanded = !drawerExpanded") Menu
    router-view

    drawer#drawer(
      v-if="ui.drawerExpanded"
      ref="drawer"
      aria-label="Pixelise Menu"
      @clickoverlay="drawerExpanded = false"
      @dismiss="drawerExpanded = false"
      @expand="onExpandDrawer"
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
            :disabled="!images.input"
            @click="onClickClearMasks"
          ) Clear all masks
          disc-button(
            :disc="{ icon: 'upload', color: 'orange' }"
            @click="onClickUpload"
          ) Upload new image
          disc-button(
            :disc="{ icon: 'undo', color: 'green' }"
            :disabled="!images.input"
            @click="onClickRestart"
          ) Start over
          disc-button(
            :disc="{ image: 'svg/logo-kofi.svg' }"
            href="https://ko-fi.com/jasonhibbs"
            target="_blank"
          ) Buy me a coffee

        footer
          .layout
            p Set in #[a(href="https://rsms.me/inter/") Inter]
            p Built with #[a(href="https://vuejs.org/") Vue]
            p Powered by #[a(href="https://www.netlify.com/") Netlify]
            p.vcard.h-card Made by #[a.p-name.u-url.fn.url(href="https://jasonhibbs.co.uk") Jason Hibbs]

    dropzone(v-if="ui.isDragging")

</template>

<style lang="scss" src="@/assets/scss/style.scss"></style>

<script lang="ts">
import { Component, Ref, Vue } from 'vue-property-decorator'
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
  @Ref() readonly drawer!: Drawer

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

  onExpandDrawer() {
    this.drawer.focusFirstinContent()
  }

  // Buttons

  onClickClearMasks(e: Event) {
    this.$store.commit('removeAllMasks')
    this.$store.commit('updateUI', { key: 'showingPreview', value: false })
    this.drawerExpanded = false
  }

  onClickUpload() {
    const inputUpload = document.querySelector(
      '#input-editor'
    ) as HTMLInputElement
    inputUpload?.click()
  }

  onClickRestart() {
    this.$store.commit('removeAllMasks')
    this.$store.commit('updateImage', { key: 'input', value: null })
    this.drawerExpanded = false
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

html,
body {
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
    font-size: em(20);
    font-weight: 900;
    line-height: 1;
    padding: rem(11) rem(14);
    margin: 0;
    width: 0;
    text-align: center;
    will-change: font-size, width;
    transition: font-size, width;
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
    font-size: em(64);
    width: 100%;
    margin-top: 4rem;
  }
}

// Drawer

.drawer {
  .buttons {
    margin-top: auto;
  }

  footer {
    margin-top: rem(8);
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
