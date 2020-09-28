import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

const images: StoreImages = {
  input: null,
  output: '',
  context: null,
  type: '',
}

const masks: StoreMask[] = []

const drawMasks = (state: any, img: HTMLImageElement) => {
  state.images.context.imageSmoothingEnabled = false
  const pixelScale = state.settings.pixelScale / img.width

  state.masks.forEach((mask: any) => {
    let { x, y, w, h } = mask
    x = Math.floor(x * state.ui.imageScale)
    y = Math.floor(y * state.ui.imageScale)
    w = Math.floor(w * state.ui.imageScale)
    h = Math.floor(h * state.ui.imageScale)
    const newWidth = Math.max(1, w * pixelScale)
    const newHeight = Math.max(1, h * pixelScale)
    const newCanvas = document.createElement('canvas')
    newCanvas.width = newWidth
    newCanvas.height = newHeight
    const newContext = newCanvas.getContext('2d')
    if (newContext) {
      newContext.drawImage(img, x, y, w, h, 0, 0, newWidth, newHeight)
      state.images.context.drawImage(newCanvas, x, y, w, h)
    }
  })
}

const updateCanvasData = (state: any) => {
  return new Promise((resolve) => {
    const ctx = state.images.context
    const img = new Image()
    img.onload = () => {
      if (ctx) {
        ctx.canvas.width = img.width
        ctx.canvas.height = img.height
        ctx.drawImage(img, 0, 0)
        drawMasks(state, img)
        resolve(ctx.canvas.toDataURL(state.images.type))
      }
    }
    img.src = state.images.input as string
  })
}

export default new Vuex.Store({
  state: {
    ui: {
      isDragging: false,
      isLoadingPreview: false,
      isReloading: false,
      isStandalone: false,
      isIos: false,
      showingPreview: false,
      hasChanges: true,
      maskHighlight: null,
      drawerExpanded: false,
      updateAvailable: false,
      imageRect: null,
      imageScale: 1,
    },
    settings: {
      pixelScale: 96,
    },
    strings: {
      download: 'pixelised',
    },
    images,
    masks,
  },
  mutations: {
    updateUI(state, m: GenericMutation) {
      const { ui } = state as any
      ui[m.key] = m.value
    },
    updateSetting(state, m: GenericMutation) {
      const { settings } = state as any
      settings[m.key] = m.value
      state.ui.hasChanges = true
    },
    updateString(state, m: GenericMutation) {
      const { strings } = state as any
      strings[m.key] = m.value
    },
    updateImage(state, m: GenericMutation) {
      const { images } = state as any
      images[m.key] = m.value
      if (m.key === 'input') {
        images.output = ''
        state.ui.hasChanges = true
      }
    },
    updateMasks(state, masks) {
      state.masks = masks
      state.ui.hasChanges = true
    },
    addMask(state, { x = 36, y = 36, w = 144, h = 36 }) {
      state.masks.push({ id: new Date().getTime(), x, y, w, h })
      state.ui.hasChanges = true
    },
    removeMask(state, id: number) {
      const i = state.masks.findIndex((x) => x.id === id)
      state.masks.splice(i, 1)
      state.ui.hasChanges = true
    },
    removeAllMasks(state) {
      state.masks = []
      state.ui.hasChanges = true
    },
  },
  actions: {
    async updateOutput({ commit, state }) {
      if (!state.ui.hasChanges) {
        return false
      }
      commit('updateUI', { key: 'isLoadingPreview', value: true })
      commit('updateImage', {
        key: 'output',
        value: await updateCanvasData(state),
      })
      commit('updateUI', { key: 'isLoadingPreview', value: false })
      commit('updateUI', { key: 'hasChanges', value: false })
    },
    resizeMasks({ commit, state }, scale) {
      if (scale === 1) {
        return
      }
      const masks = state.masks.map((mask) => {
        return {
          ...mask,
          x: mask.x / scale,
          y: mask.y / scale,
          w: mask.w / scale,
          h: mask.h / scale,
        }
      })
      commit('updateMasks', masks)
    },
  },
  modules: {},
})
