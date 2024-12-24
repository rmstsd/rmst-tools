import { Button, Divider, Form, Input, InputNumber, Message, Modal } from '@arco-design/web-react'
import { useEffect, useRef, useState } from 'react'
import { killPort, Open_Url_Win } from '@renderer/ipc/killPort'
import { createOnListener, ipcRenderer } from '@renderer/ipc/ipc'

export default function SmallTool() {
  const [list, setList] = useState([])

  useEffect(() => {
    ipcRenderer.on('log', (...r) => {
      setList(a => a.concat(r[1]))
    })
  }, [])

  return (
    <div className="p-[40px]">
      <KillPortTool />

      <Divider />

      <OpenWindow />

      {/* <button onClick={() => setList([])}>清空</button>
      <div>
        {list.map(item => (
          <div>{item}</div>
        ))}
      </div> */}
    </div>
  )
}

function KillPortTool() {
  const ref = useRef(null)

  useEffect(() => {
    ref.current?.focus()

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
    <Form form={form}>
      <Form.Item label="端口号" field="port" rules={[{ required: true }]}>
        <InputNumber ref={ref} placeholder="端口号" />
      </Form.Item>

      <Form.Item label=" ">
        <Button loading={loading} onClick={kill}>
          kill
        </Button>
      </Form.Item>
    </Form>
  )
}

function OpenWindow() {
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
