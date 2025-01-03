import { Button, Form, Input, Message, Switch, Tag } from '@arco-design/web-react'
import { IconDelete } from '@arco-design/web-react/icon'
import { useEffect, useState } from 'react'

import {
  checkUpdate,
  clearStore,
  exportSetting,
  getBaseInfo,
  getIsPackaged,
  getSetting,
  importSetting,
  saveSetting
} from '@renderer/ipc/common'
import { AppBaseInfo, SettingData } from '@common/type'
import { platform } from '@renderer/ipc/ipc'

export default function SettingPage() {
  const [form] = Form.useForm()

  const [baseInfo, setBaseInfo] = useState({} as AppBaseInfo)
  const [packaged, setPackaged] = useState({})

  useEffect(() => {
    getSettingData()

    getBaseInfo().then(data => {
      setBaseInfo(data)
    })

    getIsPackaged().then(bool => {
      setPackaged({ isPackaged: bool })
    })
  }, [])

  const getSettingData = () => {
    getSetting().then(data => {
      form.setFieldsValue(data)
    })
  }

  const onSubmit = (value: SettingData) => {
    saveSetting(value).then(() => {
      Message.success('保存成功')
    })
  }

  const clearEleStore = () => {
    clearStore().then(() => {
      Message.info('已清除')
      form.resetFields()
    })
  }

  const exportCfg = () => {
    exportSetting().then(() => {
      Message.success('导出成功')
    })
  }

  const importCfg = () => {
    importSetting().then(() => {
      Message.success('导入成功')
      getSettingData()
    })
  }

  const ini = {
    // cmdPath: '%LOCALAPPDATA%\\Microsoft\\WindowsApps\\wt.exe',
    // projectPaths: ['E:\\', 'E:\\git-src', 'E:\\whh'],
    // notes: ['2864617610@qq.com', '18842542125', '李春雷', '17642029052'],
    // vscodePath: 'D:\\VS Code\\Code.exe'
  }

  const [cuLoading, setCuLoading] = useState(false)

  const env = {
    NODE_ENV: process.env.NODE_ENV,
    Base_Url: process.env.Base_Url,
    Release_Env: process.env.Release_Env
  }

  return (
    <div>
      <div className="flex flex-wrap mx-2 gap-x-[20px] gap-y-2 mt-[5px] text-[16px]">
        {Object.entries({ appVersion: baseInfo.appVersion, ...platform, ...packaged, ...env }).map(([key, value]) => (
          <div key={key}>
            {key}: <Tag size="large">{String(value)}</Tag>
          </div>
        ))}
      </div>
      <Form className="pr-[10%]" initialValues={ini} form={form} autoComplete="off" onSubmit={onSubmit}>
        <Form.Item label=" " className="sticky top-0 z-10 mt-[20px] bg-white">
          <div className="flex flex-wrap items-center gap-x-3">
            <h2>设置</h2>
            <Button type="primary" htmlType="submit">
              保存
            </Button>
            <Button.Group>
              <Button type="outline" onClick={exportCfg}>
                导出
              </Button>
              <Button type="outline" onClick={importCfg}>
                导入
              </Button>
            </Button.Group>
            <Button type="primary" status="danger" onClick={clearEleStore}>
              清空本地缓存
            </Button>
            <Button
              loading={cuLoading}
              type="primary"
              onClick={() => {
                setCuLoading(true)
                checkUpdate().finally(() => setCuLoading(false))
              }}
            >
              检查更新
            </Button>
          </div>
        </Form.Item>

        <Form.Item label="编辑器路径列表">
          <Form.List field="editorPaths">
            {(fields, { add, remove }) => {
              console.log(fields)
              return (
                <div>
                  {fields.map((item, index) => {
                    return (
                      <div key={item.key} className="flex gap-[10px]">
                        <Form.Item field={`${item.field}.path`} className="flex-grow">
                          <Input placeholder="例如: D:\Microsoft VS Code\Code.exe" />
                        </Form.Item>
                        <Form.Item field={`${item.field}.enable`} className="w-auto">
                          <Switch></Switch>
                        </Form.Item>
                        <Button
                          className="shrink-0"
                          onClick={() => remove(index)}
                          shape="circle"
                          status="danger"
                          icon={<IconDelete />}
                        ></Button>
                      </div>
                    )
                  })}
                  <div>
                    <Button onClick={() => add()}>Add</Button>
                  </div>
                </div>
              )
            }}
          </Form.List>
        </Form.Item>

        <Form.Item label="cmd Path" field="cmdPath">
          <Input placeholder="例如: D:\WindowsTerminal\wt.exe" />
        </Form.Item>

        <Form.Item label="项目目录列表">
          <Form.List field="projectPaths">
            {(fields, { add, remove }) => {
              return (
                <div>
                  {fields.map((item, index) => {
                    return (
                      <div key={item.key} className="flex gap-[10px]">
                        <Form.Item field={item.field}>
                          <Input placeholder="例如: E:\project" />
                        </Form.Item>
                        <Button
                          icon={<IconDelete />}
                          shape="circle"
                          status="danger"
                          onClick={() => remove(index)}
                          className="shrink-0"
                        />
                      </div>
                    )
                  })}
                  <Button onClick={() => add()}>add</Button>
                </div>
              )
            }}
          </Form.List>
        </Form.Item>

        <Form.Item label="笔记列表">
          <Form.List field="notes">
            {(fields, { add, remove }) => {
              return (
                <div>
                  {fields.map((item, index) => {
                    return (
                      <div key={item.key} className="flex gap-[10px]">
                        <Form.Item field={item.field}>
                          <Input placeholder="任意字符串" />
                        </Form.Item>
                        <Button
                          icon={<IconDelete />}
                          shape="circle"
                          status="danger"
                          className="shrink-0"
                          onClick={() => remove(index)}
                        />
                      </div>
                    )
                  })}

                  <Button onClick={() => add()}>add</Button>
                </div>
              )
            }}
          </Form.List>
        </Form.Item>
      </Form>
    </div>
  )
}
