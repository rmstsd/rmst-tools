import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { ConfigProvider } from '@arco-design/web-react'
import '@arco-design/web-react/dist/css/arco.css'

import App from './App'
import './main.less'

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <BrowserRouter>
    <ConfigProvider componentConfig={{ Button: { type: 'primary' } }}>
      <App />
    </ConfigProvider>
  </BrowserRouter>
)

document.addEventListener('focusin', evt => {
  const target = evt.target as HTMLElement

  if (['TEXTAREA', 'INPUT'].includes(target.tagName)) {
    target.setAttribute('spellcheck', 'false')
  }
})
