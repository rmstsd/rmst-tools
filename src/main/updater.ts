import { is } from '@electron-toolkit/utils'
import logger from 'electron-log'
import { autoUpdater } from 'electron-updater'
import type { DownloadEvent, UpdateInfo } from './types'
import { getManagedWindow } from './windows'

autoUpdater.logger = logger
autoUpdater.autoDownload = false

if (is.dev) {
  autoUpdater.forceDevUpdateConfig = true
}

logger.transports.file.level = 'info'

const logFilePath = logger.transports.file.getFile().path
logger.info('log file path:', logFilePath)

export async function checkUpdate() {
  try {
    return await autoUpdater.checkForUpdates()
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
  sendUpdateEvent({ event: 'available', data: normalizeUpdateInfo(info) })
})

autoUpdater.on('update-not-available', info => {
  logger.info('没有更新')
  getManagedWindow('setting')?.setProgressBar(-1)
  sendUpdateEvent({ event: 'not-available', data: normalizeUpdateInfo(info) })
})

autoUpdater.on('download-progress', progressObj => {
  logger.info('下载监听', progressObj)
  getManagedWindow('setting')?.setProgressBar(progressObj.percent / 100)
  sendUpdateEvent({
    event: 'progress',
    data: {
      percent: progressObj.percent,
      bytesPerSecond: progressObj.bytesPerSecond,
      transferred: progressObj.transferred,
      total: progressObj.total
    }
  })
})

autoUpdater.on('update-downloaded', info => {
  logger.info('下载完成')
  getManagedWindow('setting')?.setProgressBar(-1)
  sendUpdateEvent({ event: 'downloaded', data: normalizeUpdateInfo(info) })

  setTimeout(() => {
    autoUpdater.quitAndInstall()
  }, 500)
})

autoUpdater.on('error', error => {
  logger.error('更新出现错误', error)
  getManagedWindow('setting')?.setProgressBar(-1)
  sendUpdateEvent({ event: 'error', message: getErrorMessage(error) })
})

function sendUpdateEvent(payload: DownloadEvent): void {
  const settingWindow = getManagedWindow('setting')

  if (settingWindow) {
    settingWindow.webContents.send('update-download-event', payload)
  }
}

function normalizeUpdateInfo(info: {
  version?: string
  releaseDate?: string
  releaseName?: string | null
  releaseNotes?: unknown
}): UpdateInfo {
  const updateInfo: UpdateInfo = {
    version: info.version ?? ''
  }

  if (info.releaseDate) {
    updateInfo.releaseDate = info.releaseDate
  }

  if (info.releaseName) {
    updateInfo.releaseName = info.releaseName
  }

  const releaseNotes = normalizeReleaseNotes(info.releaseNotes)
  if (releaseNotes) {
    updateInfo.releaseNotes = releaseNotes
  }

  return updateInfo
}

function normalizeReleaseNotes(releaseNotes: unknown): string | undefined {
  if (typeof releaseNotes === 'string') {
    return releaseNotes
  }

  if (!Array.isArray(releaseNotes)) {
    return undefined
  }

  const notes = releaseNotes
    .map(item => {
      if (typeof item === 'string') {
        return item
      }

      if (item && typeof item === 'object') {
        const note = 'note' in item ? item.note : undefined
        return typeof note === 'string' ? note : undefined
      }

      return undefined
    })
    .filter((note): note is string => Boolean(note))

  return notes.length > 0 ? notes.join('\n') : undefined
}

function getErrorMessage(error: unknown): string {
  if (error instanceof Error) {
    return error.message
  }

  return String(error || '未知错误')
}
