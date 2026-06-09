export type ManagedWindowKey = 'setting' | 'openFolder' | 'quickInput'

export interface SettingData {
  cmdPath?: string
  editorPaths?: string[]
  projectPaths?: string[]
  notes?: string[]
  historyOpenedUrls?: string[]
}

export interface CommandItem {
  label: string
  cmd: string
  arg: string
  currentDir: string
}

export interface NamesTree {
  name: string
  children: string[]
}

export interface UpdateInfo {
  version: string
  releaseDate?: string
  releaseName?: string
  releaseNotes?: string
}

export interface UpdateProgress {
  percent: number
  bytesPerSecond: number
  transferred: number
  total: number
}

export type DownloadEvent =
  | { event: 'available'; data: UpdateInfo }
  | { event: 'not-available'; data: UpdateInfo }
  | { event: 'progress'; data: UpdateProgress }
  | { event: 'downloaded'; data: UpdateInfo }
  | { event: 'error'; message: string }
