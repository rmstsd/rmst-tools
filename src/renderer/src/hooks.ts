import type { RefObject } from 'react'
import { useEffect } from 'react'

export function useWindowFocus(callback: (focused: boolean) => void): void {
  useEffect(() => window.api.onWindowFocusChanged(callback), [callback])
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
