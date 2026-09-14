import { execFile, execFileSync } from 'node:child_process'
import { promisify } from 'node:util'
import logger from 'electron-log'
// 打包后 electron-vite 会把该资源发射到运行时目录并返回正确路径;
// ?asset&asarUnpack 确保 exe 被解包到 asar 之外,从而可被子进程直接执行。
import hideVolumeOsdExe from '../../resources/HideVolumeOSD.exe?asset&asarUnpack'

import { screen } from 'electron'
import { managedWindows } from './windows'

const execFileAsync = promisify(execFile)

const isWindows = process.platform === 'win32'

// withmorten/HideVolumeOSD 命令行工具:
//   HideVolumeOSD.exe        -> 隐藏系统音量 OSD(执行一次即退出)
//   HideVolumeOSD.exe SHOW   -> 恢复系统音量 OSD(执行一次即退出)
const ARG_SHOW = 'SHOW'

async function runVolumeOsdExe(args: string[]): Promise<void> {
  if (!isWindows) {
    return
  }

  try {
    await execFileAsync(hideVolumeOsdExe, args, { windowsHide: true })
  } catch (err) {
    // 仅记录日志,不抛出,避免影响应用启动/退出流程。
    logger.error('[volumeOsd] 执行 HideVolumeOSD 失败:', err)
  }
}

export function hideDefaultVolumeOsd(): void {
  void runVolumeOsdExe([])
}

export function restoreDefaultVolumeOsd(): void {
  void runVolumeOsdExe([ARG_SHOW])
}

// 同步恢复:用于 will-quit 场景,确保进程退出前 OSD 已恢复。
function restoreDefaultVolumeOsdSync(): void {
  if (!isWindows) {
    return
  }

  try {
    execFileSync(hideVolumeOsdExe, [ARG_SHOW], { windowsHide: true, timeout: 2000 })
  } catch (err) {
    logger.error('[volumeOsd] 同步恢复 HideVolumeOSD 失败:', err)
  }
}

export function screenOnChange() {
  // 1. 监听新增屏幕（例如插拔显示器、扩展屏）
  screen.on('display-added', (event, newDisplay) => {
    managedWindows.get('loudness').setPosition(20, 20)
  })

  // 2. 监听移除屏幕
  screen.on('display-removed', (event, oldDisplay) => {
    managedWindows.get('loudness').setPosition(20, 20)
  })

  // 3. 监听屏幕指标变化（分辨率、缩放比例、工作区大小、旋转方向等）
  screen.on('display-metrics-changed', (event, display, changedMetrics) => {
    managedWindows.get('loudness').setPosition(20, 20)
  })
}
