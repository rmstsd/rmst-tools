import { IpcMain, ipcMain } from 'electron'

export function createHandleListener(channel: string) {
  return (listener: Parameters<IpcMain['handle']>[1]) => {
    ipcMain.handle(channel, listener)

    return function removeListener() {
      ipcMain.removeListener(channel, listener)
    }
  }
}
