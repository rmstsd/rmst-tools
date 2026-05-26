import { useCallback, useEffect, useState } from 'react'
import { Button, Input, Toast, Typography } from '@douyinfe/semi-ui'
import { IconDelete, IconExternalOpen } from '@douyinfe/semi-icons'
import { invoke, notifyError } from '../../../api'

const { Title, Text } = Typography

export default function OpenWindowTool(): React.JSX.Element {
  const [url, setUrl] = useState('')
  const [history, setHistory] = useState<string[]>([])

  const loadHistory = useCallback(async () => {
    setHistory(await invoke<string[]>('Get_History_Opened_Urls'))
  }, [])

  useEffect(() => {
    const initialTimer = window.setTimeout(() => {
      void loadHistory()
    }, 0)
    const timer = window.setInterval(() => void loadHistory(), 2000)
    return () => {
      window.clearTimeout(initialTimer)
      window.clearInterval(timer)
    }
  }, [loadHistory])

  const openUrl = async (targetUrl: string): Promise<void> => {
    if (!targetUrl) {
      Toast.warning('请输入 URL')
      return
    }

    try {
      await invoke('Open_Win', { url: targetUrl })
      setUrl('')
      await loadHistory()
    } catch (error) {
      Toast.error(notifyError(error))
    }
  }

  return (
    <section className="tool-section">
      <div className="section-title">
        <Title heading={5}>打开网页窗口</Title>
      </div>
      <div className="inline-row">
        <Input value={url} placeholder="https://www.example.com" onChange={setUrl} onEnterPress={() => void openUrl(url)} />
        <Button type="primary" icon={<IconExternalOpen />} onClick={() => void openUrl(url)}>
          打开
        </Button>
        <Button
          type="danger"
          theme="borderless"
          icon={<IconDelete />}
          onClick={async () => {
            await invoke('Clear_History_Opened_Urls')
            await loadHistory()
          }}
        >
          清空历史
        </Button>
      </div>
      {history.length > 0 && (
        <div className="history-list">
          {history.map(item => (
            <button type="button" className="history-item" key={item} onClick={() => void openUrl(item)}>
              <IconExternalOpen />
              <Text ellipsis>{item}</Text>
            </button>
          ))}
        </div>
      )}
    </section>
  )
}
