import { spawn } from 'node:child_process'
import type { ChildProcessWithoutNullStreams } from 'node:child_process'
import { writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import koffi from 'koffi'

export type CaretRect = {
  x: number
  y: number
  width: number
  height: number
  source: 'uia-textpattern2' | 'uia-textpattern' | 'msaa-caret' | 'win32'
  isActive?: boolean
  hwndCaret?: unknown
}

type UiaCaretPayload =
  | {
      ok: true
      x: number
      y: number
      width: number
      height: number
      source: 'uia-textpattern2' | 'uia-textpattern' | 'msaa-caret'
      isActive?: boolean
    }
  | {
      ok: false
      reason?: string
    }

const isWindows = process.platform === 'win32'
const CARET_HELPER_SCRIPT_PATH = join(tmpdir(), `rmst-tools-caret-helper-${process.pid}.ps1`)

type PendingCaretRequest = {
  resolve: (value: string) => void
  reject: (error: Error) => void
  timer: NodeJS.Timeout
}

let caretHelper: ChildProcessWithoutNullStreams | null = null
let caretHelperStdoutBuffer = ''
let pendingCaretRequests: PendingCaretRequest[] = []

const UIA_CARET_SCRIPT = String.raw`
$ErrorActionPreference = 'Stop'

$src = @'
using System;
using System.Globalization;
using System.Runtime.InteropServices;
using Accessibility;

[ComImport, Guid("ff48dba4-60ef-4201-aa87-54103eef594e")]
class CUIAutomation
{
}

[StructLayout(LayoutKind.Sequential)]
struct POINT
{
    public int x;
    public int y;
}

[StructLayout(LayoutKind.Sequential)]
struct NATIVE_RECT
{
    public int left;
    public int top;
    public int right;
    public int bottom;
}

[StructLayout(LayoutKind.Sequential)]
struct GUITHREADINFO
{
    public int cbSize;
    public int flags;
    public IntPtr hwndActive;
    public IntPtr hwndFocus;
    public IntPtr hwndCapture;
    public IntPtr hwndMenuOwner;
    public IntPtr hwndMoveSize;
    public IntPtr hwndCaret;
    public NATIVE_RECT rcCaret;
}

[ComImport, Guid("30cbe57d-d9d0-452a-ab13-7ac5ac4825ee"), InterfaceType(ComInterfaceType.InterfaceIsIUnknown)]
interface IUIAutomation
{
    [PreserveSig] int CompareElements(IntPtr el1, IntPtr el2, out int areSame);
    [PreserveSig] int CompareRuntimeIds(IntPtr runtimeId1, IntPtr runtimeId2, out int areSame);
    [PreserveSig] int GetRootElement(out IUIAutomationElement root);
    [PreserveSig] int ElementFromHandle(IntPtr hwnd, out IUIAutomationElement element);
    [PreserveSig] int ElementFromPoint(POINT pt, out IUIAutomationElement element);
    [PreserveSig] int GetFocusedElement(out IUIAutomationElement element);
    [PreserveSig] int GetRootElementBuildCache(IntPtr cacheRequest, out IUIAutomationElement root);
    [PreserveSig] int ElementFromHandleBuildCache(IntPtr hwnd, IntPtr cacheRequest, out IUIAutomationElement element);
    [PreserveSig] int ElementFromPointBuildCache(POINT pt, IntPtr cacheRequest, out IUIAutomationElement element);
    [PreserveSig] int GetFocusedElementBuildCache(IntPtr cacheRequest, out IUIAutomationElement element);
    [PreserveSig] int CreateTreeWalker(IUIAutomationCondition condition, out IntPtr walker);
    [PreserveSig] int get_ControlViewWalker(out IntPtr walker);
    [PreserveSig] int get_ContentViewWalker(out IntPtr walker);
    [PreserveSig] int get_RawViewWalker(out IntPtr walker);
    [PreserveSig] int get_RawViewCondition(out IUIAutomationCondition condition);
    [PreserveSig] int get_ControlViewCondition(out IUIAutomationCondition condition);
    [PreserveSig] int get_ContentViewCondition(out IUIAutomationCondition condition);
    [PreserveSig] int CreateCacheRequest(out IntPtr cacheRequest);
    [PreserveSig] int CreateTrueCondition(out IUIAutomationCondition newCondition);
}

[ComImport, Guid("352ffba8-0973-437c-a61f-f64cafd81df9"), InterfaceType(ComInterfaceType.InterfaceIsIUnknown)]
interface IUIAutomationCondition
{
}

[ComImport, Guid("d22108aa-8ac5-49a5-837b-37bbb3d7591e"), InterfaceType(ComInterfaceType.InterfaceIsIUnknown)]
interface IUIAutomationElement
{
    [PreserveSig] int SetFocus();
    [PreserveSig] int GetRuntimeId(out IntPtr runtimeId);
    [PreserveSig] int FindFirst(int scope, IntPtr condition, out IUIAutomationElement found);
    [PreserveSig] int FindAll(int scope, IUIAutomationCondition condition, out IUIAutomationElementArray found);
    [PreserveSig] int FindFirstBuildCache(int scope, IntPtr condition, IntPtr cacheRequest, out IUIAutomationElement found);
    [PreserveSig] int FindAllBuildCache(int scope, IntPtr condition, IntPtr cacheRequest, out IntPtr found);
    [PreserveSig] int BuildUpdatedCache(IntPtr cacheRequest, out IUIAutomationElement updatedElement);
    [PreserveSig] int GetCurrentPropertyValue(int propertyId, out object retVal);
    [PreserveSig] int GetCurrentPropertyValueEx(int propertyId, int ignoreDefaultValue, out object retVal);
    [PreserveSig] int GetCachedPropertyValue(int propertyId, out object retVal);
    [PreserveSig] int GetCachedPropertyValueEx(int propertyId, int ignoreDefaultValue, out object retVal);
    [PreserveSig] int GetCurrentPatternAs(int patternId, ref Guid riid, [MarshalAs(UnmanagedType.Interface)] out object patternObject);
}

[ComImport, Guid("14314595-b4bc-4055-95f2-58f2e42c9855"), InterfaceType(ComInterfaceType.InterfaceIsIUnknown)]
interface IUIAutomationElementArray
{
    [PreserveSig] int get_Length(out int length);
    [PreserveSig] int GetElement(int index, out IUIAutomationElement element);
}

[ComImport, Guid("506a921a-fcc9-409f-b23b-37eb74106872"), InterfaceType(ComInterfaceType.InterfaceIsIUnknown)]
interface IUIAutomationTextPattern2
{
    [PreserveSig] int RangeFromPoint(POINT pt, out IUIAutomationTextRange range);
    [PreserveSig] int RangeFromChild(IUIAutomationElement child, out IUIAutomationTextRange range);
    [PreserveSig] int GetSelection(out IUIAutomationTextRangeArray ranges);
    [PreserveSig] int GetVisibleRanges(out IUIAutomationTextRangeArray ranges);
    [PreserveSig] int get_DocumentRange(out IUIAutomationTextRange range);
    [PreserveSig] int get_SupportedTextSelection(out int supportedTextSelection);
    [PreserveSig] int RangeFromAnnotation(IUIAutomationElement annotation, out IUIAutomationTextRange range);
    [PreserveSig] int GetCaretRange(out int isActive, out IUIAutomationTextRange range);
}

[ComImport, Guid("32eba289-3583-42c9-9c59-3b6d9a1e9b6a"), InterfaceType(ComInterfaceType.InterfaceIsIUnknown)]
interface IUIAutomationTextPattern
{
    [PreserveSig] int RangeFromPoint(POINT pt, out IUIAutomationTextRange range);
    [PreserveSig] int RangeFromChild(IUIAutomationElement child, out IUIAutomationTextRange range);
    [PreserveSig] int GetSelection(out IUIAutomationTextRangeArray ranges);
    [PreserveSig] int GetVisibleRanges(out IUIAutomationTextRangeArray ranges);
    [PreserveSig] int get_DocumentRange(out IUIAutomationTextRange range);
    [PreserveSig] int get_SupportedTextSelection(out int supportedTextSelection);
}

[ComImport, Guid("ce4ae76a-e717-4c98-81ea-47371d028eb6"), InterfaceType(ComInterfaceType.InterfaceIsIUnknown)]
interface IUIAutomationTextRangeArray
{
    [PreserveSig] int get_Length(out int length);
    [PreserveSig] int GetElement(int index, out IUIAutomationTextRange element);
}

[ComImport, Guid("a543cc6a-f4ae-494b-8239-c814481187a8"), InterfaceType(ComInterfaceType.InterfaceIsIUnknown)]
interface IUIAutomationTextRange
{
    [PreserveSig] int Clone(out IUIAutomationTextRange clonedRange);
    [PreserveSig] int Compare(IUIAutomationTextRange range, out int areSame);
    [PreserveSig] int CompareEndpoints(int srcEndPoint, IUIAutomationTextRange range, int targetEndPoint, out int compValue);
    [PreserveSig] int ExpandToEnclosingUnit(int textUnit);
    [PreserveSig] int FindAttribute(int attr, object val, int backward, out IUIAutomationTextRange found);
    [PreserveSig] int FindText([MarshalAs(UnmanagedType.BStr)] string text, int backward, int ignoreCase, out IUIAutomationTextRange found);
    [PreserveSig] int GetAttributeValue(int attr, out object value);
    [PreserveSig] int GetBoundingRectangles([MarshalAs(UnmanagedType.SafeArray, SafeArraySubType = VarEnum.VT_R8)] out double[] boundingRects);
}

public static class UiaCaretProbe
{
    const int UIA_TextPatternId = 10014;
    const int UIA_TextPattern2Id = 10024;
    const int TreeScope_Descendants = 4;
    const int MaxDescendantCandidates = 300;
    const int OBJID_CARET = -8;
    static bool dpiAwarenessInitialized = false;

    [DllImport("user32.dll")]
    static extern bool SetProcessDpiAwarenessContext(IntPtr dpiContext);

    [DllImport("user32.dll")]
    static extern IntPtr GetForegroundWindow();

    [DllImport("user32.dll")]
    static extern bool GetGUIThreadInfo(uint idThread, ref GUITHREADINFO guiThreadInfo);

    [DllImport("oleacc.dll")]
    static extern int AccessibleObjectFromWindow(
        IntPtr hwnd,
        int objectId,
        ref Guid riid,
        [MarshalAs(UnmanagedType.Interface)] out IAccessible accessibleObject
    );

    public static void Initialize()
    {
        if (dpiAwarenessInitialized)
        {
            return;
        }

        dpiAwarenessInitialized = true;

        try
        {
            SetProcessDpiAwarenessContext(new IntPtr(-4));
        }
        catch
        {
        }
    }

    public static string Run()
    {
        Initialize();

        try
        {
            var automation = (IUIAutomation)new CUIAutomation();

            IUIAutomationElement element;
            int hr = automation.GetFocusedElement(out element);
            if (Failed(hr) || element == null)
            {
                return Failure("focused-element:" + HResult(hr));
            }

            string result = TryTextPattern2(element);
            if (result != null)
            {
                return result;
            }

            result = TryDescendants(automation, element, TryTextPattern2);
            if (result != null)
            {
                return result;
            }

            result = TryMsaaCaret();
            if (result != null)
            {
                return result;
            }

            result = TryTextPattern(element);
            if (result != null)
            {
                return result;
            }

            result = TryDescendants(automation, element, TryTextPattern);
            if (result != null)
            {
                return result;
            }

            return Failure("no-text-pattern");
        }
        catch (Exception ex)
        {
            return Failure(ex.GetType().Name + ":" + ex.Message);
        }
    }

    static string TryDescendants(
        IUIAutomation automation,
        IUIAutomationElement element,
        Func<IUIAutomationElement, string> probeElement
    )
    {
        IUIAutomationCondition trueCondition;
        int hr = automation.CreateTrueCondition(out trueCondition);
        if (Failed(hr) || trueCondition == null)
        {
            return null;
        }

        IUIAutomationElementArray descendants;
        hr = element.FindAll(TreeScope_Descendants, trueCondition, out descendants);
        if (Failed(hr) || descendants == null)
        {
            return null;
        }

        int length;
        hr = descendants.get_Length(out length);
        if (Failed(hr) || length <= 0)
        {
            return null;
        }

        int limit = Math.Min(length, MaxDescendantCandidates);
        for (int i = 0; i < limit; i++)
        {
            IUIAutomationElement candidate;
            hr = descendants.GetElement(i, out candidate);
            if (Failed(hr) || candidate == null)
            {
                continue;
            }

            string result = probeElement(candidate);
            if (result != null)
            {
                return result;
            }
        }

        return null;
    }

    static string TryMsaaCaret()
    {
        IntPtr hwndFocus = GetFocusedHwnd();
        IntPtr hwndForeground = GetForegroundWindow();

        string focusResult = TryMsaaCaretFromWindow(hwndFocus);
        if (focusResult != null)
        {
            return focusResult;
        }

        if (hwndForeground != hwndFocus)
        {
            return TryMsaaCaretFromWindow(hwndForeground);
        }

        return null;
    }

    static IntPtr GetFocusedHwnd()
    {
        GUITHREADINFO gui = new GUITHREADINFO();
        gui.cbSize = Marshal.SizeOf(typeof(GUITHREADINFO));

        if (!GetGUIThreadInfo(0, ref gui))
        {
            return IntPtr.Zero;
        }

        if (gui.hwndFocus != IntPtr.Zero)
        {
            return gui.hwndFocus;
        }

        return gui.hwndActive;
    }

    static string TryMsaaCaretFromWindow(IntPtr hwnd)
    {
        if (hwnd == IntPtr.Zero)
        {
            return null;
        }

        Guid iid = new Guid("618736e0-3c3d-11cf-810c-00aa00389b71");
        IAccessible accessible;
        int hr = AccessibleObjectFromWindow(hwnd, OBJID_CARET, ref iid, out accessible);
        if (Failed(hr) || accessible == null)
        {
            return null;
        }

        try
        {
            int x;
            int y;
            int width;
            int height;
            accessible.accLocation(out x, out y, out width, out height, 0);

            if (!IsUsableRect(x, y, width, height))
            {
                return null;
            }

            return RectJson(x, y, width, height, "msaa-caret", null);
        }
        catch
        {
            return null;
        }
    }

    static string TryTextPattern2(IUIAutomationElement element)
    {
        Guid iid = typeof(IUIAutomationTextPattern2).GUID;
        object patternObject;
        int hr = element.GetCurrentPatternAs(UIA_TextPattern2Id, ref iid, out patternObject);
        if (Failed(hr) || patternObject == null)
        {
            return null;
        }

        var pattern = patternObject as IUIAutomationTextPattern2;
        if (pattern == null)
        {
            return null;
        }

        int isActive;
        IUIAutomationTextRange range;
        hr = pattern.GetCaretRange(out isActive, out range);
        if (Failed(hr) || range == null)
        {
            return null;
        }

        return RectResult(range, "uia-textpattern2", isActive != 0);
    }

    static string TryTextPattern(IUIAutomationElement element)
    {
        Guid iid = typeof(IUIAutomationTextPattern).GUID;
        object patternObject;
        int hr = element.GetCurrentPatternAs(UIA_TextPatternId, ref iid, out patternObject);
        if (Failed(hr) || patternObject == null)
        {
            return null;
        }

        var pattern = patternObject as IUIAutomationTextPattern;
        if (pattern == null)
        {
            return null;
        }

        IUIAutomationTextRangeArray ranges;
        hr = pattern.GetSelection(out ranges);
        if (Failed(hr) || ranges == null)
        {
            return null;
        }

        int length;
        hr = ranges.get_Length(out length);
        if (Failed(hr) || length <= 0)
        {
            return null;
        }

        IUIAutomationTextRange range;
        hr = ranges.GetElement(0, out range);
        if (Failed(hr) || range == null)
        {
            return null;
        }

        return RectResult(range, "uia-textpattern", null);
    }

    static string RectResult(IUIAutomationTextRange range, string source, bool? isActive)
    {
        double[] rects;
        int hr = range.GetBoundingRectangles(out rects);
        if (Failed(hr) || rects == null || rects.Length < 4)
        {
            return null;
        }

        for (int i = 0; i + 3 < rects.Length; i += 4)
        {
            double x = rects[i];
            double y = rects[i + 1];
            double width = rects[i + 2];
            double height = rects[i + 3];

            if (!IsUsableRect(x, y, width, height))
            {
                continue;
            }

            return RectJson(x, y, width, height, source, isActive);
        }

        return null;
    }

    static string RectJson(double x, double y, double width, double height, string source, bool? isActive)
    {
        string json = "{\"ok\":true"
            + ",\"x\":" + Number(x)
            + ",\"y\":" + Number(y)
            + ",\"width\":" + Number(width <= 0 ? 1 : width)
            + ",\"height\":" + Number(height <= 0 ? 1 : height)
            + ",\"source\":\"" + source + "\"";

        if (isActive.HasValue)
        {
            json += ",\"isActive\":" + (isActive.Value ? "true" : "false");
        }

        return json + "}";
    }

    static bool IsUsableRect(double x, double y, double width, double height)
    {
        return IsFinite(x)
            && IsFinite(y)
            && IsFinite(width)
            && IsFinite(height)
            && width >= 0
            && height >= 0
            && (width > 0 || height > 0)
            && !(x == 0 && y == 0 && height == 0);
    }

    static bool IsFinite(double value)
    {
        return !double.IsNaN(value) && !double.IsInfinity(value);
    }

    static bool Failed(int hr)
    {
        return hr < 0;
    }

    static string Failure(string reason)
    {
        return "{\"ok\":false,\"reason\":\"" + Escape(reason) + "\"}";
    }

    static string HResult(int hr)
    {
        return "0x" + hr.ToString("X8", CultureInfo.InvariantCulture);
    }

    static string Number(double value)
    {
        return value.ToString("R", CultureInfo.InvariantCulture);
    }

    static string Escape(string value)
    {
        if (value == null)
        {
            return "";
        }

        return value.Replace("\\", "\\\\").Replace("\"", "\\\"").Replace("\r", "\\r").Replace("\n", "\\n");
    }
}
'@

$accessibilityAssembly = [System.Reflection.Assembly]::LoadWithPartialName('Accessibility')
Add-Type -TypeDefinition $src -ReferencedAssemblies $accessibilityAssembly.Location
[UiaCaretProbe]::Initialize()

while (($line = [Console]::In.ReadLine()) -ne $null) {
  if ($line -eq '__exit__') {
    break
  }

  try {
    [Console]::Out.WriteLine([UiaCaretProbe]::Run())
    [Console]::Out.Flush()
  } catch {
    [Console]::Out.WriteLine("{""ok"":false,""reason"":""powershell-error""}")
    [Console]::Out.Flush()
  }
}
`

const RECT = koffi.struct('RECT', {
  left: 'int32',
  top: 'int32',
  right: 'int32',
  bottom: 'int32'
})

const POINT = koffi.struct('POINT', {
  x: 'int32',
  y: 'int32'
})

const GUITHREADINFO = koffi.struct('GUITHREADINFO', {
  cbSize: 'uint32',
  flags: 'uint32',
  hwndActive: 'void *',
  hwndFocus: 'void *',
  hwndCapture: 'void *',
  hwndMenuOwner: 'void *',
  hwndMoveSize: 'void *',
  hwndCaret: 'void *',
  rcCaret: RECT
})

const user32 = isWindows ? koffi.load('user32.dll') : null
const kernel32 = isWindows ? koffi.load('kernel32.dll') : null

const GetGUIThreadInfo = user32?.func('int __stdcall GetGUIThreadInfo(uint32 idThread, _Inout_ GUITHREADINFO *pgui)')
const ClientToScreen = user32?.func('int __stdcall ClientToScreen(void *hWnd, _Inout_ POINT *lpPoint)')
const GetLastError = kernel32?.func('uint32 __stdcall GetLastError()')

export async function getGlobalCaretRect(): Promise<CaretRect | null> {
  const uiaRect = await getUiaCaretRect()

  if (uiaRect) {
    return uiaRect
  }

  return getWin32CaretRect()
}

export function warmUpCaretHelper(): void {
  if (!isWindows) {
    return
  }

  void requestCaretFromHelper(5000).catch(() => undefined)
}

export function cleanupCaretHelper(): void {
  const helper = caretHelper
  caretHelper = null
  caretHelperStdoutBuffer = ''

  for (const pendingRequest of pendingCaretRequests) {
    clearTimeout(pendingRequest.timer)
    pendingRequest.reject(new Error('Caret helper stopped'))
  }
  pendingCaretRequests = []

  if (!helper || helper.killed) {
    return
  }

  try {
    helper.stdin.write('__exit__\n')
    helper.kill()
  } catch {
    helper.kill()
  }
}

async function getUiaCaretRect(timeoutMs = 1200): Promise<CaretRect | null> {
  if (!isWindows) {
    return null
  }

  try {
    const stdout = await requestCaretFromHelper(timeoutMs)
    const line = stdout
      .trim()
      .split(/\r?\n/)
      .map(item => item.trim())
      .filter(Boolean)
      .at(-1)

    if (!line) {
      return null
    }

    const payload = JSON.parse(line) as UiaCaretPayload

    if (!payload.ok) {
      return null
    }

    return {
      x: payload.x,
      y: payload.y,
      width: payload.width,
      height: payload.height,
      source: payload.source,
      isActive: payload.isActive
    }
  } catch {
    return null
  }
}

function getWin32CaretRect(): CaretRect | null {
  if (!isWindows || !GetGUIThreadInfo || !ClientToScreen) {
    return null
  }

  try {
    const gui = {
      cbSize: koffi.sizeof(GUITHREADINFO),
      flags: 0,
      hwndActive: null,
      hwndFocus: null,
      hwndCapture: null,
      hwndMenuOwner: null,
      hwndMoveSize: null,
      hwndCaret: null,
      rcCaret: { left: 0, top: 0, right: 0, bottom: 0 }
    }

    if (!GetGUIThreadInfo(0, gui)) {
      throw new Error(`GetGUIThreadInfo failed: ${getLastError()}`)
    }

    if (!gui.hwndCaret) {
      return null
    }

    const pt = {
      x: gui.rcCaret.left,
      y: gui.rcCaret.top
    }

    if (!ClientToScreen(gui.hwndCaret, pt)) {
      throw new Error(`ClientToScreen failed: ${getLastError()}`)
    }

    return {
      x: pt.x,
      y: pt.y,
      width: gui.rcCaret.right - gui.rcCaret.left,
      height: gui.rcCaret.bottom - gui.rcCaret.top,
      source: 'win32',
      hwndCaret: gui.hwndCaret
    }
  } catch {
    return null
  }
}

function requestCaretFromHelper(timeoutMs: number): Promise<string> {
  return new Promise((resolve, reject) => {
    let helper: ChildProcessWithoutNullStreams

    try {
      helper = ensureCaretHelper()
    } catch (error) {
      reject(error instanceof Error ? error : new Error(String(error)))
      return
    }

    const pendingRequest: PendingCaretRequest = {
      resolve,
      reject,
      timer: setTimeout(() => {
        resetCaretHelper(new Error(`Caret helper timed out after ${timeoutMs}ms`))
      }, timeoutMs)
    }

    pendingCaretRequests.push(pendingRequest)
    helper.stdin.write('caret\n', error => {
      if (!error) {
        return
      }

      removePendingCaretRequest(pendingRequest)
      reject(error)
    })
  })
}

function ensureCaretHelper(): ChildProcessWithoutNullStreams {
  if (caretHelper && !caretHelper.killed) {
    return caretHelper
  }

  writeFileSync(CARET_HELPER_SCRIPT_PATH, UIA_CARET_SCRIPT, 'utf8')

  caretHelperStdoutBuffer = ''
  caretHelper = spawn(
    'powershell.exe',
    ['-NoProfile', '-Sta', '-NonInteractive', '-ExecutionPolicy', 'Bypass', '-File', CARET_HELPER_SCRIPT_PATH],
    {
      windowsHide: true,
      stdio: ['pipe', 'pipe', 'pipe']
    }
  )

  caretHelper.stdout.setEncoding('utf8')
  caretHelper.stderr.setEncoding('utf8')
  caretHelper.stdout.on('data', handleCaretHelperStdout)
  caretHelper.stderr.on('data', () => undefined)
  caretHelper.on('error', error => {
    resetCaretHelper(error)
  })
  caretHelper.on('close', code => {
    resetCaretHelper(new Error(`Caret helper exited with code ${code}`))
  })

  return caretHelper
}

function handleCaretHelperStdout(chunk: string): void {
  caretHelperStdoutBuffer += chunk

  while (true) {
    const lineEndIndex = caretHelperStdoutBuffer.search(/\r?\n/)

    if (lineEndIndex === -1) {
      return
    }

    const line = caretHelperStdoutBuffer.slice(0, lineEndIndex).trim()
    caretHelperStdoutBuffer = caretHelperStdoutBuffer.slice(
      caretHelperStdoutBuffer[lineEndIndex] === '\r' ? lineEndIndex + 2 : lineEndIndex + 1
    )

    if (!line.startsWith('{')) {
      continue
    }

    const pendingRequest = pendingCaretRequests.shift()
    if (!pendingRequest) {
      continue
    }

    clearTimeout(pendingRequest.timer)
    pendingRequest.resolve(line)
  }
}

function resetCaretHelper(error: Error): void {
  const helper = caretHelper
  caretHelper = null
  caretHelperStdoutBuffer = ''

  const pendingRequests = pendingCaretRequests
  pendingCaretRequests = []

  for (const pendingRequest of pendingRequests) {
    clearTimeout(pendingRequest.timer)
    pendingRequest.reject(error)
  }

  if (helper && !helper.killed) {
    helper.kill()
  }
}

function removePendingCaretRequest(pendingRequest: PendingCaretRequest): void {
  const index = pendingCaretRequests.indexOf(pendingRequest)

  if (index === -1) {
    return
  }

  clearTimeout(pendingRequest.timer)
  pendingCaretRequests.splice(index, 1)
}

function getLastError(): number {
  return GetLastError ? GetLastError() : 0
}
