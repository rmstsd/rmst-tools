import { spawn } from 'node:child_process'
import type { ChildProcessWithoutNullStreams } from 'node:child_process'
import { writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { VOLUME_LISTENER_SCRIPT } from './volume-listener-script'
import { getManagedWindow } from './windows'

type VolumeState = {
  volume: number
  muted: boolean
}

const VOLUME_LISTENER_SCRIPT_PATH = join(tmpdir(), `rmst-tools-volume-listener-${process.pid}.ps1`)

let volumeListener: ChildProcessWithoutNullStreams | null = null
let stdoutBuffer = ''
let hideTimer: NodeJS.Timeout | null = null

export function startWindowsVolumeListener(): void {
  if (process.platform !== 'win32' || volumeListener) {
    return
  }

  try {
    writeFileSync(VOLUME_LISTENER_SCRIPT_PATH, VOLUME_LISTENER_SCRIPT, 'utf8')
    const listener = spawn(
      'powershell.exe',
      ['-NoProfile', '-Sta', '-NonInteractive', '-ExecutionPolicy', 'Bypass', '-File', VOLUME_LISTENER_SCRIPT_PATH],
      { windowsHide: true, stdio: ['pipe', 'pipe', 'pipe'] }
    )

    volumeListener = listener
    listener.stdout.setEncoding('utf8')
    listener.stdout.on('data', handleListenerOutput)
    listener.stderr.on('data', () => undefined)
    listener.once('error', () => stopWindowsVolumeListener())
    listener.once('exit', () => {
      if (volumeListener === listener) {
        volumeListener = null
        stdoutBuffer = ''
      }
    })
  } catch {
    stopWindowsVolumeListener()
  }
}

export function stopWindowsVolumeListener(): void {
  const listener = volumeListener
  volumeListener = null
  stdoutBuffer = ''

  if (hideTimer) {
    clearTimeout(hideTimer)
    hideTimer = null
  }

  if (!listener || listener.killed) {
    return
  }

  try {
    listener.stdin.write('__exit__\n')
  } catch {
    listener.kill()
  }
}

function handleListenerOutput(chunk: string): void {
  stdoutBuffer += chunk

  while (true) {
    const lineEnd = stdoutBuffer.search(/\r?\n/)
    if (lineEnd === -1) {
      return
    }

    const line = stdoutBuffer.slice(0, lineEnd).trim()
    stdoutBuffer = stdoutBuffer.slice(stdoutBuffer[lineEnd] === '\r' ? lineEnd + 2 : lineEnd + 1)

    try {
      const state = JSON.parse(line) as VolumeState
      showVolumeChange(state)
    } catch {
      // Ignore output not produced by the Core Audio callback.
    }
  }
}

function showVolumeChange(state: VolumeState): void {
  if (!Number.isFinite(state.volume) || typeof state.muted !== 'boolean') {
    return
  }

  // console.log(`[volume-change] volume=${state.volume}, muted=${state.muted}`)

  const loudnessWindow = getManagedWindow('loudness')
  if (!loudnessWindow || loudnessWindow.isDestroyed()) {
    return
  }

  loudnessWindow.webContents.send('volume-change', state)
  loudnessWindow.setOpacity(1)

  if (hideTimer) {
    clearTimeout(hideTimer)
  }
  hideTimer = setTimeout(() => {
    loudnessWindow.setOpacity(0)
    hideTimer = null
  }, 1000)
}
