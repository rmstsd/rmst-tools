import { Button, Form, Message, Radio } from '@arco-design/web-react'
import { useState } from 'react'
import { Set_Git_Ignorecase } from '@renderer/ipc/killPort'

export default function GitSetting() {
  const [gitLoading, setGitLoading] = useState(false)

  const [form] = Form.useForm()

  return (
    <Form form={form} initialValues={{ ignorecase: false }}>
      <Form.Item label="是否对大小写敏感" field="ignorecase">
        <Radio.Group
          options={[
            { value: false, label: '是' },
            { value: true, label: '否' }
          ]}
        ></Radio.Group>
      </Form.Item>
      <Form.Item label=" ">
        <Button
          loading={gitLoading}
          onClick={() => {
            setGitLoading(true)

            const value = form.getFieldValue('ignorecase')

            Set_Git_Ignorecase(value)
              .then(() => {
                Message.success({ content: '设置成功', position: 'bottom' })
              })
              .catch(() => {
                Message.error({ content: '设置失败', position: 'bottom' })
              })
              .finally(() => {
                setGitLoading(false)
              })
          }}
        >
          执行
        </Button>
      </Form.Item>
    </Form>
  )
}
