import { Input } from '@douyinfe/semi-ui'
import { QRCodeSVG } from 'qrcode.react'

interface Props {
  value: string
  setValue: (value: string) => void
}

export default function QrCode({ value, setValue }: Props): React.JSX.Element {
  return (
    <div className="qrcode-page">
      <Input value={value} onChange={setValue} />
      <div className="qrcode-preview">
        <QRCodeSVG value={value || ' '} size={220} />
      </div>
    </div>
  )
}
