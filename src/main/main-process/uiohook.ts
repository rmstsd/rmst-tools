import { globalShortcut, screen } from 'electron'

import { electronWindow } from './electronWindow'

export const addShortcut = () => {
  globalShortcut.register('Alt+Space', () => {
    if (electronWindow.OpenDir.isVisible()) {
      electronWindow.OpenDir.minimize()
      electronWindow.OpenDir.hide()
    } else {
      electronWindow.OpenDir.show()
    }
  })

  globalShortcut.register('Alt+n', () => {
    handleNumWindow()
  })
}

function handleNumWindow() {
  if (electronWindow.QuickInput.isVisible()) {
    electronWindow.QuickInput.hide()
  } else {
    const cursorCoord = screen.getCursorScreenPoint()

    electronWindow.QuickInput.setPosition(cursorCoord.x - 10, cursorCoord.y - 10)
    electronWindow.QuickInput.show()
  }
}
