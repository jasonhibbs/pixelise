<template lang="pug">

  #app(:class="classes")

    header
      logo
      h1.title Pixelise
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

        .title Pixelise

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
import Logo from '@/components/Logo.vue'
import IconSvg from '@/components/IconSvg.vue'
import Drawer from '@/components/Drawer.vue'
import Dropzone from '@/components/Dropzone.vue'
import DiscButton from '@/components/DiscButton.vue'

@Component({
  components: { IconSvg, Logo, DiscButton, Drawer, Dropzone },
  computed: mapState(['ui', 'images']),
})
export default class App extends Vue {
  @Ref() readonly drawer!: Drawer

  images!: any
  ui!: any

  queryDarkMode = window.matchMedia('(prefers-color-scheme: dark)')
  isStandalone = window.matchMedia('(display-mode: standalone)').matches
  isIos = /iPhone|iPad|iPod/.test(navigator.userAgent)

  get classes() {
    return {
      _dragging: this.ui.isDragging,
      _intro: !this.images.input,
    }
  }

  // Lifecycle

  created() {
    if (this.isStandalone) {
      document.documentElement.classList.add('is-app')
    }
    if (this.isIos) {
      document.documentElement.classList.add('is-ios')
    }
    document.addEventListener('workerupdated', this.onWorkerUpdated)
  }

  mounted() {
    this.onDarkModeChange(this.queryDarkMode)
    this.queryDarkMode.addListener(this.onDarkModeChange)
  }

  // Worker

  onWorkerUpdated() {
    this.$store.commit('updateUI', {
      key: 'updateAvailable',
      value: true,
    })
  }

  // Changes

  onDarkModeChange(query: any) {
    const metaThemeColor = document.querySelector('meta[name="theme-color"]')
    if (metaThemeColor) {
      if (query.matches) {
        metaThemeColor.setAttribute('content', '#000')
      } else {
        metaThemeColor.setAttribute('content', '#fff')
      }
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

  onClickClearMasks() {
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

.title {
  font-weight: 900;
  line-height: 1;
}

// Header

header {
  pointer-events: none;
  position: relative;
  z-index: 2;
  display: flex;
  align-items: center;
  width: 100%;
  margin-top: env(safe-area-inset-top);
  padding-left: env(safe-area-inset-left);
  padding-right: env(safe-area-inset-right);

  .logo {
    --size: #{em(21)};
    padding: 1rem 1rem;
    padding-bottom: 0;
    margin-right: auto;
  }

  h1 {
    position: absolute;
    top: 0;
    left: 0;
    display: inline-block;
    font-size: em(20);
    padding: rem(11) rem(14);
    margin: 0 auto;
    width: 100%;
    text-align: center;
    user-select: none;
    opacity: 0;
    will-change: font-size, margin, opacity;
    transition: font-size, margin, opacity;
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
  overflow: auto;
  -webkit-overflow-scrolling: touch;

  main {
    height: auto;
  }

  h1 {
    font-size: em(64);
    opacity: 1;
    margin-top: 4rem;
  }
}

// Drawer

.drawer {
  .title {
    font-size: em(48);
    padding: 0.5rem 1rem;
  }

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
