import { contextBridge, ipcRenderer } from 'electron'
import type { IpcRendererEvent } from 'electron'
import { electronAPI } from '@electron-toolkit/preload'

type EventUnsubscribe = () => void

type DownloadEvent =
  | { event: 'available'; data: { version: string; releaseDate?: string; releaseName?: string; releaseNotes?: string } }
  | { event: 'not-available'; data: { version: string; releaseDate?: string; releaseName?: string; releaseNotes?: string } }
  | {
      event: 'progress'
      data: { percent: number; bytesPerSecond: number; transferred: number; total: number }
    }
  | { event: 'downloaded'; data: { version: string; releaseDate?: string; releaseName?: string; releaseNotes?: string } }
  | { event: 'error'; message: string }

const api = {
  invoke<T = unknown>(channel: string, args?: unknown): Promise<T> {
    return ipcRenderer.invoke(channel, args) as Promise<T>
  },
  onWindowFocusChanged(callback: (focused: boolean) => void): EventUnsubscribe {
    const listener = (_event: IpcRendererEvent, focused: boolean): void => callback(focused)
    ipcRenderer.on('window-focus-changed', listener)
    return () => ipcRenderer.removeListener('window-focus-changed', listener)
  },
  onShowQrCode(callback: (value: string) => void): EventUnsubscribe {
    const listener = (_event: IpcRendererEvent, value: string): void => callback(value)
    ipcRenderer.on('show-qrcode', listener)
    return () => ipcRenderer.removeListener('show-qrcode', listener)
  },
  onUpdateDownload(callback: (event: DownloadEvent) => void): EventUnsubscribe {
    const listener = (_event: IpcRendererEvent, payload: DownloadEvent): void => callback(payload)
    ipcRenderer.on('update-download-event', listener)
    return () => ipcRenderer.removeListener('update-download-event', listener)
  }
}

if (process.contextIsolated) {
  try {
    contextBridge.exposeInMainWorld('electron', electronAPI)
    contextBridge.exposeInMainWorld('api', api)
  } catch (error) {
    console.error(error)
  }
} else {
  // @ts-ignore (define in dts)
  window.electron = electronAPI
  // @ts-ignore (define in dts)
  window.api = api
}
