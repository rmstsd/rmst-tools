import { Button, Form, Input } from '@arco-design/web-react'
import { Open_Url_Win } from '@renderer/ipc/killPort'

export default function OpenWindow() {
  const [form] = Form.useForm()

  return (
    <Form form={form}>
      <Form.Item label="url" field="url" rules={[{ required: true, type: 'url' }]}>
        <Input placeholder="http://www.example.com" />
      </Form.Item>
      <Form.Item label=" ">
        <Button
          onClick={async () => {
            await form.validate()
            Open_Url_Win(form.getFieldValue('url'))
          }}
        >
          打开
        </Button>
      </Form.Item>
    </Form>
  )
}
