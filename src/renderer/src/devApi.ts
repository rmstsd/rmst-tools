import type { CommandItem, DirNamesTree, SettingData } from './types'

export function installDevApiFallback(): void {
  if (window.api) {
    return
  }

  const setting: SettingData = {
    editorPaths: ['Code', 'Cursor'],
    projectPaths: ['E:/project'],
    notes: ['常用文本', 'npm run dev'],
    nodeModulesFolders: [{ selected: true, path: 'E:/project/demo' }]
  }

  const commands: CommandItem[] = [{ label: 'dev', cmd: 'npm', arg: 'run dev', currentDir: 'E:/project/demo' }]

  const tree: DirNamesTree[] = [{ name: 'E:/project', children: ['rmst-toolkit', 'electron-temp', 'demo-app'] }]

  window.api = {
    async invoke<T = unknown>(channel: string): Promise<T> {
      const data: Record<string, unknown> = {
        getSetting: setting,
        getCommands: commands,
        getProjectNamesTree: tree,
        get_package_info: {
          name: 'rmst-toolkit-electron',
          version: '0.1.55',
          electron: 'preview',
          chrome: 'preview',
          node: 'preview'
        },
        getHistoryOpenedUrls: ['https://semi.design', 'https://electron-vite.org'],
        checkUpdate: {
          needUpdate: false,
          current_version: '0.1.55',
          version: '0.1.55'
        }
      }

      return data[channel] as T
    },
    onWindowFocusChanged() {
      return () => undefined
    },
    onShowQrCode() {
      return () => undefined
    },
    onUpdateDownload() {
      return () => undefined
    }
  }
}
