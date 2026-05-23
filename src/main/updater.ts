import { dialog } from 'electron'
import type { MessageBoxOptions } from 'electron'
import { is } from '@electron-toolkit/utils'
import logger from 'electron-log'
import { autoUpdater } from 'electron-updater'
import { getManagedWindow } from './windows'

autoUpdater.logger = logger
autoUpdater.autoDownload = false

if (is.dev) {
  logger.transports.file.resolvePathFn = () => 'logs/main.log'
  autoUpdater.forceDevUpdateConfig = true
}

logger.transports.file.level = 'info'

export async function checkUpdate(): Promise<void> {
  try {
    await autoUpdater.checkForUpdates()
  } catch (error) {
    logger.error('checkForUpdates 失败', error)
    throw new Error(`检查更新失败：${getErrorMessage(error)}`)
  }
}

export async function downloadAndInstall(): Promise<void> {
  try {
    await autoUpdater.downloadUpdate()
  } catch (error) {
    logger.error('downloadUpdate 失败', error)
    throw new Error(`下载更新失败：${getErrorMessage(error)}`)
  }
}

autoUpdater.on('checking-for-update', () => {
  logger.info('开始检查更新')
})

autoUpdater.on('update-available', info => {
  logger.info('有更新', info)

  void showUpdateDialog({
    type: 'info',
    title: '版本更新',
    message: `有新版本 ${info.version} 可用, 是否更新`,
    detail: `发布日期: ${formatDate(info.releaseDate)}`,
    cancelId: 1,
    defaultId: 0,
    buttons: ['确认', '取消']
  }).then(({ response }) => {
    logger.info('update-available', response)

    if (response === 0) {
      void downloadAndInstall()
    }
  })
})

autoUpdater.on('update-not-available', () => {
  logger.info('没有更新')
  getManagedWindow('setting')?.setProgressBar(-1)

  void showUpdateDialog({
    type: 'info',
    title: '版本更新',
    message: '没有更新'
  })
})

autoUpdater.on('download-progress', progressObj => {
  logger.info('下载监听', progressObj)
  getManagedWindow('setting')?.setProgressBar(progressObj.percent / 100)
})

autoUpdater.on('update-downloaded', () => {
  logger.info('下载完成')

  void showUpdateDialog({
    type: 'info',
    title: '版本更新',
    message: '新版本已经下载完成, 是否更新',
    cancelId: 1,
    defaultId: 0,
    buttons: ['确认', '取消']
  }).then(({ response }) => {
    if (response === 0) {
      autoUpdater.quitAndInstall()
      return
    }

    getManagedWindow('setting')?.setProgressBar(-1)
  })
})

autoUpdater.on('error', error => {
  logger.error('更新出现错误', error)
  getManagedWindow('setting')?.setProgressBar(-1)
})

function showUpdateDialog(options: MessageBoxOptions): Promise<Electron.MessageBoxReturnValue> {
  const settingWindow = getManagedWindow('setting')

  if (settingWindow) {
    return dialog.showMessageBox(settingWindow, options)
  }

  return dialog.showMessageBox(options)
}

function formatDate(dateTime?: string): string {
  if (!dateTime) {
    return '未知'
  }

  return new Intl.DateTimeFormat('zh', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false
  })
    .format(new Date(dateTime))
    .replace(/[/]/g, '-')
}

function getErrorMessage(error: unknown): string {
  if (error instanceof Error) {
    return error.message
  }

  return String(error || '未知错误')
}
