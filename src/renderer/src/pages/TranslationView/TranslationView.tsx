import { useState } from 'react'
import { Button, TextArea } from '@douyinfe/semi-ui'
import { IconCopy, IconLanguage } from '@douyinfe/semi-icons'
import { invoke } from '@renderer/api'
import { WindowTitleBar } from '@renderer/components/WindowTitleBar'
import './TranslationView.less'

export function TranslationView() {
  const [sourceText, setSourceText] = useState('')
  const [translatedText, setTranslatedText] = useState('')
  const [translating, setTranslating] = useState(false)
  const [translationDuration, setTranslationDuration] = useState<number | null>(null)

  const translate = async (): Promise<void> => {
    if (translating) {
      return
    }

    const startTime = performance.now()
    setTranslating(true)
    setTranslationDuration(null)

    try {
      const result = await invoke('Translate_Text', { text: sourceText })
      setTranslatedText(result)
    } finally {
      setTranslationDuration(performance.now() - startTime)
      setTranslating(false)
    }
  }

  const formattedDuration =
    translationDuration === null
      ? null
      : translationDuration < 1000
        ? `${Math.round(translationDuration)} ms`
        : `${(translationDuration / 1000).toFixed(2)} s`

  const copyTranslation = async (): Promise<void> => {
    if (!translatedText) {
      return
    }

    await navigator.clipboard.writeText(translatedText)
  }

  return (
    <>
      <WindowTitleBar />
      <main className="translation-view">
        <section className="translation-content">
          <TextArea value={sourceText} placeholder={`输入内容...`} resize="none" onChange={setSourceText} />

          <Button
            className="translation-submit"
            theme="solid"
            type="primary"
            icon={<IconLanguage />}
            loading={translating}
            onClick={() => void translate()}
          />

          <TextArea value={translatedText} placeholder="翻译结果将显示在这里..." readonly resize="none" rows={6} />

          <footer className="translation-footer drag-region">
            {formattedDuration && <span className="translation-duration">翻译耗时：{formattedDuration}</span>}
            <Button
              theme="borderless"
              type="tertiary"
              icon={<IconCopy />}
              disabled={!translatedText}
              onClick={() => copyTranslation()}
            />
          </footer>
        </section>
      </main>
    </>
  )
}
