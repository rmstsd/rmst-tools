export type SettingData = {
  editorPaths: {
    // enable: boolean // 废弃
    path: string
  }[]
  cmdPath: string
  projectPaths: string[]
  notes: string[]
  historyOpenedUrls: string[]
}

export type AppBaseInfo = {
  appPath: string
  appVersion: string
  appName: string
  node: string
  chrome: string
  electron: string
}
