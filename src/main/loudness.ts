import loudness from 'loudness'
import { getManagedWindow } from './windows'

let previousState: string | null = null
let timer

async function initLoudness(): Promise<void> {
  const [volume, muted] = await Promise.all([loudness.getVolume(), loudness.getMuted()])
  const state = { volume, muted }
  const stateKey = JSON.stringify(state)

  if (previousState === null) {
    previousState = stateKey
    return
  }

  if (stateKey === previousState) {
    return
  }

  previousState = stateKey
  const loudnessWindow = getManagedWindow('loudness')

  if (!loudnessWindow) {
    return
  }

  loudnessWindow.webContents.send('volume-change', state)
  loudnessWindow.setOpacity(1)

  clearTimeout(timer)
  timer = setTimeout(() => {
    loudnessWindow.setOpacity(0)
  }, 1000)
}

setInterval(() => {
  initLoudness()
}, 50)
