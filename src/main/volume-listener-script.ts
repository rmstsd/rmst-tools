export const VOLUME_LISTENER_SCRIPT = String.raw`
$ErrorActionPreference = 'Stop'

$source = @'
using System;
using System.Globalization;
using System.Runtime.InteropServices;

enum EDataFlow { eRender, eCapture, eAll }
enum ERole { eConsole, eMultimedia, eCommunications }

[ComImport, Guid("BCDE0395-E52F-467C-8E3D-C4579291692E")]
class MMDeviceEnumerator
{
}

[ComImport, Guid("A95664D2-9614-4F35-A746-DE8DB63617E6"), InterfaceType(ComInterfaceType.InterfaceIsIUnknown)]
interface IMMDeviceEnumerator
{
    [PreserveSig] int EnumAudioEndpoints(EDataFlow dataFlow, int stateMask, out IntPtr devices);
    [PreserveSig] int GetDefaultAudioEndpoint(EDataFlow dataFlow, ERole role, out IMMDevice device);
}

[ComImport, Guid("D666063F-1587-4E43-81F1-B948E807363F"), InterfaceType(ComInterfaceType.InterfaceIsIUnknown)]
interface IMMDevice
{
    [PreserveSig] int Activate(ref Guid iid, int clsCtx, IntPtr activationParams, [MarshalAs(UnmanagedType.IUnknown)] out object instance);
}

[ComImport, Guid("657804FA-D6AD-4496-8A60-352752AF4F89"), InterfaceType(ComInterfaceType.InterfaceIsIUnknown)]
interface IAudioEndpointVolumeCallback
{
    [PreserveSig] int OnNotify(IntPtr notificationData);
}

[ComImport, Guid("5CDF2C82-841E-4546-9722-0CF74078229A"), InterfaceType(ComInterfaceType.InterfaceIsIUnknown)]
interface IAudioEndpointVolume
{
    [PreserveSig] int RegisterControlChangeNotify(IAudioEndpointVolumeCallback notify);
    [PreserveSig] int UnregisterControlChangeNotify(IAudioEndpointVolumeCallback notify);
    [PreserveSig] int GetChannelCount(out uint channelCount);
    [PreserveSig] int SetMasterVolumeLevel(float levelDb, Guid eventContext);
    [PreserveSig] int SetMasterVolumeLevelScalar(float level, Guid eventContext);
    [PreserveSig] int GetMasterVolumeLevel(out float levelDb);
    [PreserveSig] int GetMasterVolumeLevelScalar(out float level);
    [PreserveSig] int SetChannelVolumeLevel(uint channel, float levelDb, Guid eventContext);
    [PreserveSig] int SetChannelVolumeLevelScalar(uint channel, float level, Guid eventContext);
    [PreserveSig] int GetChannelVolumeLevel(uint channel, out float levelDb);
    [PreserveSig] int GetChannelVolumeLevelScalar(uint channel, out float level);
    [PreserveSig] int SetMute([MarshalAs(UnmanagedType.Bool)] bool muted, Guid eventContext);
    [PreserveSig] int GetMute([MarshalAs(UnmanagedType.Bool)] out bool muted);
    [PreserveSig] int GetVolumeStepInfo(out uint step, out uint stepCount);
    [PreserveSig] int VolumeStepUp(Guid eventContext);
    [PreserveSig] int VolumeStepDown(Guid eventContext);
    [PreserveSig] int QueryHardwareSupport(out uint hardwareSupportMask);
    [PreserveSig] int GetVolumeRange(out float minDb, out float maxDb, out float incrementDb);
}

[StructLayout(LayoutKind.Sequential)]
struct AudioVolumeNotificationData
{
    public Guid eventContext;
    [MarshalAs(UnmanagedType.Bool)] public bool muted;
    public float masterVolume;
    public uint channelCount;
}

[ComVisible(true)]
class EndpointVolumeCallback : IAudioEndpointVolumeCallback
{
    public int OnNotify(IntPtr notificationData)
    {
        try
        {
            var data = (AudioVolumeNotificationData)Marshal.PtrToStructure(notificationData, typeof(AudioVolumeNotificationData));
            var volume = Math.Round(Math.Max(0, Math.Min(100, data.masterVolume * 100)), 2);
            Console.WriteLine("{\"volume\":" + volume.ToString(CultureInfo.InvariantCulture) + ",\"muted\":" + (data.muted ? "true" : "false") + "}");
            Console.Out.Flush();
        }
        catch
        {
        }

        return 0;
    }
}

public static class VolumeListener
{
    const int CLSCTX_ALL = 23;

    public static void Run()
    {
        IMMDeviceEnumerator enumerator = null;
        IMMDevice device = null;
        IAudioEndpointVolume endpoint = null;
        var callback = new EndpointVolumeCallback();

        try
        {
            enumerator = (IMMDeviceEnumerator)new MMDeviceEnumerator();
            ThrowIfFailed(enumerator.GetDefaultAudioEndpoint(EDataFlow.eRender, ERole.eMultimedia, out device));

            var endpointId = typeof(IAudioEndpointVolume).GUID;
            object endpointObject;
            ThrowIfFailed(device.Activate(ref endpointId, CLSCTX_ALL, IntPtr.Zero, out endpointObject));
            endpoint = (IAudioEndpointVolume)endpointObject;
            ThrowIfFailed(endpoint.RegisterControlChangeNotify(callback));

            while (Console.ReadLine() != "__exit__")
            {
            }
        }
        finally
        {
            if (endpoint != null)
            {
                endpoint.UnregisterControlChangeNotify(callback);
                Marshal.ReleaseComObject(endpoint);
            }
            if (device != null)
            {
                Marshal.ReleaseComObject(device);
            }
            if (enumerator != null)
            {
                Marshal.ReleaseComObject(enumerator);
            }
        }
    }

    static void ThrowIfFailed(int hr)
    {
        if (hr < 0)
        {
            Marshal.ThrowExceptionForHR(hr);
        }
    }
}
'@

Add-Type -TypeDefinition $source
[VolumeListener]::Run()
`
