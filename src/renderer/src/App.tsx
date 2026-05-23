import { useEffect, useState } from 'react'
import { LocaleProvider } from '@douyinfe/semi-ui'
import zhCN from '@douyinfe/semi-ui/lib/es/locale/source/zh_CN'
import OpenFolder from './pages/OpenFolder'
import QuickInput from './pages/QuickInput'
import SettingPage from './pages/Setting'

function App(): React.JSX.Element {
  const [route, setRoute] = useState(() => window.location.hash.slice(1) || 'setting')

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent): void => {
      if (event.key === 'Escape') {
        void window.api.invoke('hideWindow')
      }
    }

    document.addEventListener('keydown', onKeyDown)
    return () => document.removeEventListener('keydown', onKeyDown)
  }, [])

  useEffect(() => {
    const onHashChange = (): void => {
      setRoute(window.location.hash.slice(1) || 'setting')
    }

    window.addEventListener('hashchange', onHashChange)
    return () => window.removeEventListener('hashchange', onHashChange)
  }, [])

  return (
    <LocaleProvider locale={zhCN}>
      {route === 'openFolder' && <OpenFolder />}
      {route === 'quickInput' && <QuickInput />}
      {route === 'setting' && <SettingPage />}
    </LocaleProvider>
  )
}

export default App
