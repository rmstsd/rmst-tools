import { Button, Form, InputNumber, Message } from '@arco-design/web-react'
import { useEffect, useRef, useState } from 'react'
import { killPort } from '@renderer/ipc/killPort'

export default function KillPortView() {
  const ref = useRef(null)

  useEffect(() => {
    document.onvisibilitychange = () => {
      if (document.visibilityState === 'visible') {
        ref.current?.focus()
      }
    }
  }, [])

  const [form] = Form.useForm()

  const [loading, setLoading] = useState(false)

  const kill = async () => {
    await form.validate()

    setLoading(true)
    killPort(form.getFieldValue('port'))
      .then(res => {
        if (res.code === 0) {
          Message.success({ content: res.stdout, position: 'bottom' })
        } else {
          Message.error({ content: res.stderr, position: 'bottom' })
        }
      })
      .finally(() => {
        setLoading(false)
      })
  }

  return (
    <div className="p-[40px]">
      <Form form={form}>
        <Form.Item label="端口号" field="port" rules={[{ required: true }]}>
          <InputNumber ref={ref} placeholder="端口号" />
        </Form.Item>

        <Form.Item label=" " field="port">
          <Button loading={loading} onClick={kill}>
            kill
          </Button>
        </Form.Item>
      </Form>
    </div>
  )
}
