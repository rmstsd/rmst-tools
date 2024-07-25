import React, { useRef } from 'react'

const TabPanes = (
  props: React.PropsWithChildren<{ activeKey: string | number; list: { key: string | number; jsx: React.ReactNode }[] }>
) => {
  return (
    <div style={{ flexGrow: 1 }}>
      {props.list.map(item => (
        <TabContent key={item.key} isActive={item.key === props.activeKey}>
          {item.jsx}
        </TabContent>
      ))}
    </div>
  )
}

export default TabPanes

function TabContent(props) {
  const shouldRender = useRef(false)
  if (props.isActive) {
    shouldRender.current = true
  }

  if (!shouldRender.current) {
    return null
  }

  const style: React.CSSProperties = { height: '100%', ...(props.isActive ? null : { display: 'none' }) }

  return <div style={style}>{props.children}</div>
}
