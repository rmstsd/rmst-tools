import { useState } from 'react'
import { Button, Toast } from '@douyinfe/semi-ui'
import { invoke, notifyError } from '../../api'

export default function Updater(): React.JSX.Element {
  const [checking, setChecking] = useState(false)

  const checkUpdate = async (): Promise<void> => {
    setChecking(true)
    try {
      await invoke('checkUpdate')
    } catch (error) {
      Toast.error(notifyError(error))
    } finally {
      setChecking(false)
    }
  }

  return (
    <Button onClick={() => void checkUpdate()} loading={checking}>
      检查更新
    </Button>
  )
}
