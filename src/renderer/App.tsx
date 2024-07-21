import { Button, Popover, Space } from '@arco-design/web-react'
import { useNavigate } from 'react-router-dom'

import OpenDir from './components/OpenDir'
import Setting from './components/Setting'
import QuickInput from './components/QuickInput'

import rmstBrowser from './rmstBrowser'
import KillPortView from './components/KillPort'

const map = {
  OpenDir,
  Setting,
  QuickInput,
  rmstBrowser,
  KillPort: KillPortView
}

const keys = Object.keys(map)

function App() {
  const navigate = useNavigate()

  const query = Object.fromEntries(new URLSearchParams(window.location.search))

  const Component = map[query.ui]

  return (
    <>
      <Popover
        style={{ padding: 0 }}
        position="bl"
        triggerProps={{ showArrow: false, popupAlign: { bottom: 0 } }}
        className="tool-bar-popover"
        content={
          <Space className="tool-bar">
            {keys.map(item => (
              <Button key={item} type="primary" onClick={() => navigate(`?ui=${item}`)}>
                {item}
              </Button>
            ))}
          </Space>
        }
      >
        <div style={{ height: 5, position: 'fixed', left: 0, right: 0, zIndex: 5 }}></div>
      </Popover>

      {Component ? (
        <Component />
      ) : (
        <>
          未匹配到组件
          <a href="https://www.douyu.com">aa</a>
        </>
      )}
    </>
  )
}

export default App
