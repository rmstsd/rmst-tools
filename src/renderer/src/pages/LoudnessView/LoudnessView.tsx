import { useEffect, useState } from 'react'
import { IconMuteStroked, IconVolume2Stroked } from '@douyinfe/semi-icons'

import './LoudnessView.less'
import { invoke } from '@renderer/api'

export function LoudnessView() {
  const [volume, setVolume] = useState(0)
  const [muted, setMuted] = useState(false)

  useEffect(() => {
    const unsubscribe = window.electron.ipcRenderer.on('volume-change', (_event, state) => {
      setVolume(Math.round(state.volume))
      setMuted(state.muted)
    })
    return unsubscribe
  }, [])

  const safeVolume = Math.min(Math.max(volume, 0), 100)

  return (
    <main className="loudness-view" onClick={() => invoke('Hide_Loudness_Window')}>
      <div className="loudness-value">
        <span>{safeVolume}</span>
      </div>
      <div className="loudness-meter" aria-hidden="true">
        <div className="loudness-meter-fill" style={{ height: `${safeVolume}%` }} />
      </div>
      {muted ? <IconMuteStroked className="loudness-icon" /> : <IconVolume2Stroked className="loudness-icon" />}
    </main>
  )
}
