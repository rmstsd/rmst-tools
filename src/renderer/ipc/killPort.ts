import { KillPortEvent } from '@common/ipcEvent'
import { ipcRenderer } from './ipc'

export function killPort(port: string) {
  return ipcRenderer.invoke(KillPortEvent.Kill_Port, port)
}
