import React, { useEffect, useRef, useState } from 'react'
import { Button, Input, Message } from '@arco-design/web-react'
import path from 'path-browserify'
import clsx from 'clsx'

import { defaultList } from '../utils'
import ResizeObserver from 'rc-resize-observer'
import { getSetting, openExternal } from '@renderer/ipc/common'
import {
  getProjectNamesTree,
  hideDirWindow,
  openWithTerminal,
  openWithVscode,
  setDirWindowSize
} from '@renderer/ipc/openDir'

interface DirNamesTree {
  name: string
  children: string[]
}

const DirSearch = () => {
  const [isCanOpenDir, setIsCanOpenDir] = useState(false)
  const [wd, setWd] = useState('')
  const [dirNamesTree, setDirNamesTree] = useState<DirNamesTree[]>([])
  const [selectIndex, setSelectIndex] = useState(0)
  const [isCmd, setIsCmd] = useState(false)

  const inputRef = useRef(null)

  useEffect(() => {
    getInitialData()

    document.onvisibilitychange = () => {
      if (document.visibilityState == 'visible') {
        setIsCmd(false)
        setWd('')
        getInitialData()
      }
    }

    return () => {
      document.onvisibilitychange = null
    }
  }, [])

  const getInitialData = () => {
    inputRef.current.dom.focus()

    getProjectNamesTree().then(setDirNamesTree)

    getSetting().then(data => {
      const isCan = Boolean(data.vscodePath) && Array.isArray(data.projectPaths) && data.projectPaths.length !== 0
      setIsCanOpenDir(isCan)
    })
  }

  const onConfirm = (projectPath: string) => {
    if (searchUrl) {
      openExternal(searchUrl)

      hideDirWindow()

      setWd('')
      return
    }

    if (!isCanOpenDir) {
      Message.info({ content: '请先点击托盘右键设置 编辑器路径,项目目录', style: { top: -35 }, id: 'o' })
      return
    }

    if (isCmd) {
      openWithCmd(projectPath)
    } else {
      if (!projectPath) {
        return
      }
      openWithVscode(projectPath).then(hideDirWindow)
    }

    setWd('')
    setSelectIndex(0)
  }

  const openWithCmd = (projectPath: string) => {
    if (!projectPath) {
      return
    }
    openWithTerminal(projectPath).then(hideDirWindow)
  }

  const onKeyDown = (evt: React.KeyboardEvent<HTMLInputElement>) => {
    if (['ArrowUp', 'ArrowDown'].includes(evt.code)) {
      evt.preventDefault()

      if (evt.code === 'ArrowUp') {
        const nv = selectIndex - 1
        setSelectIndex(nv < 0 ? flatDirNames.length - 1 : nv)
      }
      if (evt.code === 'ArrowDown') {
        const nv = selectIndex + 1
        setSelectIndex(nv > flatDirNames.length - 1 ? 0 : nv)
      }
    }
    if (evt.code === 'ArrowRight') {
      const target = evt.target as HTMLInputElement

      if (target.selectionEnd === target.selectionStart && target.selectionEnd === wd.length) {
        setIsCmd(true)
      }
    }
    if (evt.code === 'ArrowLeft') {
      setIsCmd(false)
    }
  }

  const flatDirNames = search(dirNamesTree, wd)

  const { tipInfo, searchUrl } = (() => {
    const [shortcutWd] = wd?.split(' ') || []

    const matchItem = defaultList.find(item =>
      item.shortcutWd.map(o => o.toLowerCase()).includes(shortcutWd.toLowerCase())
    )

    // 如果目的是搜索
    if (matchItem && wd.at(shortcutWd.length) === ' ') {
      const searchWd = wd.slice(shortcutWd.length + 1)
      const searchUrl = matchItem.searchLink + searchWd

      return { tipInfo: `用${matchItem.title}搜索`, searchUrl }
    }

    return { tipInfo: '打开目录', searchUrl: undefined }
  })()

  return (
    <ResizeObserver onResize={size => setDirWindowSize(size)}>
      <div>
        <section className="relative">
          <Input
            ref={inputRef}
            placeholder="人美声甜"
            value={wd}
            onChange={value => {
              setSelectIndex(0)
              setWd(value)
            }}
            onPressEnter={() => onConfirm(flatDirNames[selectIndex])}
            className="h-[60px] border-none text-[18px]"
            onKeyDown={onKeyDown}
          />
          <div className="s-tipInfo win-drag">{tipInfo}</div>
        </section>

        {flatDirNames.length !== 0 && (
          <section className="arco-select-popup border-none">
            {flatDirNames.map((item, index) => (
              <div
                className={clsx('arco-select-option option-item !text-[16px] flex justify-between', {
                  'arco-select-option-hover': selectIndex === index
                })}
                key={index}
                onClick={() => onConfirm(item)}
              >
                <span>
                  {findAllChunks(findPosIndexList(wd, item), item).map(chunkItem =>
                    chunkItem.highLight ? (
                      <b className="text-[#5454ff]">{item.slice(chunkItem.start, chunkItem.end)}</b>
                    ) : (
                      <span>{item.slice(chunkItem.start, chunkItem.end)}</span>
                    )
                  )}
                </span>

                <Button
                  type={isCmd && selectIndex === index ? 'primary' : 'outline'}
                  onClick={evt => {
                    evt.stopPropagation()
                    openWithCmd(item)
                  }}
                >
                  cmd
                </Button>
              </div>
            ))}
          </section>
        )}
      </div>
    </ResizeObserver>
  )
}

export default DirSearch

function search(dirNames: DirNamesTree[], wd: string) {
  const seRes = wd.length
    ? dirNames
        .filter(item => item.children.some(o => ssOw(o, wd)))
        .map(item => ({
          ...item,
          children: item.children.filter(o => ssOw(o, wd))
        }))
    : []
  const flatRes = seRes.reduce<string[]>((acc, item) => acc.concat(item.children.map(o => path.join(item.name, o))), [])

  return flatRes
}

function ssOw(originValue: string, wd: string) {
  const ovs = originValue.toLowerCase().split('')
  const wds = wd.toLowerCase().split('')

  return findPosIndexList(wd, originValue).length > 0

  return originValue.toLowerCase().includes(wd.toLowerCase())
}

function findPosIndexList(wd, data): number[] {
  let pos = []

  const wdArray = wd.split('')

  let dataIndex = 0
  while (dataIndex < data.length) {
    if (data.charAt(dataIndex) === wdArray[0]) {
      pos.push(dataIndex)
      wdArray.shift()
    }

    dataIndex++
  }

  if (wdArray.length !== 0) {
    pos = []
  }

  return pos
}

function findAllChunks(pos, data) {
  const ans = []

  for (const item of pos) {
    if (ans.length === 0) {
      ans.push({ start: item, end: item + 1 })
    } else {
      const prev = ans.at(-1)

      if (item === prev.end) {
        prev.end++
      } else {
        ans.push({ start: item, end: item + 1 })
      }
    }
  }

  const allChunks: { start: number; end: number; highLight: boolean }[] = []

  let lastIndex = 0
  ans.forEach(item => {
    appendChunk(lastIndex, item.start, false)
    appendChunk(item.start, item.end, true)

    lastIndex = item.end
  })
  appendChunk(lastIndex, data.length, false)

  return allChunks

  function appendChunk(start, end, highLight) {
    if (end - start > 0) {
      allChunks.push({ start, end, highLight })
    }
  }
}
