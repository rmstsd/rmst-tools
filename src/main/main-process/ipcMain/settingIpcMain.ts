import { SettingEvent } from '@common/mainRenderer/ipcEvent'
import { clearAllStore, getStoreSetting, setStoreSetting } from '@main/store'
import { createHandleListener } from './utils'
import { app, dialog } from 'electron'
import { checkForUpdate } from '@main/checkUpdate'
import { electronWindow } from '../electronWindow'
import { readJsonSync, writeJsonSync } from 'fs-extra'
import { AppBaseInfo } from '@common/type'

const onSaveSetting = createHandleListener(SettingEvent.Save_Setting)
const onGetSetting = createHandleListener(SettingEvent.Get_Setting)
const onClearStore = createHandleListener(SettingEvent.Clear_Ele_Store)
const onCheckUpdate = createHandleListener(SettingEvent.Check_Update)
const onGetBaseInfo = createHandleListener(SettingEvent.Get_Base_Info)
const onExportSetting = createHandleListener(SettingEvent.Export_Setting)
const onImportSetting = createHandleListener(SettingEvent.Import_Setting)

export function addSettingIpcMain() {
  onSaveSetting((_, value) => setStoreSetting(value))

  onGetSetting(() => getStoreSetting())
  onClearStore(() => {
    clearAllStore()
  })
  onCheckUpdate(() => checkForUpdate())

  onGetBaseInfo(() => {
    const appBaseInfo: AppBaseInfo = {
      appPath: app.getAppPath(),
      appVersion: app.getVersion(),
      appName: app.getName(),
      node: process.versions.node,
      chrome: process.versions.chrome,
      electron: process.versions.electron
    }
    return appBaseInfo
  })

  onExportSetting(() => {
    const savedPath = dialog.showSaveDialogSync(electronWindow.Setting, {
      defaultPath: 'cfg.json',
      filters: [{ name: 'json', extensions: ['json'] }]
    })

    if (!savedPath) {
      return Promise.reject('')
    }

    const settingCfg = getStoreSetting()
    writeJsonSync(savedPath, settingCfg, { spaces: 2 })
  })
  onImportSetting(() => {
    const [path] = dialog.showOpenDialogSync(electronWindow.Setting, {
      title: '选择配置文件',
      properties: ['openFile'],
      filters: [{ name: 'a', extensions: ['json'] }]
    })
    if (path) {
      const cfg = readJsonSync(path, { encoding: 'utf-8' })
      setStoreSetting(cfg)
    }
  })
}
