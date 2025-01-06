import { KillPortEvent } from '@common/mainRenderer/ipcEvent'
import { ipcRenderer } from './ipc'

export function killPort(port: string) {
  return ipcRenderer.invoke(KillPortEvent.Kill_Port, port)
}

export function Open_Url_Win(url) {
  ipcRenderer.invoke(KillPortEvent.Open_Url_Win, url)
}

export function Set_Git_Ignorecase(value: boolean) {
  return ipcRenderer.invoke(KillPortEvent.Set_Git_Ignorecase, value)
}
