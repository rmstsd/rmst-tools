import { globalShortcut, screen } from 'electron'

import { cachedSize, electronWindow } from './electronWindow'

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
    handleQuickInputWindow()
  })
}

function handleQuickInputWindow() {
  if (electronWindow.QuickInput.isVisible()) {
    electronWindow.QuickInput.hide()
  } else {
    const cursorCoord = screen.getCursorScreenPoint()

    const { width, height } = electronWindow.QuickInput.getBounds()
    const display = screen.getDisplayNearestPoint(cursorCoord)

    const { workArea } = display

    const x = Math.min(cursorCoord.x - 10, workArea.x + workArea.width - width)
    const y = Math.min(cursorCoord.y - 10, workArea.y + workArea.height - height)

    electronWindow.QuickInput.setBounds({ x, y, ...cachedSize })
    electronWindow.QuickInput.setAlwaysOnTop(true, 'screen-saver')
    electronWindow.QuickInput.show()
  }
}
