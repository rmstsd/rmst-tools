import { IpcMain, ipcMain } from 'electron'
import axios from 'axios'
import sharp from 'sharp'

export function createHandleListener(channel: string) {
  return (listener: Parameters<IpcMain['handle']>[1]) => {
    ipcMain.handle(channel, listener)

    return function removeListener() {
      ipcMain.removeListener(channel, listener)
    }
  }
}

export async function networkImageToBuffer(url: string) {
  try {
    const response = await axios.get(url, { responseType: 'arraybuffer' })
    const buffer = await sharp(response.data).png().toBuffer()
    return buffer
  } catch (error) {
    console.error('Error converting image to Data URL:', error)

    return null
  }
}
