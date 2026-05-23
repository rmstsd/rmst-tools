import { useEffect, useMemo, useState } from 'react'
import { Button, Modal, Progress, Toast, Typography } from '@douyinfe/semi-ui'
import { invoke, notifyError } from '../../api'
import type { DownloadEvent, UpdateInfo, UpdateProgress } from '../../types'

const { Text } = Typography

type UpdateStep = 'idle' | 'available' | 'downloading' | 'downloaded'

const EMPTY_PROGRESS: UpdateProgress = {
  percent: 0,
  bytesPerSecond: 0,
  transferred: 0,
  total: 0
}

export default function Updater(): React.JSX.Element {
  const [checking, setChecking] = useState(false)
  const [downloading, setDownloading] = useState(false)
  const [visible, setVisible] = useState(false)
  const [step, setStep] = useState<UpdateStep>('idle')
  const [updateInfo, setUpdateInfo] = useState<UpdateInfo>()
  const [progress, setProgress] = useState<UpdateProgress>(EMPTY_PROGRESS)

  useEffect(() => {
    return window.api.onUpdateDownload(event => {
      handleUpdateEvent(event)
    })
  }, [])

  const progressPercent = useMemo(() => Math.round(Math.min(100, Math.max(0, progress.percent || 0))), [progress.percent])

  const checkUpdate = async (): Promise<void> => {
    setChecking(true)
    try {
      const r = await invoke('checkUpdate')
      console.log(r)
      if (r.isUpdateAvailable) {
      } else {
        Toast.info({ id: 'xx', content: '当前已是最新版本' })
      }
    } catch (error) {
      Toast.error(notifyError(error))
    } finally {
      setChecking(false)
    }
  }

  const downloadAndInstall = async (): Promise<void> => {
    setDownloading(true)
    setStep('downloading')
    setProgress(EMPTY_PROGRESS)

    try {
      await invoke('download_and_install')
    } catch (error) {
      setDownloading(false)
      setStep('available')
      Toast.error(notifyError(error))
    }
  }

  const closeModal = (): void => {
    if (downloading || step === 'downloaded') {
      return
    }

    setVisible(false)
    setStep('idle')
  }

  const handleUpdateEvent = (event: DownloadEvent): void => {
    switch (event.event) {
      case 'available':
        setUpdateInfo(event.data)
        setProgress(EMPTY_PROGRESS)
        setDownloading(false)
        setStep('available')
        setVisible(true)
        break
      case 'not-available':
        setVisible(false)
        setStep('idle')
        Toast.info('当前已是最新版本')
        break
      case 'progress':
        setProgress(event.data)
        setDownloading(true)
        setStep('downloading')
        setVisible(true)
        break
      case 'downloaded':
        setUpdateInfo(event.data)
        setProgress(current => ({ ...current, percent: 100 }))
        setDownloading(false)
        setStep('downloaded')
        setVisible(true)
        break
      case 'error':
        setDownloading(false)
        setStep('available')
        Toast.error(`更新失败：${event.message}`)
        break
    }
  }

  return (
    <>
      <Button onClick={() => void checkUpdate()} loading={checking} disabled={downloading}>
        检查更新
      </Button>

      <Modal
        visible={visible}
        title="版本更新"
        okText={step === 'available' ? '立即更新' : '正在安装'}
        cancelText="暂不更新"
        closable={!downloading && step !== 'downloaded'}
        maskClosable={false}
        closeOnEsc={false}
        hasCancel={step === 'available'}
        confirmLoading={downloading || step === 'downloaded'}
        okButtonProps={{ disabled: step !== 'available' }}
        onOk={() => void downloadAndInstall()}
        onCancel={closeModal}
      >
        <div className="update-info">
          <div>
            <Text type="tertiary">最新版本</Text>
            <Text strong>{updateInfo?.version || '未知'}</Text>
          </div>
          <div>
            <Text type="tertiary">发布时间</Text>
            <Text>{formatDate(updateInfo?.releaseDate)}</Text>
          </div>
          {updateInfo?.releaseNotes ? (
            <div>
              <Text type="tertiary">更新内容</Text>
              <Text className="update-notes">{updateInfo.releaseNotes}</Text>
            </div>
          ) : null}
        </div>

        {step === 'downloading' || step === 'downloaded' ? (
          <div className="update-progress">
            <Progress percent={progressPercent} showInfo stroke="#1769e0" aria-label="更新下载进度" />
            <div className="update-progress-detail">
              <Text type="tertiary">{step === 'downloaded' ? '下载完成，正在启动安装' : `${progressPercent}%`}</Text>
            </div>
          </div>
        ) : null}
      </Modal>
    </>
  )
}

function formatDate(dateTime?: string): string {
  if (!dateTime) {
    return '未知'
  }

  return new Intl.DateTimeFormat('zh-CN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false
  })
    .format(new Date(dateTime))
    .replace(/[/]/g, '-')
}
