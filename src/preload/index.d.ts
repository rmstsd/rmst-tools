import { ElectronAPI } from '@electron-toolkit/preload'

type EventUnsubscribe = () => void

interface UpdateInfo {
  version: string
  releaseDate?: string
  releaseName?: string
  releaseNotes?: string
}

interface UpdateProgress {
  percent: number
  bytesPerSecond: number
  transferred: number
  total: number
}

type DownloadEvent =
  | { event: 'available'; data: UpdateInfo }
  | { event: 'not-available'; data: UpdateInfo }
  | { event: 'progress'; data: UpdateProgress }
  | { event: 'downloaded'; data: UpdateInfo }
  | { event: 'error'; message: string }

interface RmstApi {
  invoke<T = unknown>(channel: string, args?: unknown): Promise<T>
  onWindowFocusChanged(callback: (focused: boolean) => void): EventUnsubscribe
  onShowQrCode(callback: (value: string) => void): EventUnsubscribe
  onUpdateDownload(callback: (event: DownloadEvent) => void): EventUnsubscribe
}

declare global {
  interface Window {
    electron: ElectronAPI
    api: RmstApi
  }
}
