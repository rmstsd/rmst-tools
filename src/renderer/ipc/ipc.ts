import { IpcRenderer } from 'electron'

const { ipcRenderer, platform } = window.electron

export { ipcRenderer, platform }

export function createOnListener(channel: string) {
  return (listener: Parameters<IpcRenderer['on']>[1]) => {
    const remove = ipcRenderer.on(channel, (...r ) => {
      console.log()
    })

    return remove
  }
}
