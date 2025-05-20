import React, { Fragment, useLayoutEffect, useRef, useState } from 'react'
import { Divider, Input, Message, Radio } from '@arco-design/web-react'
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
import { SettingData } from '@common/type'

interface DirNamesTree {
  name: string
  children: string[]
}

const DirSearch = () => {
  const [wd, setWd] = useState('')
  const [dirNamesTree, setDirNamesTree] = useState<DirNamesTree[]>([])
  const [selectIndex, setSelectIndex] = useState(0)
  const inputRef = useRef(null)

  const [editorPaths, setEditorPaths] = useState<SettingData['editorPaths']>([])
  const [activeEditorIndex, setActiveEditorIndex] = useState(0)

  useLayoutEffect(() => {
    getInitialData()

    const onvisibilitychange = () => {
      if (document.visibilityState == 'visible') {
        getInitialData()
      } else {
        resetState()
      }
    }

    document.addEventListener('visibilitychange', onvisibilitychange)
    return () => {
      document.removeEventListener('visibilitychange', onvisibilitychange)
    }
  }, [])

  const resetState = () => {
    setWd('')
    setSelectIndex(0)
  }

  const getInitialData = () => {
    inputRef.current.dom.focus()

    getProjectNamesTree().then(setDirNamesTree)

    getSetting().then(res => {
      setEditorPaths(res.editorPaths ?? [])
      setActiveEditorIndex(0)
    })
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
    } else {
      if (evt.key === 'Enter') {
        if (searchUrl) {
          openExternal(searchUrl)
          hideDirWindow()
          return
        }

        const projectPath = flatDirNames[selectIndex]
        onItemClick(evt.ctrlKey, evt.shiftKey, projectPath)
      } else if (['ArrowLeft', 'ArrowRight'].includes(evt.code)) {
        if (evt.altKey) {
          evt.preventDefault()

          if (evt.code === 'ArrowLeft') {
            const nvActiveEditorIndex = activeEditorIndex - 1
            setActiveEditorIndex(nvActiveEditorIndex < 0 ? editorPaths.length - 1 : nvActiveEditorIndex)
          }

          if (evt.code === 'ArrowRight') {
            const nvActiveEditorIndex = activeEditorIndex + 1
            setActiveEditorIndex(nvActiveEditorIndex > editorPaths.length - 1 ? 0 : nvActiveEditorIndex)
          }
        }
      }
    }
  }

  const onItemClick = async (ctrlKey: boolean, shiftKey: boolean, projectPath: string) => {
    if (!projectPath) {
      return
    }

    if (ctrlKey && shiftKey) {
      Message.info({ id: 'not-support-ctrl-shift', content: '暂不支持同时按下Ctrl和Shift' })
      return
    }

    hideDirWindow()

    if (ctrlKey) {
      openWithTerminal(projectPath)
    } else if (shiftKey) {
      openWithVscode(projectPath, editorPaths[activeEditorIndex])
      openWithTerminal(projectPath)
    } else {
      openWithVscode(projectPath, editorPaths[activeEditorIndex])
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
      <div className="open-dir">
        <section className="relative">
          <Input
            ref={inputRef}
            placeholder="人美声甜"
            value={wd}
            onChange={value => {
              setSelectIndex(0)
              setWd(value)
            }}
            className="h-[60px] border-none text-[18px]"
            onKeyDown={onKeyDown}
          />
          <div className="s-tipInfo ">
            <div className="flex items-center gap-2">
              <Radio.Group
                value={activeEditorIndex}
                onChange={value => {
                  hideDirWindow()
                  openWithVscode(flatDirNames[selectIndex], editorPaths[value])
                }}
                type="button"
                name="lang"
                options={editorPaths.map((item, index) => ({
                  label: item.split(/\/|\\/).at(-1).split('.')[0],
                  value: index
                }))}
              />
            </div>
            <span className="win-drag h-full flex items-center">{tipInfo}</span>
          </div>
        </section>

        {flatDirNames.length !== 0 && (
          <section className="arco-select-popup border-none">
            {flatDirNames.map((item, index) => (
              <div
                className={clsx('arco-select-option !text-[16px] flex justify-between', {
                  'arco-select-option-hover': selectIndex === index
                })}
                key={item}
                onClick={evt => onItemClick(evt.ctrlKey, evt.shiftKey, item)}
              >
                <span>
                  {findAllChunks(findPosIndexList(wd, item), item).map((chunkItem, index) => (
                    <Fragment key={index}>
                      {chunkItem.highLight ? (
                        <b className="text-[#5454ff]">{item.slice(chunkItem.start, chunkItem.end)}</b>
                      ) : (
                        <span>{item.slice(chunkItem.start, chunkItem.end)}</span>
                      )}
                    </Fragment>
                  ))}
                </span>
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
  originValue = originValue.toLowerCase()
  wd = wd.toLowerCase()

  return findPosIndexList(wd, originValue).length > 0
}

function findPosIndexList(wd, data): number[] {
  wd = wd.toLowerCase()
  data = data.toLowerCase()
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
