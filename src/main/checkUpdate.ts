import { autoUpdater } from 'electron-updater'
import { dialog } from 'electron'
import log from 'electron-log/main'
import { electronWindow } from './main-process/electronWindow'
import { is } from '@electron-toolkit/utils'

log.transports.file.level = 'info'
autoUpdater.logger = log
autoUpdater.autoDownload = false

if (is.dev) {
  autoUpdater.forceDevUpdateConfig = true
}

export function checkForUpdate() {
  return autoUpdater.checkForUpdates().catch(err => {
    log.info('checkForUpdates 失败', err)

    return Promise.reject()
  })
}

//* 监听updater的事件
/**
 * -1 检查更新失败 0 正在检查更新 1 检测到新版本，准备下载 2 未检测到新版本 3 下载中 4 下载完成
 **/

// 当开始检查更新的时候触发
autoUpdater.on('checking-for-update', () => {
  log.info('开始检查更新')
})

// 发现可更新数据时
autoUpdater.on('update-available', info => {
  log.info('有更新', info)

  const format = (dateTime: string) => {
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

  dialog
    .showMessageBox(electronWindow.Setting, {
      type: 'info',
      title: '版本更新',
      message: `有新版本 ${info.version} 可用, 是否更新`,
      detail: `发布日期: ${format(info.releaseDate)}`,
      cancelId: 1, // 按esc默认点击索引按钮
      defaultId: 0, // 默认高亮的按钮下标
      buttons: ['确认', '取消'] // 按钮按索引从右往左排序
    })
    .then(({ response }) => {
      log.info('update-available', response)

      if (response === 0) {
        autoUpdater.downloadUpdate()
      }
    })
})

// 没有可更新数据时
autoUpdater.on('update-not-available', () => {
  log.info('没有更新')

  dialog.showMessageBox(electronWindow.Setting, { type: 'info', title: '版本更新', message: '没有更新' })
})

// 下载监听
autoUpdater.on('download-progress', progressObj => {
  log.info('下载监听', progressObj)

  electronWindow.Setting.setProgressBar(progressObj.percent / 100)
})

// 下载完成
autoUpdater.on('update-downloaded', () => {
  log.info('下载完成')

  dialog
    .showMessageBox(electronWindow.Setting, {
      type: 'info',
      title: '版本更新',
      message: '新版本已经下载完成, 是否更新',
      cancelId: 1, // 按esc默认点击索引按钮
      defaultId: 0, // 默认高亮的按钮下标
      buttons: ['确认', '取消'] // 按钮按索引从右往左排序
    })
    .then(({ response }) => {
      if (response === 0) {
        autoUpdater.quitAndInstall()
      } else {
        electronWindow.Setting.setProgressBar(-1)
      }
    })
})

// 当更新发生错误的时候触发。
autoUpdater.on('error', err => {
  console.log('更新出现错误', err.message)
  if (err.message.includes('sha512 checksum mismatch')) {
  } else {
  }
})
