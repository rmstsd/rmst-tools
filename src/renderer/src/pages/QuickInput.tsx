import { useCallback, useEffect, useRef, useState } from 'react'
import { Button } from '@douyinfe/semi-ui'
import { IconClose } from '@douyinfe/semi-icons'
import { invoke } from '../api'
import { useElementResize, useWindowFocus } from '../hooks'
import type { SettingData } from '../types'

export default function QuickInput(): React.JSX.Element {
  const rootRef = useRef<HTMLDivElement>(null)
  const [notes, setNotes] = useState<string[]>([])

  const updateData = useCallback(async () => {
    const data = await invoke<SettingData>('getSetting')
    setNotes(data.notes ?? [])
  }, [])

  useEffect(() => {
    const timer = window.setTimeout(() => {
      void updateData()
    }, 0)

    return () => window.clearTimeout(timer)
  }, [updateData])

  useWindowFocus(
    useCallback(
      focused => {
        if (focused) {
          void updateData()
        }
      },
      [updateData]
    )
  )

  useElementResize(
    rootRef,
    useCallback(size => {
      void invoke('setWindowSize', { width: size.width, height: size.height })
    }, [])
  )

  return (
    <div ref={rootRef} className="quick-input">
      <div className="quick-input-title drag-region">
        <Button
          className="no-drag"
          size="small"
          type="tertiary"
          icon={<IconClose />}
          onClick={() => void invoke('hideWindow')}
          style={{ color: 'white' }}
        />
      </div>

      <div className="quick-input-list">
        {notes.map((item, index) => (
          <Button
            key={`${item}-${index}`}
            className="quick-note"
            theme="outline"
            type="tertiary"
            onClick={() => void invoke('CopyAndPaste', { content: item })}
          >
            {item}
          </Button>
        ))}
      </div>
    </div>
  )
}
