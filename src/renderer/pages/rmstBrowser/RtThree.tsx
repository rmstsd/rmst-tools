import { Button } from '@arco-design/web-react'
import { IconClose, IconCopy, IconMinus } from '@arco-design/web-react/icon'
import { useEffect, useState } from 'react'

const RtThree = () => {
  const [isMaxSize, setIsMaxSize] = useState(false)

  useEffect(() => {
    window.electron.ipcRenderer.on('browser-size', (evt, isMaxSize) => {
      setIsMaxSize(isMaxSize)
    })
  }, [])

  return (
    <div style={{ flexShrink: 0, display: 'flex' }}>
      <Button
        type="text"
        size="large"
        icon={<IconMinus />}
        onClick={() => window.electron.ipcRenderer.invoke('minimize')}
      />
      <Button
        type="text"
        size="large"
        icon={
          isMaxSize ? (
            <IconCopy />
          ) : (
            <svg width="30" height="30" viewBox="0 0 48 48" fill="none">
              <rect x={13} y={20} width={20} height={18} stroke="currentColor" strokeWidth={2}></rect>
            </svg>
          )
        }
        onClick={() => window.electron.ipcRenderer.invoke(isMaxSize ? 'unmaximize' : 'maximize')}
      />
      <Button
        type="text"
        size="large"
        className="browser-close"
        icon={<IconClose />}
        // onClick={() => window.electron.ipcRenderer.invoke('close')}
      />
    </div>
  )
}

export default RtThree
