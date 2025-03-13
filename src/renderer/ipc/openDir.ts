import { OpenDirEvent } from '@common/mainRenderer/ipcEvent'
import { ipcRenderer } from './ipc'
import { Listener } from 'src/preload'

export function hideDirWindow() {
  return ipcRenderer.invoke(OpenDirEvent.Hide_DirWindow)
}

export function setDirWindowSize(size) {
  return ipcRenderer.invoke(OpenDirEvent.Set_Dir_Win_Size, size.height)
}

export function openWithVscode(projectPath: string, editorPath: string) {
  return ipcRenderer.invoke(OpenDirEvent.Spawn_Open_Dir, projectPath, editorPath)
}

export function openWithTerminal(projectPath: string) {
  return ipcRenderer.invoke(OpenDirEvent.Node_Cmd_Dir, projectPath)
}

export function getProjectNamesTree() {
  return window.electron.ipcRenderer.invoke(OpenDirEvent.Project_Names_Tree).then(data => {
    return Array.isArray(data) ? data : []
  })
}
