import { contextBridge, type IpcRendererEvent, ipcRenderer as oriIpcRenderer } from 'electron'
import { platform } from '@common/mainPreload/platform'

export type Listener = (event: IpcRendererEvent, ...args: any[]) => void

const ipcRenderer = {
  invoke(channel: string, ...args: any[]) {
    return oriIpcRenderer.invoke(channel, ...args)
  },
  on(channel: string, listener: Listener) {
    oriIpcRenderer.on(channel, listener)

    return () => {
      oriIpcRenderer.removeListener(channel, listener)
    }
  },
  once(channel: string, listener: Listener) {
    oriIpcRenderer.once(channel, listener)
  },
  removeListener(channel: string, listener: Listener) {
    oriIpcRenderer.removeListener(channel, listener)
  },
  removeAllListeners(channel: string) {
    oriIpcRenderer.removeAllListeners(channel)
  }
}

const windowElectron = {
  ipcRenderer,
  platform
}

export type WindowElectron = typeof windowElectron

contextBridge.exposeInMainWorld('electron', windowElectron)

console.log('preload.js')

declare global {
  interface Window {
    electron: typeof windowElectron
  }
}
