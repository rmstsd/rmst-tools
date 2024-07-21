import { useLayoutEffect, useState } from 'react'
import { Button } from '@arco-design/web-react'
import clsx from 'clsx'
import ResizeObserver from 'rc-resize-observer'
import { getSetting } from '@renderer/ipc/common'
import { execQuickInput, hideQuickInputWin, setQuickInputWindowSize } from '@renderer/ipc/quickInput'

const Num = () => {
  useLayoutEffect(() => {
    getContent()
    document.addEventListener('visibilitychange', () => {
      getContent()
    })
  }, [])

  const [contentList, setContentList] = useState<string[]>([])

  const getContent = () => {
    getSetting().then(data => {
      setContentList(data.notes)
    })
  }

  return (
    <ResizeObserver onResize={size => setQuickInputWindowSize({ width: size.width, height: size.height })}>
      <div className="select-none p-[6px] w-[200px]">
        <div className="win-drag h-[22px] bg-orange-400 flex mb-[5px]">
          <Button size="mini" className={clsx('win-not-drag h-full')} onClick={hideQuickInputWin}>
            x
          </Button>
        </div>

        <div className="flex flex-col gap-[6px]">
          {contentList.map((item, index) => (
            <Button
              size="small"
              key={index}
              type="default"
              className="!border-gray-300 !text-gray-800"
              onClick={() => {
                execQuickInput(item).then(hideQuickInputWin)
              }}
            >
              {item}
            </Button>
          ))}
        </div>
      </div>
    </ResizeObserver>
  )
}

export default Num
