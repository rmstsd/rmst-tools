import { Input } from '@douyinfe/semi-ui'
import { QRCodeSVG } from 'qrcode.react'
import { useEffect, useState } from 'react'

export default function QrCode() {
  const [value, setValue] = useState('rmst')

  useEffect(
    () =>
      window.api.onShowQrCode(value => {
        setValue(value)
      }),
    []
  )

  return (
    <div className="qrcode-page">
      <Input value={value} onChange={setValue} />
      <div className="qrcode-preview">
        <QRCodeSVG value={value || ' '} size={220} />
      </div>
    </div>
  )
}
