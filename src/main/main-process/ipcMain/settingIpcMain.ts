import { SettingEvent } from '@common/ipcEvent'
import { clearAllStore, getStoreSetting, setStoreSetting } from '@main/store'
import { createHandleListener } from './utils'
import { app } from 'electron'
import { checkForUpdate } from '@main/checkUpdate'

const onSaveSetting = createHandleListener(SettingEvent.Save_Setting)
const onGetSetting = createHandleListener(SettingEvent.Get_Setting)
const onClearStore = createHandleListener(SettingEvent.Clear_Ele_Store)
const onCheckUpdate = createHandleListener(SettingEvent.Check_Update)
const onGetBaseInfo = createHandleListener(SettingEvent.Get_Base_Info)

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
}
