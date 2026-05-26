import { ipcMain } from 'electron'
import { checkUpdate as checkUpdateImpl, downloadAndInstall as downloadAndInstallImpl } from './updater'
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
  ipcMain.handle('Hide_Window', event => {
    hideWindowForWebContents(event.sender)
  })

  ipcMain.handle('Set_Window_Size', (event, args: { width?: number; height?: number } = {}) => {
    setWindowSizeForWebContents(event.sender, args.width, args.height)
  })

  ipcMain.handle('Get_Package_Info', () => getPackageInfo())

  ipcMain.handle('Import_Setting', () => importSetting())
  ipcMain.handle('Export_Setting', () => exportSetting())
  ipcMain.handle('Save_Setting', (_event, args: { settingData: SettingData }) => {
    saveSetting(args.settingData)
  })
  ipcMain.handle('Get_Setting', () => getSetting())
  ipcMain.handle('Clear_Store', () => clearSettingStore())

  ipcMain.handle('Save_Commands', (_event, args: { commands?: CommandItem[] }) => {
    saveCommands(args.commands ?? [])
  })
  ipcMain.handle('Get_Commands', () => getCommands())
  ipcMain.handle('Exec_Command', (_event, args: { label: string }) => execCommandByLabel(args.label))
  ipcMain.handle('Remove_Folder', (_event, args: { nodeModulesFolders?: NodeModulesFolder[] }) =>
    removeFolders(args.nodeModulesFolders ?? [])
  )

  ipcMain.handle('Get_Project_Names_Tree', () => getProjectNamesTree())
  ipcMain.handle('Open_Folder_Editor', (_event, args: { projectPath: string; editorPath: string }) =>
    openFolderEditor(args.projectPath, args.editorPath)
  )
  ipcMain.handle('Open_With_Terminal', (_event, args: { projectPath: string }) => openWithTerminal(args.projectPath))
  ipcMain.handle('Open_In_Explorer', (_event, args: { path: string }) => openInExplorer(args.path))
  ipcMain.handle('Kill_Port', (_event, args: { port: number }) => killPort(Number(args.port)))
  ipcMain.handle('Copy_And_Paste', (_event, args: { content: string }) => copyAndPaste(args.content))

  ipcMain.handle('Open_Win', (_event, args: { url: string }) => {
    openExternalWindow(args.url)
  })
  ipcMain.handle('Get_History_Opened_Urls', () => getHistoryOpenedUrls())
  ipcMain.handle('Clear_History_Opened_Urls', () => clearHistoryOpenedUrls())

  ipcMain.handle('Check_Update', () => checkUpdateImpl())
  ipcMain.handle('Download_And_Install', () => downloadAndInstallImpl())
}
