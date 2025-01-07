import { Tabs } from '@arco-design/web-react'
import SettingConfig from './SettingConfig'
import SmallTool from './SmallTool'

export default function Setting() {
  return (
    <Tabs tabPosition="left" destroyOnHide className="setting-page-root h-screen">
      <Tabs.TabPane key="1" title="设置" className="h-screen overflow-auto">
        <SettingConfig />
      </Tabs.TabPane>
      <Tabs.TabPane key="2" title="工具" className="h-screen overflow-auto">
        <SmallTool />
      </Tabs.TabPane>
    </Tabs>
  )
}
