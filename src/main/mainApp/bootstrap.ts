// import { Menu, app } from 'electron'

// import { createTray } from '../main-process/createTray'
import createWindow, { testCreateWindow } from '../main-process/window'
// import { addIpcMain } from '../main-process/ipcMain'
// import { addShortcut } from '../main-process/shortcut'

// export default function bootstrap() {
//   addIpcMain()
//   Menu.setApplicationMenu(null)

//   createWindow()

//   createTray()

//   addShortcut()
// }

export function launchAtStartup() {
  // app.setLoginItemSettings({ openAtLogin: true })
}

export default function bootstrap() {
  testCreateWindow()
}
