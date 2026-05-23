import { Input } from '@arco-design/web-react'
import { QRCodeSVG } from 'qrcode.react'

export default function QrCode({ value, setValue }) {
  return (
    <div className="py-2 w-1/2 mx-auto">
      <Input value={value} onChange={setValue} />

      <div className="my-4">
        <QRCodeSVG value={value} size={200} />
      </div>
    </div>
  )
}
