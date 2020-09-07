// Masks

interface Mask {
  id: number
  x: number
  y: number
  w: number
  h: number
}

interface DrawnMask {
  startX: number
  startY: number
  x: number
  y: number
  w: number
  h: number
}

// Store

interface GenericMutation {
  key: string
  value: any
}

interface StoreImages {
  input: FileReader['result']
  output: string
  context: CanvasRenderingContext2D | null
}

interface StoreMask extends Mask {}
