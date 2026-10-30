import SettingConfig from './SettingConfig'
import { WindowTitleBar } from '@renderer/components/WindowTitleBar'

export default function SettingPage(): React.JSX.Element {
  return (
    <>
      <WindowTitleBar />

      <SettingConfig />
    </>
  )
}
