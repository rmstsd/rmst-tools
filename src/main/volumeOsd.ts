import koffi from 'koffi'

const isWindows = process.platform === 'win32'

const user32 = isWindows ? koffi.load('user32.dll') : null

// EnumWindows 回调:BOOL CALLBACK EnumWindowsProc(HWND hwnd, LPARAM lParam)
const WNDENUMPROC = user32 ? koffi.proto('bool __stdcall WNDENUMPROC(void *hwnd, intptr lParam)') : null

const EnumWindows = user32?.func('int __stdcall EnumWindows(WNDENUMPROC *lpEnumFunc, intptr lParam)')
const FindWindowExW = user32?.func(
  'void * __stdcall FindWindowExW(void *hwndParent, void *hwndChildAfter, str16 lpszClass, str16 lpszWindow)'
)
const GetClassNameW = user32?.func('int __stdcall GetClassNameW(void *hWnd, _Out_ char16_t *lpClassName, int nMaxCount)')
const ShowWindow = user32?.func('int __stdcall ShowWindow(void *hWnd, int nCmdShow)')

const SW_HIDE = 0
const SW_SHOW = 5

// 系统音量 OSD 是一个类名为 NativeHWNDHost 的顶层窗口,内部包含一个类名为 DirectUIHWND 的子窗口。
// 通过遍历所有顶层窗口并校验这种父子关系来定位它(窗口可能被系统重建,句柄不固定)。
const OSD_HOST_CLASS = 'NativeHWNDHost'
const OSD_CONTENT_CLASS = 'DirectUIHWND'

// 持续隐藏:系统在音量变化时可能重新创建/显示该 OSD 窗口,因此用定时器周期性地重新隐藏。
let keepHiddenTimer: NodeJS.Timeout | null = null

function getClassName(hwnd: unknown): string {
  if (!GetClassNameW) {
    return ''
  }

  const buffer = Buffer.alloc(256 * 2)
  const length = GetClassNameW(hwnd, buffer, 256)

  if (length <= 0) {
    return ''
  }

  return buffer.toString('utf16le', 0, length * 2)
}

function isVolumeOsdWindow(hwnd: unknown): boolean {
  if (!FindWindowExW) {
    return false
  }

  if (getClassName(hwnd) !== OSD_HOST_CLASS) {
    return false
  }

  // 校验其内部存在 DirectUIHWND 子窗口,以确认这是音量 OSD 而非其他 NativeHWNDHost 窗口。
  return FindWindowExW(hwnd, null, OSD_CONTENT_CLASS, null) != null
}

function setVolumeOsdVisible(visible: boolean): void {
  if (!isWindows || !EnumWindows || !WNDENUMPROC || !ShowWindow) {
    return
  }

  const callback = koffi.register((hwnd: unknown): boolean => {
    if (isVolumeOsdWindow(hwnd)) {
      ShowWindow(hwnd, visible ? SW_SHOW : SW_HIDE)
    }

    // 返回 true 继续枚举,确保遍历到所有匹配的窗口。
    return true
  }, koffi.pointer(WNDENUMPROC))

  try {
    EnumWindows(callback, 0)
  } finally {
    koffi.unregister(callback)
  }
}

export function hideDefaultVolumeOsd(): void {
  if (!isWindows) {
    return
  }

  setVolumeOsdVisible(false)

  if (keepHiddenTimer) {
    return
  }

  // 周期性地重新隐藏,应对系统在音量变化时重新显示该窗口。
  keepHiddenTimer = setInterval(() => {
    setVolumeOsdVisible(false)
  }, 300)
}

export function restoreDefaultVolumeOsd(): void {
  if (!isWindows) {
    return
  }

  if (keepHiddenTimer) {
    clearInterval(keepHiddenTimer)
    keepHiddenTimer = null
  }

  setVolumeOsdVisible(true)
}
