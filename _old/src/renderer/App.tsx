import { Navigate, RouteObject, useNavigate, useRoutes } from 'react-router-dom'

import OpenDir from './pages/OpenDir'
import Setting from './pages/Setting'
import QuickInput from './pages/QuickInput'

const routes: RouteObject[] = [
  { path: '/Setting', element: <Setting /> },
  { path: '/OpenDir', element: <OpenDir /> },
  { path: '/QuickInput', element: <QuickInput /> },
  { path: '*', element: <Navigate to="/Setting" /> }
]

function App() {
  const navigate = useNavigate()
  const element = useRoutes(routes)

  return (
    <>
      {/* <Popover
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
      </Popover> */}

      {element}
    </>
  )
}

export default App
