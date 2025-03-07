import { SettingEvent } from '@common/mainRenderer/ipcEvent'
import { createOnListener } from './ipc'

export const onShowQrCodeEvent = createOnListener<string>(SettingEvent.Show_Qr_Code)
