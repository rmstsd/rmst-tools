import '@douyinfe/semi-ui/react19-adapter'
import './assets/main.less'

import { createRoot } from 'react-dom/client'
import App from './App'
import { installDevApiFallback } from './devApi'

installDevApiFallback()

createRoot(document.getElementById('root')!).render(<App />)
