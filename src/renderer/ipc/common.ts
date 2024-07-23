import { CommonEvent, SettingEvent } from '@common/ipcEvent'
import { SettingData } from '@common/type'

import { ipcRenderer } from './ipc'

export function getSetting(): Promise<SettingData> {
  return ipcRenderer.invoke(SettingEvent.Get_Setting)
}

export function saveSetting(value: SettingData) {
  return ipcRenderer.invoke(SettingEvent.Save_Setting, value)
}

export function exportSetting() {
  return ipcRenderer.invoke(SettingEvent.Export_Setting)
}

export function importSetting() {
  return ipcRenderer.invoke(SettingEvent.Import_Setting)
}

export function clearStore() {
  return ipcRenderer.invoke(SettingEvent.Clear_Ele_Store)
}

export function getBaseInfo() {
  return ipcRenderer.invoke(SettingEvent.Get_Base_Info)
}

export function checkUpdate() {
  return ipcRenderer.invoke(SettingEvent.Check_Update)
}

export function openExternal(url: string) {
  return ipcRenderer.invoke(CommonEvent.Open_External, url)
}
