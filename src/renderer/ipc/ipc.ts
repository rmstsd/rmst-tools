import { IpcRenderer } from 'electron'

const { ipcRenderer } = window.electron

export { ipcRenderer }

export function createOnListener(channel: string) {
  return (listener: Parameters<IpcRenderer['on']>[1]) => {
    const remove = ipcRenderer.on(channel, listener)

    return remove
  }
}
