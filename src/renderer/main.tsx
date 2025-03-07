import ReactDOM from 'react-dom/client'
import { HashRouter } from 'react-router-dom'
import { ConfigProvider } from '@arco-design/web-react'
import '@arco-design/web-react/dist/css/arco.css'

import App from './App'
import './main.less'

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <HashRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
    <ConfigProvider componentConfig={{ Button: { type: 'primary' } }}>
      <App />
    </ConfigProvider>
  </HashRouter>
)

document.addEventListener('focusin', evt => {
  const target = evt.target as HTMLElement

  if (['TEXTAREA', 'INPUT'].includes(target.tagName)) {
    target.setAttribute('spellcheck', 'false')
  }
})
