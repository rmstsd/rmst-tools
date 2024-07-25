import { KillPortEvent } from '@common/mainRenderer/ipcEvent'
import { ipcRenderer } from './ipc'

export function killPort(port: string) {
  return ipcRenderer.invoke(KillPortEvent.Kill_Port, port)
}
