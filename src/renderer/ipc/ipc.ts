const { ipcRenderer, platform } = window.electron

export { ipcRenderer, platform }

export function createOnListener<T extends any>(channel: string) {
  return (listener: (data: T) => void) => {
    const remove = ipcRenderer.on(channel, (_, data) => {
      listener(data)
    })

    return remove
  }
}
