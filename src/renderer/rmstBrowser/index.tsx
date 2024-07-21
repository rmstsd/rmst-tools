import { Button, Divider, Input } from '@arco-design/web-react'
import clsx from 'clsx'
import { IconClose, IconCopy, IconLeft, IconMinus, IconPlus, IconRefresh, IconRight } from '@arco-design/web-react/icon'
import { useEffect, useState } from 'react'
import { WebviewTag } from 'electron'

import { useRmstStore } from '@renderer/store'

import './st.less'
import TabPanes from './TabPanes'
import ContextMenu from './ContextMenu'
import Webview from './Webview'
import RtThree from './RtThree'

export interface TabView {
  title: string
  url: string
  webview?: WebviewTag
  key?: number | string
}

let onlyKey = 100
function getNewKey() {
  return ++onlyKey
}
const rmstBrowser = () => {
  const rmstStore = useRmstStore()

  const [wd, setWd] = useState('rmst')

  const [canGoBack, setCanGoBack] = useState(false)
  const [canGoForward, setCanGoForward] = useState(false)

  const [addrUrl, setAddrUrl] = useState('')

  const [tabs, setTabs] = useState<TabView[]>([
    {
      key: onlyKey,
      title: 'aa',
      url: 'https://www.baidu.com/',
      webview: undefined
    }
  ])

  const [activeKey, setActiveKey] = useState(tabs[0].key)

  const itemTab = tabs.find(item => item.key === activeKey)
  useEffect(() => {
    window.electron.ipcRenderer.on('create-tab', (evt, url) => {
      createTab(url)
    })

    const curWv = itemTab.webview

    if (!curWv) {
      return
    }

    const domReady = () => {
      setCanGoBack(curWv.canGoBack())
      setCanGoForward(curWv.canGoForward())
    }
    curWv.addEventListener('dom-ready', domReady)

    curWv.addEventListener('load-commit', evt => {
      setCanGoBack(curWv.canGoBack())
      setCanGoForward(curWv.canGoForward())

      if (evt.isMainFrame) {
        setAddrUrl(evt.url)
      }
    })

    rmstStore.setCurrentWebview(curWv)

    return () => {
      curWv.removeEventListener('dom-ready', domReady)
    }
  }, [activeKey])

  const createTab = (url: string) => {
    const nk = getNewKey()
    const nTbs = tabs.concat({ title: 'bb', url, key: nk })
    setTabs(nTbs)
    setActiveKey(nk)
  }

  const handleDeleteTab = (index: number) => {
    const nTabs = tabs.toSpliced(index, 1)

    setTabs(nTabs)
    setActiveKey(nTabs[0].key)
  }

  return (
    <div className="rmst-browser">
      <header className="header-wrapper">
        {tabs.map((item, index) => (
          <div
            key={item.key}
            className={clsx('tab-item', activeKey === item.key && 'tab-item-active')}
            onClick={() => setActiveKey(item.key)}
            onDoubleClick={() => handleDeleteTab(index)}
          >
            <span className="tab-title">{item.title}</span>

            <div
              className="tab-close"
              onClick={evt => {
                evt.preventDefault()
                handleDeleteTab(index)
              }}
            >
              <IconClose />
            </div>
          </div>
        ))}

        <Button
          type="text"
          size="large"
          icon={<IconPlus />}
          onClick={() => createTab(`https://www.baidu.com`)}
          style={{ flexShrink: 0 }}
        />

        <div className="win-drag" style={{ flexGrow: 1 }}></div>
        <div className="win-drag" style={{ width: 50, flexShrink: 0 }}></div>

        <RtThree />
      </header>

      <div className="tool-row">
        <Button type="text" size="large" icon={<IconLeft />} disabled={!canGoBack} />
        <Button type="text" size="large" icon={<IconRight />} disabled={!canGoForward} />
        <Button type="text" size="large" icon={<IconRefresh />} onClick={() => rmstStore.currentWebview.reload()} />

        <Input value={addrUrl} onChange={setAddrUrl} onPressEnter={() => createTab(addrUrl)} />

        <Input type="text" style={{ flexBasis: '30%' }} value={wd} onChange={setWd} />
        <Button onClick={() => createTab(`https://www.baidu.com/s?wd=${wd}`)}>搜索</Button>
      </div>

      <Divider style={{ margin: 0 }} />

      <TabPanes
        activeKey={activeKey}
        list={tabs.map((item, index) => ({
          key: item.key,
          jsx: (
            <Webview
              ref={el => {
                item.webview = el
              }}
              item={item}
              onTitleUpdated={title => {
                tabs[index].title = title
                tabs[index].url = item.webview.getURL()
                setTabs([...tabs])
              }}
            />
          )
        }))}
      />

      {rmstStore.contextMenuVisible && <ContextMenu />}
    </div>
  )
}

export default rmstBrowser
