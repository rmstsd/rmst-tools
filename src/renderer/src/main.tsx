import '@douyinfe/semi-ui/react19-adapter'
import './assets/tailwind.css'
import './assets/main.less'

import { createRoot } from 'react-dom/client'
import App from './App'
import { installDevApiFallback } from './devApi'
import { invoke } from './api'

installDevApiFallback()

invoke<Record<string, string>>('Get_Package_Info').then(info => {
  document.title = info.name
})

createRoot(document.getElementById('root')!).render(<App />)

// 深度监听 body 下的元素变化，如果有输入元素，设置 spellcheck=false
const observer = new MutationObserver(mutations => {
  mutations.forEach(mutation => {
    mutation.addedNodes.forEach((node: HTMLInputElement) => {
      if (node.nodeType !== Node.ELEMENT_NODE) return

      // 当前节点本身是输入元素
      if (node.matches?.('input, textarea, [contenteditable="true"]')) {
        node.spellcheck = false
      }

      // 当前节点内部包含输入元素
      node.querySelectorAll?.('input, textarea, [contenteditable="true"]').forEach((el: HTMLInputElement) => {
        el.spellcheck = false
      })
    })
  })
})

observer.observe(document.body, {
  childList: true,
  subtree: true
})
