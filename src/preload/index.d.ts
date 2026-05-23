import { ElectronAPI } from '@electron-toolkit/preload'

type EventUnsubscribe = () => void

interface RmstApi {
  invoke<T = unknown>(channel: string, args?: unknown): Promise<T>
  onWindowFocusChanged(callback: (focused: boolean) => void): EventUnsubscribe
  onShowQrCode(callback: (value: string) => void): EventUnsubscribe
  onUpdateDownload(callback: (event: unknown) => void): EventUnsubscribe
}

declare global {
  interface Window {
    electron: ElectronAPI
    api: RmstApi
  }
}
