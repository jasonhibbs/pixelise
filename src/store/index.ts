import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

interface GenericMutation {
  key: string
  value: any
}

interface StoreImages {
  input: FileReader['result']
  output: string
  context: CanvasRenderingContext2D | null
}

const images: StoreImages = {
  input: null,
  output: '',
  context: null,
}

const drawMasks = (state: any) => {
  state.images.context.imageSmoothingEnabled = false
  state.masks.forEach((mask: any) => {
    const { x, y, w, h } = mask
    const newWidth = w * state.settings.pixelScale
    const newHeight = h * state.settings.pixelScale
    const newCanvas = document.createElement('canvas')
    newCanvas.width = newWidth
    newCanvas.height = newHeight
    const newContext = newCanvas.getContext('2d')
    newContext!.drawImage(
      state.images.input,
      x,
      y,
      w,
      h,
      0,
      0,
      newWidth,
      newHeight
    )
    state.images.context.drawImage(newCanvas, x, y, w, h)
  })
}

export default new Vuex.Store({
  state: {
    ui: {
      isPreview: false,
      isHighlight: null,
    },
    settings: {
      pixelScale: 0.22,
    },
    strings: {
      download: 'pixelated',
    },
    images,
    masks: [],
  },
  mutations: {
    updateUI(state, m: GenericMutation) {
      const { ui } = state as any
      ui[m.key] = m.value
    },
    updateSetting(state, m: GenericMutation) {
      const { settings } = state as any
      settings[m.key] = m.value
    },
    updateString(state, m: GenericMutation) {
      const { strings } = state as any
      strings[m.key] = m.value
    },
    updateImage(state, m: GenericMutation) {
      const { images } = state as any
      images[m.key] = m.value
    },
  },
  actions: {
    updateOutput({ commit, state }) {
      const ctx = state.images.context
      const img = new Image()
      img.onload = e => {
        if (ctx) {
          ctx.canvas.width = img.width
          ctx.canvas.height = img.height
          ctx.drawImage(img, 0, 0)
          drawMasks(state)
          commit('updateImage', {
            key: 'output',
            value: ctx.canvas.toDataURL(),
          })
        }
      }
      img.src = state.images.input as string
    },
  },
  modules: {},
})
