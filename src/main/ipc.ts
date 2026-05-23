import { ipcMain } from 'electron'
import {
  checkUpdate as checkUpdateImpl,
  downloadAndInstall as downloadAndInstallImpl
} from './updater'
import {
  clearSettingStore,
  copyAndPaste,
  execCommandByLabel,
  exportSetting,
  getCommands,
  getPackageInfo,
  getProjectNamesTree,
  getSetting,
  importSetting,
  killPort,
  openFolderEditor,
  openInExplorer,
  openWithTerminal,
  removeFolders,
  saveCommands,
  saveSetting
} from './system'
import type { CommandItem, NodeModulesFolder, SettingData } from './types'
import {
  clearHistoryOpenedUrls,
  getHistoryOpenedUrls,
  hideWindowForWebContents,
  openExternalWindow,
  setWindowSizeForWebContents
} from './windows'

export function registerIpcHandlers(): void {
  ipcMain.handle('hideWindow', (event) => {
    hideWindowForWebContents(event.sender)
  })

  ipcMain.handle('setWindowSize', (event, args: { width?: number; height?: number } = {}) => {
    setWindowSizeForWebContents(event.sender, args.width, args.height)
  })

  ipcMain.handle('get_package_info', () => getPackageInfo())

  ipcMain.handle('importSetting', () => importSetting())
  ipcMain.handle('exportSetting', () => exportSetting())
  ipcMain.handle('saveSetting', (_event, args: { settingData: SettingData }) => {
    saveSetting(args.settingData)
  })
  ipcMain.handle('getSetting', () => getSetting())
  ipcMain.handle('clearStore', () => clearSettingStore())

  ipcMain.handle('saveCommands', (_event, args: { commands?: CommandItem[] }) => {
    saveCommands(args.commands ?? [])
  })
  ipcMain.handle('getCommands', () => getCommands())
  ipcMain.handle('execCommand', (_event, args: { label: string }) => execCommandByLabel(args.label))
  ipcMain.handle('removeFolder', (_event, args: { nodeModulesFolders?: NodeModulesFolder[] }) =>
    removeFolders(args.nodeModulesFolders ?? [])
  )

  ipcMain.handle('getProjectNamesTree', () => getProjectNamesTree())
  ipcMain.handle('openFolderEditor', (_event, args: { projectPath: string; editorPath: string }) =>
    openFolderEditor(args.projectPath, args.editorPath)
  )
  ipcMain.handle('open_with_terminal', (_event, args: { projectPath: string }) =>
    openWithTerminal(args.projectPath)
  )
  ipcMain.handle('open_in_explorer', (_event, args: { path: string }) => openInExplorer(args.path))
  ipcMain.handle('killPort', (_event, args: { port: number }) => killPort(Number(args.port)))
  ipcMain.handle('CopyAndPaste', (_event, args: { content: string }) => copyAndPaste(args.content))

  ipcMain.handle('openWin', (_event, args: { url: string }) => {
    openExternalWindow(args.url)
  })
  ipcMain.handle('getHistoryOpenedUrls', () => getHistoryOpenedUrls())
  ipcMain.handle('clearHistoryOpenedUrls', () => clearHistoryOpenedUrls())

  ipcMain.handle('checkUpdate', () => checkUpdateImpl())
  ipcMain.handle('download_and_install', () => downloadAndInstallImpl())
}
