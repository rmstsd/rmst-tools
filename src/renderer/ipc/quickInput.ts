import { QuickInputEvent } from '@common/ipcEvent'
import { ipcRenderer } from './ipc'

export function hideQuickInputWin() {
  return ipcRenderer.invoke(QuickInputEvent.Hide_Quick_Input_Win)
}

export function execQuickInput(content: string) {
  return ipcRenderer.invoke(QuickInputEvent.Copy_And_Paste, content)
}

export function setQuickInputWindowSize(size) {
  return ipcRenderer.send(QuickInputEvent.Set_Quick_Input_Win_Size, { width: size.width, height: size.height })
}
