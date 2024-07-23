import { SettingEvent } from '@common/ipcEvent'
import { clearAllStore, getStoreSetting, setStoreSetting } from '@main/store'
import { createHandleListener } from './utils'
import { app, dialog } from 'electron'
import { checkForUpdate } from '@main/checkUpdate'
import { electronWindow } from '../electronWindow'
import { readJsonSync, writeJsonSync } from 'fs-extra'
import path from 'path'

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
  onClearStore(() => clearAllStore())
  onCheckUpdate(() => checkForUpdate())

  onGetBaseInfo(() => {
    return {
      appPath: app.getAppPath(),
      version: app.getVersion(),
      name: app.getName()
    }
  })

  onExportSetting(() => {
    getStoreSetting()

    const [savedPath] = dialog.showOpenDialogSync(electronWindow.Setting, {
      title: '保存配置文件',
      properties: ['openDirectory']
    })

    if (savedPath) {
      const settingCfg = getStoreSetting()
      writeJsonSync(path.join(savedPath, 'cfg.json'), settingCfg)
    }
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
