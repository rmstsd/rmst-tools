import { ipcMain } from 'electron'

import { electronWindow } from '../electronWindow'
import { getStoreSetting } from '../../store'
import { OpenDirEvent } from '@common/ipcEvent'

export function addQuickOpenDirIpcMain() {
  ipcMain.handle(OpenDirEvent.Spawn_Open_Dir, openSpawnDir)
  ipcMain.handle(OpenDirEvent.Node_Cmd_Dir, nodeCmdDir)
  ipcMain.handle(OpenDirEvent.Set_Dir_Win_Size, setDirWinSize)

  ipcMain.handle(OpenDirEvent.Project_Names_Tree, getProjectNamesTree)
  ipcMain.handle(OpenDirEvent.Get_CmdPath, () => getStoreSetting().cmdPath)
  ipcMain.handle(OpenDirEvent.Hide_DirWindow, () => electronWindow.OpenDir.hide())
}

import fse from 'fs-extra'
import { spawn } from 'cross-spawn'

export const openSpawnDir = (_, dirPath) => {
  const editorPath = getStoreSetting().vscodePath
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

  spawn(cmdPath, [`-d ${dirPath}`], { shell: true })

  // import cmd from 'node-cmd'
  // cmd.runSync(`${cmdPath} -d ${dirPath}`)
}

export const setDirWinSize = (_, value) => {
  const { x, y } = electronWindow.OpenDir.getBounds()
  electronWindow.OpenDir.setBounds({ x, y, width: 800, height: parseInt(value) })
}

export const getProjectNamesTree = () => {
  const blackList = ['$RECYCLE.BIN', 'System Volume Information']

  const { projectPaths = [] } = getStoreSetting()
  const namesTree = projectPaths.map(item => ({
    name: item.replace(/\\/g, '/'),
    children: fse.readdirSync(item).filter(item => !blackList.includes(item))
  }))

  return namesTree
}
