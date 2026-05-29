import { app, BrowserWindow, clipboard, dialog, shell } from 'electron'
import { Key, keyboard } from '@nut-tree-fork/nut-js'
import { execFile, spawn } from 'node:child_process'
import { existsSync } from 'node:fs'
import { readdir, readFile, rm, writeFile } from 'node:fs/promises'
import { basename, dirname, resolve } from 'node:path'
import { promisify } from 'node:util'
import SelectionHook, { type SelectionHookInstance } from 'selection-hook'
import { STORE_KEYS, deleteStoreValue, getStoreValue, setStoreValue } from './store'
import type { CommandItem, NamesTree, NodeModulesFolder, SettingData } from './types'
import { getManagedWindow, hideWindowByKey, openManagedWindow } from './windows'

keyboard.config.autoDelayMs = 0

const execFileAsync = promisify(execFile)
let selectionHook: SelectionHookInstance | null = null

const DEFAULT_SETTING: Required<Omit<SettingData, 'historyOpenedUrls'>> = {
  cmdPath: '',
  editorPaths: [],
  projectPaths: [],
  notes: [],
  nodeModulesFolders: []
}

export function getSetting(): SettingData {
  return {
    ...DEFAULT_SETTING,
    ...getStoreValue<SettingData | null>(STORE_KEYS.setting, null)
  }
}

export function saveSetting(settingData: SettingData): void {
  setStoreValue(STORE_KEYS.setting, {
    ...DEFAULT_SETTING,
    ...settingData
  })
}

export async function importSetting(): Promise<void> {
  const { canceled, filePaths } = await dialog.showOpenDialog({
    properties: ['openFile'],
    filters: [{ name: 'JSON', extensions: ['json'] }]
  })

  if (canceled || !filePaths[0]) {
    throw new Error('已取消导入')
  }

  const content = await readFile(filePaths[0], 'utf-8')
  saveSetting(JSON.parse(content) as SettingData)
}

export async function exportSetting(): Promise<void> {
  const { canceled, filePath } = await dialog.showSaveDialog({
    defaultPath: 'cfg-2.json',
    filters: [{ name: 'JSON', extensions: ['json'] }]
  })

  if (canceled || !filePath) {
    throw new Error('已取消导出')
  }

  await writeFile(filePath, `${JSON.stringify(getSetting(), null, 2)}\n`, 'utf-8')
}

export function clearSettingStore(): void {
  deleteStoreValue(STORE_KEYS.setting)
}

export function getCommands(): CommandItem[] {
  return getStoreValue<CommandItem[]>(STORE_KEYS.commands, [])
}

export function saveCommands(commands: CommandItem[] = []): void {
  setStoreValue(STORE_KEYS.commands, commands)
}

export async function execCommandByLabel(label: string): Promise<void> {
  const command = getCommands().find(item => item.label === label)

  if (!command) {
    return
  }

  await runCommand(command)
}

async function runCommand(command: CommandItem): Promise<void> {
  await new Promise<void>((resolvePromise, reject) => {
    const child = spawn(command.cmd, splitArgs(command.arg), {
      cwd: command.currentDir || undefined,
      shell: true,
      windowsHide: true,
      stdio: 'ignore'
    })

    let stderr = ''

    child.stderr?.on('data', chunk => {
      stderr += String(chunk)
    })

    child.on('error', error => reject(error))
    child.on('close', code => {
      if (code === 0) {
        resolvePromise()
        return
      }

      reject(new Error(stderr.trim() || `命令执行失败，退出码：${code}`))
    })
  })
}

function splitArgs(value: string): string[] {
  const args: string[] = []
  const regexp = /"([^"]*)"|'([^']*)'|[^\s]+/g
  let match: RegExpExecArray | null

  while ((match = regexp.exec(value)) !== null) {
    args.push(match[1] ?? match[2] ?? match[0])
  }

  return args
}

export async function getProjectNamesTree(): Promise<NamesTree[]> {
  const blackList = new Set(['$RECYCLE.BIN', 'System Volume Information'])
  const blackStartWithChar = ['_', '$', '.', '-']
  const projectPaths = getSetting().projectPaths ?? []
  const result: NamesTree[] = []

  for (const projectPath of projectPaths) {
    if (!existsSync(projectPath)) {
      continue
    }

    try {
      const children = (await readdir(projectPath, { withFileTypes: true }))
        .map(item => item.name)
        .filter(name => !blackList.has(name))
        .filter(name => !blackStartWithChar.some(char => name.startsWith(char)))

      result.push({
        name: projectPath.replace(/\\/g, '/'),
        children
      })
    } catch {
      continue
    }
  }

  return result
}

export async function openFolderEditor(projectPath: string, editorPath: string): Promise<void> {
  if (!projectPath || !editorPath) {
    throw new Error('缺少项目路径或编辑器命令')
  }

  await new Promise<void>((resolvePromise, reject) => {
    const child = spawn(editorPath, [projectPath], {
      detached: true,
      shell: true,
      stdio: 'ignore',
      windowsHide: true
    })

    child.on('error', reject)
    child.unref()
    resolvePromise()
  })
}

export async function openWithTerminal(projectPath: string): Promise<void> {
  if (!projectPath) {
    throw new Error('缺少项目路径')
  }

  const title = basename(projectPath)
  await new Promise<void>((resolvePromise, reject) => {
    const child = spawn('wt', ['-d', projectPath, '--title', title, '--suppressApplicationTitle'], {
      detached: true,
      stdio: 'ignore',
      windowsHide: true
    })

    child.on('error', reject)
    child.unref()
    resolvePromise()
  })
}

export async function openInExplorer(inputPath: string): Promise<void> {
  const normalizedPath = inputPath.replace(/\//g, '\\')
  const error = await shell.openPath(normalizedPath)

  if (error) {
    throw new Error(error)
  }
}

export async function killPort(port: number): Promise<boolean> {
  if (!Number.isInteger(port) || port <= 0) {
    throw new Error('端口号无效')
  }

  if (process.platform === 'win32') {
    const { stdout } = await execFileAsync('netstat', ['-ano'], { windowsHide: true })
    const portSuffix = `:${port}`
    const pids = new Set<string>()

    for (const line of stdout.split(/\r?\n/)) {
      const parts = line.trim().split(/\s+/)
      if (parts.length >= 5 && parts[1]?.endsWith(portSuffix)) {
        pids.add(parts[4])
      }
    }

    for (const pid of pids) {
      await execFileAsync('taskkill', ['/F', '/PID', pid], { windowsHide: true })
    }

    return true
  }

  const { stdout } = await execFileAsync('sh', ['-c', `lsof -t -i:${port}`])
  for (const pid of stdout.split(/\r?\n/).filter(Boolean)) {
    await execFileAsync('kill', ['-9', pid])
  }

  return true
}

export async function removeFolders(nodeModulesFolders: NodeModulesFolder[] = []): Promise<void> {
  for (const item of nodeModulesFolders) {
    if (!item.selected || !item.path) {
      continue
    }

    const basePath = resolve(item.path)
    const targetPath = resolve(basePath, 'node_modules')

    if (dirname(targetPath) !== basePath || basename(targetPath) !== 'node_modules') {
      throw new Error(`删除目标无效：${item.path}`)
    }

    if (existsSync(targetPath)) {
      await rm(targetPath, { recursive: true, force: true })
    }
  }
}

export async function copyAndPaste(content: string): Promise<void> {
  clipboard.writeText(content)
  hideWindowByKey('quickInput')
  await sendKeys(Key.V)
}

export async function getSelectedText(): Promise<string> {
  const selection = getSelectionHook().getCurrentSelection()

  return selection?.text.trim() ?? ''
}

export function cleanupSelectionHook(): void {
  selectionHook?.cleanup()
  selectionHook = null
}

export async function showQrCodeFromSelection(): Promise<void> {
  const text = await getSelectedText()
  if (!text) {
    return
  }

  const settingWindow = openManagedWindow('setting')
  settingWindow.webContents.send('Show_Qrcode', text)
}

export async function openExplorerFromSelection(): Promise<void> {
  const text = await getSelectedText()
  if (text) {
    await openInExplorer(text)
  }
}

export function getPackageInfo(): Record<string, string> {
  return {
    name: app.getName(),
    version: app.getVersion(),
    author: 'rmstsd',
    electron: process.versions.electron,
    chrome: process.versions.chrome,
    node: process.versions.node
  }
}

export function getQuickInputWindow(): BrowserWindow | undefined {
  return getManagedWindow('quickInput')
}

function getSelectionHook(): SelectionHookInstance {
  if (selectionHook?.isRunning()) {
    return selectionHook
  }

  selectionHook?.cleanup()
  selectionHook = new SelectionHook()
  selectionHook.on('error', error => {
    console.warn('[selection-hook]', error.message)
  })

  const started = selectionHook.start({
    selectionPassiveMode: true,
    enableClipboard: true
  })

  if (!started) {
    selectionHook.cleanup()
    selectionHook = null
    throw new Error('启动划词监听失败')
  }

  return selectionHook
}

async function sendKeys(key: Key): Promise<void> {
  const modifierKey = process.platform === 'darwin' ? Key.LeftSuper : Key.LeftControl

  await keyboard.pressKey(modifierKey, key)
  try {
  } finally {
    await keyboard.releaseKey(modifierKey, key)
  }
}
