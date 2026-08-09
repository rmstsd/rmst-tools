import { useEffect, useState } from 'react'
import { Button, Input } from '@douyinfe/semi-ui'
import { IconClose, IconLink, IconPlayCircle, IconRefresh } from '@douyinfe/semi-icons'
import WebViewer from '@rerun-io/web-viewer-react'
import type { RecordingOpenEvent } from '@rerun-io/web-viewer'
import './RerunView.less'

const SAMPLE_RECORDING_URL = 'rerun+http://127.0.0.1:11000/proxy'

type ViewerStatus = 'idle' | 'connecting' | 'connected'

export function RerunView(): React.JSX.Element {
  const [source, setSource] = useState('')
  const [activeSource, setActiveSource] = useState('')
  const [status, setStatus] = useState<ViewerStatus>('idle')
  const [recording, setRecording] = useState<RecordingOpenEvent | null>(null)

  useEffect(() => {
    if (!activeSource) {
      setStatus('idle')
      setRecording(null)
      return
    }

    setStatus('connecting')
    setRecording(null)
  }, [activeSource])

  const connect = (): void => {
    const nextSource = source.trim()
    if (!nextSource) {
      setActiveSource('')
      return
    }
    setActiveSource(nextSource)
  }

  const disconnect = (): void => {
    setActiveSource('')
  }

  const openSample = (): void => {
    setSource(SAMPLE_RECORDING_URL)
    setActiveSource(SAMPLE_RECORDING_URL)
  }

  const statusLabel = status === 'connected' ? '已连接' : status === 'connecting' ? '连接中' : '未连接'

  return (
    <main className="rerun-view">
      <header className="rerun-toolbar no-drag">
        <div className="rerun-brand">
          <span className="rerun-brand-mark" aria-hidden="true">
            R
          </span>
          <div>
            <strong>Rerun Viewer</strong>
            <span>具身智能数据观测</span>
          </div>
        </div>

        <div className="rerun-connection">
          <Input
            className="rerun-source-input"
            value={source}
            placeholder="输入 .rrd 文件地址或 rerun+http 地址"
            prefix={<IconLink />}
            onChange={setSource}
            onEnterPress={connect}
            showClear
          />
          <Button theme="solid" type="primary" icon={<IconPlayCircle />} onClick={connect} disabled={!source.trim()}>
            连接
          </Button>
          <Button theme="borderless" type="tertiary" icon={<IconClose />} onClick={disconnect} disabled={!activeSource} />
          <Button theme="borderless" type="tertiary" icon={<IconRefresh />} onClick={openSample} />
        </div>

        <div className={`rerun-status is-${status}`}>
          <span className="rerun-status-dot" aria-hidden="true" />
          <span>{statusLabel}</span>
          {recording?.version && <small>SDK {recording.version}</small>}
        </div>
      </header>

      <section className="rerun-canvas">
        <WebViewer
          rrd="rerun+http://127.0.0.1:11000/proxy"
          width="100%"
          height="100%"
          theme="light"
          hide_welcome_screen
          onRecordingOpen={event => {
            console.log('event', event)
            setRecording(event)
            setStatus('connected')
          }}
        />
      </section>
    </main>
  )
}
