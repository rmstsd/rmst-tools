export interface NodeModulesFolder {
  path?: string
  selected?: boolean
}

export interface SettingData {
  cmdPath?: string
  editorPaths?: string[]
  projectPaths?: string[]
  notes?: string[]
  historyOpenedUrls?: string[]
  nodeModulesFolders?: NodeModulesFolder[]
}

export interface CommandItem {
  label: string
  cmd: string
  arg: string
  currentDir: string
}

export interface DirNamesTree {
  name: string
  children: string[]
}

export interface UpdateInfo {
  needUpdate: boolean
  current_version: string
  version: string
  notes?: string
  pub_date?: string
  downloadUrl?: string
}

export type DownloadEvent =
  | { event: 'Started'; data: { content_length: number } }
  | { event: 'Progress'; data: { chunk_length: number } }
  | { event: 'Finished'; data: { filePath: string } }
