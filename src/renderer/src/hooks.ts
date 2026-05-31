import type { RefObject } from 'react'
import { useEffect, useState } from 'react'

export function useWindowFocus(callback?: (focused: boolean) => void) {
  const [focused, setFocused] = useState(false)

  useEffect(
    () =>
      window.api.onWindowFocusChanged(focused => {
        callback?.(focused)
        setFocused(focused)
      }),
    [callback]
  )

  return focused
}

export function useElementResize<T extends HTMLElement>(
  ref: RefObject<T | null>,
  callback: (size: { width: number; height: number }) => void
): void {
  useEffect(() => {
    const element = ref.current
    if (!element) {
      return undefined
    }

    const observer = new ResizeObserver(() => {
      const currentElement = ref.current
      if (!currentElement) {
        return
      }

      const { width, height } = currentElement.getBoundingClientRect()
      callback({ width, height })
    })

    observer.observe(element)
    return () => observer.disconnect()
  }, [callback, ref])
}
