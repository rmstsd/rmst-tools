import { Button, Form, Input, Link, Typography } from '@arco-design/web-react'
import { getSetting } from '@renderer/ipc/common'
import { Open_Url_Win } from '@renderer/ipc/killPort'
import { useState } from 'react'
import { useInterval } from 'ahooks'

export default function OpenWindow() {
  const [form] = Form.useForm()

  const [historyOpenedUrls, setHistoryOpenedUrls] = useState([])

  useInterval(
    () => {
      updateOpenedUrls()
    },
    2000,
    { immediate: true }
  )

  const updateOpenedUrls = () => {
    getSetting().then(data => {
      setHistoryOpenedUrls(data.historyOpenedUrls ?? [])
    })
  }

  return (
    <Form form={form}>
      <Form.Item label="opened url" field="url" rules={[{ required: true, type: 'url' }]}>
        <Input placeholder="http://www.example.com" />
      </Form.Item>
      <Form.Item label=" ">
        <Button
          onClick={async () => {
            await form.validate()
            Open_Url_Win(form.getFieldValue('url'))
            form.resetFields()
          }}
        >
          打开
        </Button>
      </Form.Item>
      <Form.Item label="历史打开">
        {historyOpenedUrls.map((item, idx) => (
          <div className="flex items-center gap-[10px] my-2" key={idx}>
            <Link onClick={() => Open_Url_Win(item)}>open</Link>
            <Typography.Ellipsis rows={1} className="flex-grow w-0">
              {item}
            </Typography.Ellipsis>
          </div>
        ))}
      </Form.Item>
    </Form>
  )
}
