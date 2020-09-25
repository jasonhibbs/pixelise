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

const drawMasks = (state: any, img: HTMLImageElement, factor: number) => {
  state.images.context.imageSmoothingEnabled = false
  const pixelScale = state.settings.pixelScale / factor

  state.masks.forEach((mask: any) => {
    let { x, y, w, h } = mask
    x = Math.floor(x * factor)
    y = Math.floor(y * factor)
    w = Math.floor(w * factor)
    h = Math.floor(h * factor)
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
  return new Promise(resolve => {
    const ctx = state.images.context
    const img = new Image()
    const stageWidth = state.ui.imageRect.width
    img.onload = () => {
      if (ctx) {
        ctx.canvas.width = img.width
        ctx.canvas.height = img.height
        ctx.drawImage(img, 0, 0)
        const factor = ctx.canvas.width / stageWidth
        drawMasks(state, img, factor)
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
    },
    settings: {
      pixelScale: 0.18,
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
      const i = state.masks.findIndex(x => x.id === id)
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
  },
  modules: {},
})
