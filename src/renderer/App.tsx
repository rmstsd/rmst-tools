import { Button, Popover, Space } from '@arco-design/web-react'
import { Navigate, RouteObject, useNavigate, useRoutes } from 'react-router-dom'

import OpenDir from './pages/OpenDir'
import Setting from './pages/Setting'
import QuickInput from './pages/QuickInput'

import rmstBrowser from './rmstBrowser'
import KillPortView from './pages/KillPort'

const routes: RouteObject[] = [
  { path: '/OpenDir', element: <OpenDir /> },
  { path: '/Setting', element: <Setting /> },
  { path: '/QuickInput', element: <QuickInput /> },
  { path: '/KillPort', element: <KillPortView /> },
  { path: '*', element: <Navigate to="/OpenDir" /> }
]

function App() {
  const navigate = useNavigate()
  const element = useRoutes(routes)

  return (
    <>
      <Popover
        style={{ padding: 0 }}
        position="bl"
        triggerProps={{ showArrow: false, popupAlign: { bottom: 0 } }}
        className="tool-bar-popover"
        content={
          <Space className="tool-bar">
            {routes.map(item => (
              <Button key={item.path} type="primary" onClick={() => navigate(item.path)}>
                {item.path}
              </Button>
            ))}
          </Space>
        }
      >
        <div style={{ height: 5, position: 'fixed', left: 0, right: 0, zIndex: 5 }}></div>
      </Popover>

      {element}
    </>
  )
}

export default App
