import { WebviewTag } from 'electron'
import { create } from 'zustand'
import { combine } from 'zustand/middleware'

type RmstState = typeof rmstState

const rmstState = {
  bears: 0,
  currentWebview: {} as WebviewTag,
  contextMenuVisible: false,
  contextMenuCoord: { x: 0, y: 0 }
}

export const useRmstStore = create(
  combine(rmstState, set => ({
    increase: (by: number) => {
      set(state => ({ bears: state.bears + by }))
    },

    setCurrentWebview(wv: RmstState['currentWebview']) {
      set(() => ({ currentWebview: wv }))
    },

    setContextMenuVisible: (b: boolean) => {
      set(() => ({ contextMenuVisible: b }))
    },
    setContextMenuCoord: (coord: RmstState['contextMenuCoord']) => {
      set(() => ({ contextMenuCoord: coord }))
    }
  }))
)
