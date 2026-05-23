import { ipcMain, clipboard } from 'electron'
import { Key, keyboard } from '@nut-tree/nut-js'

import { QuickInputEvent } from '@common/mainRenderer/ipcEvent'
import { cachedSize, electronWindow } from '../window'

keyboard.config.autoDelayMs = 0

export function addQuickInputIpcMain() {
  ipcMain.handle(QuickInputEvent.Hide_Quick_Input_Win, () => electronWindow.QuickInput.hide())
  ipcMain.handle(QuickInputEvent.Set_Quick_Input_Win_Size, (_, { width, height }) => {
    width = parseInt(width)
    height = parseInt(height)
    cachedSize.width = width
    cachedSize.height = height

    electronWindow.QuickInput.setBounds({ width, height })
  })

  ipcMain.handle(QuickInputEvent.Copy_And_Paste, async (_, value: string) => {
    if (value.startsWith('m4_')) {
      const [_, str, enter] = value.split('_')
      await keyboard.type(str)

      if (enter === 'enter') {
        keyboard.type(Key.Enter)
      }
      return
    }

    clipboard.writeText(value)
    await keyboard.pressKey(Key.LeftControl, Key.V)
    await keyboard.releaseKey(Key.LeftControl, Key.V)
  })
}
