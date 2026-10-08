import { useCallback, useEffect, useRef, useState } from 'react'
import { Button } from '@douyinfe/semi-ui'
import { IconClose } from '@douyinfe/semi-icons'
import { invoke } from '../api'
import { useElementResize } from '../hooks'
import type { SettingData } from '../types'
import './QuickInput.less'

export default function QuickInput(): React.JSX.Element {
  const rootRef = useRef<HTMLDivElement>(null)
  const [notes, setNotes] = useState<string[]>([])
  const [selectedIndex, setSelectedIndex] = useState(0)

  const updateData = async () => {
    const data = await invoke<SettingData>('Get_Setting')
    setNotes(data.notes ?? [])
  }

  useEffect(() => {
    updateData()

    const onVisibilityChange = (): void => {
      if (document.visibilityState === 'visible') {
        updateData()

        setSelectedIndex(0)
      }
    }
    document.addEventListener('visibilitychange', onVisibilityChange)
    return () => document.removeEventListener('visibilitychange', onVisibilityChange)
  }, [])

  useEffect(() => {
    setSelectedIndex(index => Math.min(index, Math.max(notes.length - 1, 0)))
  }, [notes.length])

  useEffect(() => {
    return window.api.onQuickInputKey(key => {
      if (key === 'UP ARROW') {
        setSelectedIndex(index => (notes.length ? (index - 1 + notes.length) % notes.length : 0))
      }
      if (key === 'DOWN ARROW') {
        setSelectedIndex(index => (notes.length ? (index + 1) % notes.length : 0))
      }
      if (key === 'RETURN' && notes[selectedIndex]) {
        invoke('Copy_And_Paste', { content: notes[selectedIndex] })
      }
    })
  }, [notes, selectedIndex])

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
          aria-label="关闭"
        />
      </div>

      <div className="quick-input-list">
        {notes.map((item, index) => (
          <Button
            key={`${item}-${index}`}
            className="quick-note"
            type={index === selectedIndex ? 'primary' : 'tertiary'}
            theme="outline"
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
