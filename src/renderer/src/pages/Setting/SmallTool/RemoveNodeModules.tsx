import { useCallback, useEffect, useState } from 'react'
import { Button, Checkbox, Input, Toast, Typography } from '@douyinfe/semi-ui'
import { IconDelete, IconPlus } from '@douyinfe/semi-icons'
import { invoke, notifyError } from '../../../api'
import type { NodeModulesFolder, SettingData } from '../../../types'

const { Title } = Typography

export default function RemoveNodeModules(): React.JSX.Element {
  const [folders, setFolders] = useState<NodeModulesFolder[]>([])
  const [loading, setLoading] = useState(false)

  const loadFolders = useCallback(async () => {
    const data = await invoke<SettingData>('getSetting')
    setFolders(data.nodeModulesFolders ?? [])
  }, [])

  useEffect(() => {
    const timer = window.setTimeout(() => {
      void loadFolders()
    }, 0)

    return () => window.clearTimeout(timer)
  }, [loadFolders])

  const remove = async (): Promise<void> => {
    setLoading(true)
    try {
      const values = await invoke<SettingData>('getSetting')
      await invoke('saveSetting', { settingData: { ...values, nodeModulesFolders: folders } })
      await invoke('removeFolder', { nodeModulesFolders: folders })
      Toast.success('成功')
    } catch (error) {
      Toast.error(notifyError(error))
    } finally {
      setLoading(false)
    }
  }

  const updateFolder = (index: number, patch: NodeModulesFolder): void => {
    setFolders(current => current.map((item, currentIndex) => (currentIndex === index ? { ...item, ...patch } : item)))
  }

  return (
    <section className="tool-section">
      <div className="section-header">
        <Title heading={5}>删除 node_modules</Title>
        <Button type="danger" loading={loading} onClick={() => void remove()}>
          执行删除
        </Button>
      </div>

      <div className="folder-list">
        {folders.map((item, index) => (
          <div className="inline-row" key={`${item.path}-${index}`}>
            <Checkbox
              checked={Boolean(item.selected)}
              onChange={event => updateFolder(index, { selected: event.target.checked })}
            />
            <Input value={item.path} placeholder="文件夹路径" onChange={value => updateFolder(index, { path: value })} />
            <Button
              type="danger"
              theme="borderless"
              icon={<IconDelete />}
              aria-label="删除"
              onClick={() => setFolders(current => current.filter((_, currentIndex) => currentIndex !== index))}
            />
          </div>
        ))}
      </div>

      <Button icon={<IconPlus />} onClick={() => setFolders(current => [...current, { selected: true, path: '' }])}>
        add
      </Button>
    </section>
  )
}
