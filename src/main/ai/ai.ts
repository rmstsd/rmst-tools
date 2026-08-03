import { GoogleGenAI } from '@google/genai'
import { createOpenAI } from '@ai-sdk/openai'
import { generateText } from 'ai'
import { translationPrompt } from './prompt'

const ai = new GoogleGenAI({
  apiKey: 'sk-ant-api03--WCOnTXAm7951pVdey-SAhmNORDUEmTR8KGufKCQRLtGOh-nUKUS52U46LEpdUiFIlBMNxsHP7UmYX8WwPRPGA',
  httpOptions: {
    baseUrl: 'https://api.aicodemirror.ai/api/gemini' // 'https://api.claudecode.net.cn/api/gemini'
  }
})

export async function translate_g(text: string) {
  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    config: {
      systemInstruction: translationPrompt
    },
    contents: text
  })

  console.log(response)
  return response.text
}

// 百度 67Vw_d9o5pfiie2u2rnkpash0
export async function translate_b(text: string) {
  const response = await fetch('https://fanyi-api.baidu.com/ait/api/aiTextTranslate', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: 'Bearer 67Vw_d9o5pfiie2u2rnkpash0' },
    body: JSON.stringify({
      appid: '20230629001728461',
      reference: '使用程序员文档术语来翻译',
      from: 'en',
      to: 'zh',
      q: text
    })
  })

  if (!response.ok) {
    throw new Error(`请求失败：${response.status} ${await response.text()}`)
  }

  const data = await response.json()
  console.log(data.trans_result[0].dst)

  return data.trans_result[0].dst
}

export async function translate(text: string) {
  const deepseek = createOpenAI({
    baseURL: 'https://api.deepseek.com',
    apiKey: 'sk-cf5e6bd5439c4728a88acb39864541de'
  })

  const result = await generateText({
    model: deepseek.chat('deepseek-v4-flash'),
    system: translationPrompt,
    prompt: text,
    maxOutputTokens: 1024,
    maxRetries: 0
  })

  console.log(result.text)
  return result.text
}
