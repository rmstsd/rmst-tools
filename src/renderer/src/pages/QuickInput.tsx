import { useCallback, useEffect, useRef, useState } from 'react'
import { Button } from '@douyinfe/semi-ui'
import { IconClose } from '@douyinfe/semi-icons'
import { invoke } from '../api'
import { useElementResize } from '../hooks'
import type { SettingData } from '../types'

export default function QuickInput(): React.JSX.Element {
  const rootRef = useRef<HTMLDivElement>(null)
  const [notes, setNotes] = useState<string[]>([])

  const updateData = async () => {
    const data = await invoke<SettingData>('Get_Setting')
    setNotes(data.notes ?? [])
  }

  useEffect(() => {
    document.addEventListener('visibilitychange', () => {
      if (document.visibilityState === 'visible') {
        updateData()
      }
    })
  }, [])

  useElementResize(
    rootRef,
    useCallback(size => {
      void invoke('Set_Window_Size', { width: size.width, height: size.height })
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
          onClick={() => void invoke('Hide_Window')}
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
            size="small"
            onClick={() => void invoke('Copy_And_Paste', { content: item })}
          >
            {item}
          </Button>
        ))}
      </div>
    </div>
  )
}
