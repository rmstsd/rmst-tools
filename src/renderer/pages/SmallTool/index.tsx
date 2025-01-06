import { Divider } from '@arco-design/web-react'

import KillPortTool from './KillPortTool'
import OpenWindow from './OpenWindow'
import GitSetting from './GitSetting'

export default function SmallTool() {
  return (
    <div className="p-[40px]">
      <KillPortTool />

      <Divider />

      <OpenWindow />

      <Divider />

      <GitSetting />
    </div>
  )
}
