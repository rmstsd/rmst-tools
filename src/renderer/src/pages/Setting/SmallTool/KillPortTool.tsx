import { useEffect, useRef, useState } from 'react'
import { Button, InputNumber, Toast, Typography } from '@douyinfe/semi-ui'
import { invoke, notifyError } from '../../../api'

const { Title } = Typography

export default function KillPortTool(): React.JSX.Element {
  const ref = useRef<HTMLInputElement>(null)
  const [port, setPort] = useState<number | undefined>()
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    ref.current?.focus()
  }, [])

  const kill = async (): Promise<void> => {
    if (!port) {
      Toast.warning('请输入端口号')
      return
    }

    setLoading(true)
    try {
      await invoke('Kill_Port', { port })
      Toast.success('成功')
    } catch (error) {
      Toast.error(notifyError(error))
    } finally {
      setLoading(false)
    }
  }

  return (
    <section className="tool-section">
      <div className="section-title">
        <Title heading={5}>端口清理</Title>
      </div>
      <div className="inline-row compact">
        <InputNumber
          ref={ref}
          value={port}
          min={1}
          max={65535}
          placeholder="端口号"
          style={{ width: 120, flexGrow: 0 }}
          onNumberChange={value => setPort(typeof value === 'number' ? value : undefined)}
          onEnterPress={() => void kill()}
        />
        <Button type="primary" loading={loading} onClick={() => void kill()}>
          kill
        </Button>
      </div>
    </section>
  )
}
