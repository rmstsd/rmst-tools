import { execFile, execFileSync } from 'node:child_process'
import { promisify } from 'node:util'
import logger from 'electron-log'
// 打包后 electron-vite 会把该资源发射到运行时目录并返回正确路径;
// ?asset&asarUnpack 确保 exe 被解包到 asar 之外,从而可被子进程直接执行。
import hideVolumeOsdExe from '../../resources/HideVolumeOSD.exe?asset&asarUnpack'

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
export function restoreDefaultVolumeOsdSync(): void {
  if (!isWindows) {
    return
  }

  try {
    execFileSync(hideVolumeOsdExe, [ARG_SHOW], { windowsHide: true, timeout: 2000 })
  } catch (err) {
    logger.error('[volumeOsd] 同步恢复 HideVolumeOSD 失败:', err)
  }
}
