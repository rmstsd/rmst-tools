import { forwardRef, useEffect, useImperativeHandle, useRef } from 'react'
import { WebviewTag } from 'electron'

import { TabView } from '.'

const Webview = forwardRef<WebviewTag, { item: TabView; onTitleUpdated }>((props, ref) => {
  const { item, onTitleUpdated } = props

  const webRef = useRef<WebviewTag>(null)

  useImperativeHandle(ref, () => webRef.current)

  useEffect(() => {
    const webview = webRef.current

    webview.addEventListener('page-title-updated', evt => {
      onTitleUpdated(evt.title)
    })
  }, [])

  return (
    <webview
      ref={webRef}
      src={item.url}
      style={{ width: '100%', height: '100%' }}
      // @ts-ignore
      allowpopups="true"
    />
  )
})

export default Webview
