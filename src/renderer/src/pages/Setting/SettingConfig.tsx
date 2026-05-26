import { useCallback, useEffect, useState } from 'react'
import { Button, Input, Tag, Toast, Typography } from '@douyinfe/semi-ui'
import { IconDelete, IconDownload, IconPlus, IconRefresh, IconSave, IconUpload } from '@douyinfe/semi-icons'
import { invoke, notifyError } from '../../api'
import type { SettingData } from '../../types'
import Updater from './Updater'

const { Title } = Typography

const DEFAULT_SETTING: Required<Omit<SettingData, 'historyOpenedUrls'>> = {
  cmdPath: '',
  editorPaths: [],
  projectPaths: [],
  notes: [],
  nodeModulesFolders: []
}

export default function SettingConfig(): React.JSX.Element {
  const [setting, setSetting] = useState<SettingData>(DEFAULT_SETTING)
  const [appInfo, setAppInfo] = useState<Record<string, string>>({})
  const [saving, setSaving] = useState(false)

  const loadSetting = useCallback(async () => {
    const [data, info] = await Promise.all([
      invoke<SettingData>('Get_Setting'),
      invoke<Record<string, string>>('Get_Package_Info')
    ])

    setSetting({ ...DEFAULT_SETTING, ...data })
    setAppInfo(info)
  }, [])

  useEffect(() => {
    const timer = window.setTimeout(() => {
      void loadSetting()
    }, 0)

    return () => window.clearTimeout(timer)
  }, [loadSetting])

  const saveHandler = async (): Promise<void> => {
    setSaving(true)
    try {
      await invoke('Save_Setting', { settingData: setting })
      Toast.success('操作成功')
    } catch (error) {
      Toast.error(notifyError(error))
    } finally {
      setSaving(false)
    }
  }

  const importSetting = async (): Promise<void> => {
    try {
      await invoke('Import_Setting')
      Toast.success('操作成功')
      await loadSetting()
    } catch (error) {
      Toast.error(notifyError(error))
    }
  }

  const exportSetting = async (): Promise<void> => {
    try {
      await invoke('Export_Setting')
      Toast.success('操作成功')
    } catch (error) {
      Toast.error(notifyError(error))
    }
  }

  const clearStore = async (): Promise<void> => {
    try {
      await invoke('Clear_Store')
      Toast.success('操作成功')
      await loadSetting()
    } catch (error) {
      Toast.error(notifyError(error))
    }
  }

  return (
    <div>
      <div className="app-info">
        {Object.entries(appInfo).map(([key, value]) => (
          <Tag key={key} size="large" color="blue" style={{ userSelect: 'auto' }}>
            {key}: {value}
          </Tag>
        ))}
      </div>

      <div className="setting-config">
        <div className="setting-toolbar">
          <Title heading={4}>设置</Title>
          <Button icon={<IconSave />} type="primary" loading={saving} onClick={() => void saveHandler()}>
            保存
          </Button>
          <Button icon={<IconRefresh />} onClick={() => void loadSetting()}>
            刷新
          </Button>
          <Button icon={<IconDownload />} onClick={() => void exportSetting()}>
            导出
          </Button>
          <Button icon={<IconUpload />} onClick={() => void importSetting()}>
            导入
          </Button>
          <Button type="danger" onClick={() => void clearStore()}>
            清空本地缓存
          </Button>
          <Updater />
        </div>

        <ArrayEditor
          title="编辑器 shell"
          values={setting.editorPaths ?? []}
          placeholder="例如: Code"
          onChange={editorPaths => setSetting(current => ({ ...current, editorPaths }))}
        />

        <ArrayEditor
          title="项目目录列表"
          values={setting.projectPaths ?? []}
          placeholder="例如: E:\\project"
          onChange={projectPaths => setSetting(current => ({ ...current, projectPaths }))}
        />

        <ArrayEditor
          title="笔记列表"
          values={setting.notes ?? []}
          placeholder="任意字符串"
          onChange={notes => setSetting(current => ({ ...current, notes }))}
        />
      </div>
    </div>
  )
}

interface ArrayEditorProps {
  title: string
  values: string[]
  placeholder: string
  onChange: (values: string[]) => void
}

function ArrayEditor({ title, values, placeholder, onChange }: ArrayEditorProps): React.JSX.Element {
  const updateValue = (index: number, value: string): void => {
    onChange(values.map((item, currentIndex) => (currentIndex === index ? value : item)))
  }

  return (
    <section className="setting-section">
      <div className="section-title">
        <Title heading={5}>{title}</Title>
      </div>
      <div className="setting-grid" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))' }}>
        {values.map((item, index) => (
          <div className="inline-row" key={`${title}-${index}`}>
            <Input value={item} placeholder={placeholder} onChange={value => updateValue(index, value)} />
            <Button
              type="danger"
              theme="borderless"
              icon={<IconDelete />}
              aria-label="删除"
              onClick={() => onChange(values.filter((_, currentIndex) => currentIndex !== index))}
            />
          </div>
        ))}
      </div>
      <Button icon={<IconPlus />} onClick={() => onChange([...values, ''])}>
        Add
      </Button>
    </section>
  )
}
