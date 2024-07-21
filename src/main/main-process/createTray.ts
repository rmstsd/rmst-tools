import { Menu, Tray } from 'electron'

import { electronWindow } from './electronWindow'
import { iconPath } from './iconPath'

export const createTray = () => {
  const tray = new Tray(iconPath)

  tray.on('click', () => {})

  const contextMenu = Menu.buildFromTemplate([
    {
      label: '设置',
      type: 'normal',
      click: () => {
        electronWindow.Setting?.show()
      }
    },
    {
      label: '杀端口号',
      type: 'normal',
      click: () => {
        electronWindow.KillPort?.show()
      }
    },
    { label: '退出', type: 'normal', click: () => process.exit(0) }
  ])

  tray.setToolTip('rmst')
  tray.setContextMenu(contextMenu)
}
