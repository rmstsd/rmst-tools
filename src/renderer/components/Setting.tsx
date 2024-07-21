import { Button, Form, Input, Message, Tag } from '@arco-design/web-react'
import { IconDelete } from '@arco-design/web-react/icon'
import { useEffect, useState } from 'react'

import { checkUpdate, clearStore, getBaseInfo, getSetting, saveSetting } from '@renderer/ipc/common'
import { SettingData } from '@common/type'

export default function SettingPage() {
  const [form] = Form.useForm()

  const [baseInfo, setBaseInfo] = useState({ appPath: '', version: '', name: '' })

  useEffect(() => {
    getSetting().then(data => {
      form.setFieldsValue(data)
    })
    getBaseInfo().then(data => {
      setBaseInfo(data)
    })
  }, [])

  const onSubmit = (value: SettingData) => {
    saveSetting(value).then(() => {
      Message.success('保存成功')
    })
  }

  const clearEleStore = () => {
    clearStore().then(() => {
      Message.info('已清除')
    })
  }

  const ini = {
    // cmdPath: '%LOCALAPPDATA%\\Microsoft\\WindowsApps\\wt.exe',
    // projectPaths: ['E:\\', 'E:\\git-src', 'E:\\whh'],
    // notes: ['2864617610@qq.com', '18842542125', '李春雷', '17642029052'],
    // vscodePath: 'D:\\VS Code\\Code.exe'
  }

  const [cuLoading, setCuLoading] = useState(false)

  return (
    <div>
      <div className="flex justify-center gap-[10px] mt-[5px] text-[20px]">
        <div>
          name: <Tag size="large">{baseInfo.name}</Tag>
        </div>
        <div>
          appPath: <Tag size="large">{baseInfo.appPath}</Tag>
        </div>
        <div>
          version: <Tag size="large">{baseInfo.version}</Tag>
        </div>
      </div>
      <Form className="pr-[10%]" initialValues={ini} form={form} autoComplete="off" onSubmit={onSubmit}>
        <Form.Item label=" " className="sticky top-0 z-10 mt-[20px] bg-white">
          <div className="flex items-center gap-[20px]">
            <h2>设置</h2>
            <Button type="primary" htmlType="submit">
              Submit
            </Button>
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

        <Form.Item label="vsCode 路径" field="vscodePath">
          <Input placeholder="例如: D:\Microsoft VS Code\Code.exe" />
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
