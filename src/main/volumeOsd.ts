import koffi from 'koffi'
import loudness from 'loudness'

const SW_MINIMIZE = 6
const SW_RESTORE = 9
const VK_VOLUME_DOWN = 0xae
const VK_VOLUME_UP = 0xaf

const user32 = process.platform === 'win32' ? koffi.load('user32.dll') : null
const FindWindowExW = user32?.func(
  'void * __stdcall FindWindowExW(void *hwndParent, void *hwndChildAfter, const char16_t *lpszClass, const char16_t *lpszWindow)'
)
const IsWindow = user32?.func('int __stdcall IsWindow(void *hWnd)')
const ShowWindow = user32?.func('int __stdcall ShowWindow(void *hWnd, int nCmdShow)')
const keybdEvent = user32?.func('void __stdcall keybd_event(uint8 bVk, uint8 bScan, uint32 dwFlags, void *dwExtraInfo)')

let volumeOsdWindow: unknown = null
let discoverTimer: NodeJS.Timeout | null = null
let didTriggerOsd = false

export function hideDefaultVolumeOsd(): void {
  if (!FindWindowExW || !ShowWindow) {
    return
  }

  try {
    volumeOsdWindow = findVolumeOsdWindow()

    if (volumeOsdWindow) {
      ShowWindow(volumeOsdWindow, SW_MINIMIZE)
      return
    }

    if (didTriggerOsd || !keybdEvent) {
      return
    }

    // Windows creates the flyout lazily. Trigger it once without changing the final volume.
    didTriggerOsd = true
    void triggerVolumeOsd(true)
  } catch {
    // The system flyout is undocumented and may be absent on some Windows builds.
  }
}

export function restoreDefaultVolumeOsd(): void {
  if (discoverTimer) {
    clearTimeout(discoverTimer)
    discoverTimer = null
  }

  if (!ShowWindow || !IsWindow) {
    return
  }

  try {
    if (!volumeOsdWindow || !IsWindow(volumeOsdWindow)) {
      volumeOsdWindow = findVolumeOsdWindow()
    }

    if (volumeOsdWindow && IsWindow(volumeOsdWindow)) {
      ShowWindow(volumeOsdWindow, SW_RESTORE)
    }

    // Restoring the window alone does not reactivate the Shell flyout.
    void triggerVolumeOsd(false)
  } catch {
    // Do not prevent application shutdown when a Windows shell window has gone away.
  }
}

async function triggerVolumeOsd(hideAfterShowing: boolean): Promise<void> {
  if (!keybdEvent) {
    return
  }

  try {
    const volume = await loudness.getVolume()
    keybdEvent(VK_VOLUME_UP, 0, 0, null)

    if (volume < 100) {
      keybdEvent(VK_VOLUME_DOWN, 0, 0, null)
    }

    if (hideAfterShowing) {
      discoverTimer = setTimeout(hideDefaultVolumeOsd, 200)
    }
  } catch {
    // Leave the system flyout unchanged if the current volume cannot be read.
  }
}

function findVolumeOsdWindow(): unknown {
  return (
    findWindowWithChild('XamlExplorerHostIslandWindow', 'Windows.UI.Composition.DesktopWindowContentBridge') ??
    findWindowWithChild('NativeHWNDHost', 'DirectUIHWND')
  )
}

function findWindowWithChild(outerClass: string, innerClass: string): unknown {
  if (!FindWindowExW) {
    return null
  }

  let window: unknown = null

  while (true) {
    window = FindWindowExW(null, window, outerClass, null)
    if (!window) {
      return null
    }

    if (FindWindowExW(window, null, innerClass, null)) {
      return window
    }
  }
}
