import { Divider } from '@douyinfe/semi-ui'
import KillPortTool from './KillPortTool'
import OpenWindowTool from './OpenWindowTool'
import ExecCommand from './ExecCommand'
import RemoveNodeModules from './RemoveNodeModules'

export default function SmallTool(): React.JSX.Element {
  return (
    <div className="small-tool">
      <KillPortTool />
      <Divider margin={12} />
      <OpenWindowTool />
      <Divider margin={12} />
      <ExecCommand />
      {/* <Divider margin={12} />
      <RemoveNodeModules /> */}
    </div>
  )
}
