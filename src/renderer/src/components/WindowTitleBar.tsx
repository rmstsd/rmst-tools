import { useWindowFocus } from '@renderer/hooks'
import clsx from 'clsx'

export function WindowTitleBar() {
  const focused = useWindowFocus()

  return <div className={clsx('window-title-bar', { focused })}></div>
}
