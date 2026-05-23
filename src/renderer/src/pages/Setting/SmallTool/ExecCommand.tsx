import { useCallback, useEffect, useState } from 'react'
import { Button, Input, Toast, Typography } from '@douyinfe/semi-ui'
import { IconDelete, IconPlay, IconPlus, IconSave } from '@douyinfe/semi-icons'
import { invoke, notifyError } from '../../../api'
import type { CommandItem } from '../../../types'

const { Title } = Typography

const emptyCommand: CommandItem = {
  label: '',
  cmd: '',
  arg: '',
  currentDir: ''
}

export default function ExecCommand(): React.JSX.Element {
  const [commands, setCommands] = useState<CommandItem[]>([])
  const [loadingIndex, setLoadingIndex] = useState<number | null>(null)

  const loadCommands = useCallback(async () => {
    setCommands(await invoke<CommandItem[]>('getCommands'))
  }, [])

  useEffect(() => {
    const timer = window.setTimeout(() => {
      void loadCommands()
    }, 0)

    return () => window.clearTimeout(timer)
  }, [loadCommands])

  const saveHandler = async (): Promise<void> => {
    try {
      await invoke('saveCommands', { commands })
      Toast.success('保存成功')
      await loadCommands()
    } catch (error) {
      Toast.error(notifyError(error))
    }
  }

  const execCommand = async (command: CommandItem, index: number): Promise<void> => {
    if (!command.label) {
      Toast.warning('请先填写名称并保存')
      return
    }

    setLoadingIndex(index)
    try {
      await invoke('execCommand', { label: command.label })
      Toast.success('执行成功')
    } catch (error) {
      Toast.error(`执行失败: ${notifyError(error)}`)
    } finally {
      setLoadingIndex(null)
    }
  }

  const updateCommand = (index: number, patch: Partial<CommandItem>): void => {
    setCommands(current => current.map((item, currentIndex) => (currentIndex === index ? { ...item, ...patch } : item)))
  }

  return (
    <section className="tool-section">
      <div className="section-header">
        <Title heading={5}>常用命令</Title>
        <Button icon={<IconSave />} onClick={() => void saveHandler()}>
          保存
        </Button>
      </div>

      <div className="command-list">
        {commands.map((command, index) => (
          <div className="command-item" key={`${command.label}-${index}`}>
            <div className="command-grid">
              <Input value={command.label} placeholder="名称" onChange={value => updateCommand(index, { label: value })} />
              <Input value={command.cmd} placeholder="命令" onChange={value => updateCommand(index, { cmd: value })} />
              <Input value={command.arg} placeholder="参数" onChange={value => updateCommand(index, { arg: value })} />
              <Input
                value={command.currentDir}
                placeholder="工作目录"
                onChange={value => updateCommand(index, { currentDir: value })}
              />
            </div>
            <div className="command-actions">
              <Button
                type="primary"
                icon={<IconPlay />}
                loading={loadingIndex === index}
                onClick={() => void execCommand(command, index)}
              >
                执行
              </Button>
              <Button
                type="danger"
                theme="borderless"
                icon={<IconDelete />}
                aria-label="删除"
                onClick={() => setCommands(current => current.filter((_, currentIndex) => currentIndex !== index))}
              />
            </div>
          </div>
        ))}
      </div>

      <Button icon={<IconPlus />} onClick={() => setCommands(current => [...current, emptyCommand])}>
        add
      </Button>
    </section>
  )
}
