import { Menu } from '@arco-design/web-react'

import { useRmstStore } from '@renderer/store'

function ContextMenu() {
  const rmstStore = useRmstStore()

  return (
    <>
      <div
        className="mask"
        onClick={() => rmstStore.setContextMenuVisible(false)}
        onContextMenu={evt => {
          rmstStore.setContextMenuCoord({ x: evt.clientX, y: evt.clientY })
        }}
      />

      <Menu className="context-menu" style={{ left: rmstStore.contextMenuCoord.x, top: rmstStore.contextMenuCoord.y }}>
        <Menu.Item key="c">检查</Menu.Item>
      </Menu>
    </>
  )
}

export default ContextMenu
