import { Fragment, useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { Button, Input, Toast } from '@douyinfe/semi-ui'
import { IconFolderOpen } from '@douyinfe/semi-icons'
import { invoke } from '../api'
import { useElementResize, useWindowFocus } from '../hooks'
import { findAllChunks, findPosIndexList, searchProjects } from '../search'
import type { DirNamesTree, SettingData } from '../types'

export default function OpenFolder(): React.JSX.Element {
  const rootRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement | null>(null)
  const [keyword, setKeyword] = useState('')
  const [dirNamesTree, setDirNamesTree] = useState<DirNamesTree[]>([])
  const [selectIndex, setSelectIndex] = useState(0)
  const [editorPaths, setEditorPaths] = useState<string[]>([])
  const [activeEditorIndex, setActiveEditorIndex] = useState(0)

  const flatDirNames = useMemo(() => searchProjects(dirNamesTree, keyword), [dirNamesTree, keyword])

  const focusInput = useCallback(() => {
    window.setTimeout(() => {
      inputRef.current?.focus?.()
    }, 0)
  }, [])

  const loadInitialData = useCallback(async () => {
    const [tree, setting] = await Promise.all([invoke<DirNamesTree[]>('getProjectNamesTree'), invoke<SettingData>('getSetting')])

    setDirNamesTree(tree)
    setEditorPaths(setting.editorPaths ?? [])
    setActiveEditorIndex(0)
    focusInput()
  }, [focusInput])

  useEffect(() => {
    const timer = window.setTimeout(() => {
      void loadInitialData()
    }, 0)

    return () => window.clearTimeout(timer)
  }, [loadInitialData])

  useWindowFocus(
    useCallback(
      focused => {
        if (focused) {
          setKeyword('')
          setSelectIndex(0)
          void loadInitialData()
        } else if (import.meta.env.PROD) {
          void invoke('hideWindow')
        }
      },
      [loadInitialData]
    )
  )

  useElementResize(
    rootRef,
    useCallback(size => {
      void invoke('setWindowSize', { height: size.height })
    }, [])
  )

  const openProject = useCallback(
    async (projectPath: string, ctrlKey = false, shiftKey = false, editorIndex = activeEditorIndex) => {
      if (!projectPath) {
        return
      }

      if (ctrlKey && shiftKey) {
        Toast.info('暂不支持同时按下 Ctrl 和 Shift')
        return
      }

      await invoke('hideWindow')

      if (ctrlKey) {
        await invoke('open_with_terminal', { projectPath })
        return
      }

      if (!editorPaths[editorIndex]) {
        Toast.warning('请先在设置中添加编辑器 shell')
        return
      }

      await invoke('openFolderEditor', {
        projectPath,
        editorPath: editorPaths[editorIndex]
      })
    },
    [activeEditorIndex, editorPaths]
  )

  const onKeyDown = (event: React.KeyboardEvent<HTMLInputElement>): void => {
    if (event.key === 'ArrowUp' || event.key === 'ArrowDown') {
      event.preventDefault()
      if (flatDirNames.length === 0) {
        return
      }

      setSelectIndex(current => {
        if (event.key === 'ArrowUp') {
          return current - 1 < 0 ? flatDirNames.length - 1 : current - 1
        }

        return current + 1 > flatDirNames.length - 1 ? 0 : current + 1
      })
      return
    }

    if (event.key === 'Enter') {
      void openProject(flatDirNames[selectIndex], event.ctrlKey, event.shiftKey)
      return
    }

    if (event.altKey && (event.key === 'ArrowLeft' || event.key === 'ArrowRight')) {
      event.preventDefault()
      if (editorPaths.length === 0) {
        return
      }

      setActiveEditorIndex(current => {
        if (event.key === 'ArrowLeft') {
          return current - 1 < 0 ? editorPaths.length - 1 : current - 1
        }

        return current + 1 > editorPaths.length - 1 ? 0 : current + 1
      })
    }
  }

  const selectedProject = flatDirNames[selectIndex]

  return (
    <div ref={rootRef} className="open-folder">
      <section className="open-folder-search">
        <Input
          ref={inputRef}
          autoFocus
          placeholder="人美声甜"
          value={keyword}
          size="large"
          className="open-folder-input"
          onChange={value => {
            setSelectIndex(0)
            setKeyword(value)
          }}
          onKeyDown={onKeyDown}
        />

        <div className="open-folder-actions drag-region">
          <div className="editor-switcher no-drag">
            {editorPaths.map((editorPath, index) => (
              <Button
                key={`${editorPath}-${index}`}
                size="small"
                theme={activeEditorIndex === index ? 'solid' : 'borderless'}
                type={activeEditorIndex === index ? 'primary' : 'tertiary'}
                onClick={() => {
                  setActiveEditorIndex(index)
                  void openProject(selectedProject, false, false, index)
                }}
              >
                {formatEditorName(editorPath)}
              </Button>
            ))}
          </div>

          <Button
            className="no-drag"
            size="small"
            icon={<IconFolderOpen />}
            disabled={!selectedProject}
            onClick={() => {
              void invoke('hideWindow')
              void invoke('open_in_explorer', { path: selectedProject })
            }}
          >
            explorer
          </Button>
        </div>
      </section>

      {flatDirNames.length > 0 && (
        <section className="open-folder-list">
          {flatDirNames.map((item, index) => (
            <button
              type="button"
              className={index === selectIndex ? 'project-option is-active' : 'project-option'}
              key={item}
              onMouseEnter={() => setSelectIndex(index)}
              onClick={event => void openProject(item, event.ctrlKey, event.shiftKey)}
            >
              <span>
                {findAllChunks(findPosIndexList(keyword, item), item).map((chunk, chunkIndex) => (
                  <Fragment key={`${chunk.start}-${chunk.end}-${chunkIndex}`}>
                    {chunk.highLight ? (
                      <b>{item.slice(chunk.start, chunk.end)}</b>
                    ) : (
                      <span>{item.slice(chunk.start, chunk.end)}</span>
                    )}
                  </Fragment>
                ))}
              </span>
            </button>
          ))}
        </section>
      )}
    </div>
  )
}

function formatEditorName(editorPath: string): string {
  return (
    editorPath
      .split(/[\\/]/)
      .at(-1)
      ?.replace(/\.[^.]+$/, '') || editorPath
  )
}
