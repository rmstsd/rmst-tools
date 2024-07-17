import { app, BrowserWindow } from 'electron'

console.log(app.isPackaged)
console.log(221)
const a = 9
console.log(a)
const bb = 88
bb
console.log(bb)

app.whenReady().then(() => {
  const win = new BrowserWindow()
  win.loadURL('http://localhost:10000/')
})
