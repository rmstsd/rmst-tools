import { Divider } from '@douyinfe/semi-ui'
import KillPortTool from './KillPortTool'
import ExecCommand from './ExecCommand'

export default function SmallTool(): React.JSX.Element {
  return (
    <div className="small-tool">
      <KillPortTool />
      <Divider margin={12} />
      <ExecCommand />
    </div>
  )
}
