export enum SettingEvent {
  Get_Base_Info = 'get-base-info',
  Check_Update = 'check-update',
  Save_Setting = 'save-setting',
  Get_Setting = 'get-setting',
  Clear_Ele_Store = 'clear-ele-store'
}

export enum QuickInputEvent {
  Hide_Quick_Input_Win = 'hide-num-win',
  Set_Quick_Input_Win_Size = 'set-num-win-size',
  Press_Char = 'press-char',
  Copy_And_Paste = 'copy-and-paste'
}

export enum OpenDirEvent {
  Spawn_Open_Dir = 'spawn-open-dir',
  Node_Cmd_Dir = 'node-cmd-dir',
  Set_Dir_Win_Size = 'set-dir-win-size',
  Project_Names_Tree = 'project-names-tree',
  Get_CmdPath = 'get-cmdPath',
  Hide_DirWindow = 'hide-dirWindow'
}

export enum CommonEvent {
  Copy_Text = 'copy-text',
  Open_External = 'open-external'
}

export enum KillPortEvent {
  Kill_Port = 'kill-port'
}

export enum BrowserEvent {
  Browser_Minimize = 'browser_Minimize',
  Browser_Maximize = 'browser_maximize',
  Browser_Unmaximize = 'browser_unmaximize',
  Browser_Close = 'browser_close'
}
