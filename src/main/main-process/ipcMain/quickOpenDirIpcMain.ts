import { ipcMain } from 'electron'
import fse from 'fs-extra'
import { spawn } from 'cross-spawn'
import { electronWindow } from '../window'
import { getStoreSetting } from '../../store'
import { OpenDirEvent } from '@common/mainRenderer/ipcEvent'
import path from 'node:path'

export function addQuickOpenDirIpcMain() {
  ipcMain.handle(OpenDirEvent.Spawn_Open_Dir, openSpawnDir)
  ipcMain.handle(OpenDirEvent.Node_Cmd_Dir, nodeCmdDir)
  ipcMain.handle(OpenDirEvent.Set_Dir_Win_Size, setDirWinSize)

  ipcMain.handle(OpenDirEvent.Project_Names_Tree, getProjectNamesTree)
  ipcMain.handle(OpenDirEvent.Get_CmdPath, () => getStoreSetting().cmdPath)
  ipcMain.handle(OpenDirEvent.Hide_DirWindow, () => electronWindow.OpenDir.hide())
}

export const openSpawnDir = (_, dirPath: string, editorPath: string) => {
  if (!editorPath) {
    return
  }
  spawn(editorPath, [dirPath], { detached: true })
}

export const nodeCmdDir = (_, dirPath) => {
  const cmdPath = getStoreSetting().cmdPath
  if (!cmdPath) {
    return
  }

  spawn(cmdPath, [`-d ${dirPath} --title ${path.basename(dirPath)}`], { shell: true })

  // import cmd from 'node-cmd'
  // cmd.runSync(`${cmdPath} -d ${dirPath}`)
}

export const setDirWinSize = (_, value) => {
  const { x, y } = electronWindow.OpenDir.getBounds()
  electronWindow.OpenDir.setBounds({ x, y, width: 800, height: parseInt(value) })
}

export const getProjectNamesTree = () => {
  const blackList = ['$RECYCLE.BIN', 'System Volume Information']
  const blackStartWithChar = ['_', '$', '.', '-']

  const projectPaths = getStoreSetting()?.projectPaths ?? []

  const namesTree = projectPaths
    .filter(item => fse.existsSync(item) && fse.statSync(item).isDirectory())
    .map(item => ({
      name: item.replace(/\\/g, '/'),
      children: fse
        .readdirSync(item)
        .filter(item => !blackList.includes(item) && !blackStartWithChar.some(char => item.startsWith(char)))
    }))

  return namesTree
}
