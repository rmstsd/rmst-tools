import { useEffect, useState } from 'react'
import { TabPane, Tabs } from '@douyinfe/semi-ui'
import SettingConfig from './SettingConfig'
import SmallTool from './SmallTool'
import QrCode from './QrCode'

export default function SettingPage(): React.JSX.Element {
  const [activeKey, setActiveKey] = useState(localStorage.getItem('activeKey') || 'setting')
  const [qrCodeValue, setQrCodeValue] = useState('rmst')

  useEffect(
    () =>
      window.api.onShowQrCode(value => {
        setActiveKey('qrcode')
        setQrCodeValue(value)
      }),
    []
  )

  return (
    <>
      {/* <div className="window-title-bar"></div> */}

      <Tabs
        tabPosition="left"
        keepDOM={false}
        activeKey={activeKey}
        onChange={key => {
          localStorage.setItem('activeKey', key)
          setActiveKey(key)
        }}
        className="setting-page"
      >
        <TabPane tab="设置" itemKey="setting">
          <SettingConfig />
        </TabPane>
        <TabPane tab="工具" itemKey="tools">
          <SmallTool />
        </TabPane>
        <TabPane tab="二维码" itemKey="qrcode">
          <QrCode value={qrCodeValue} setValue={setQrCodeValue} />
        </TabPane>
      </Tabs>
    </>
  )
}
