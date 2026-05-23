import { app } from 'electron'
import { mkdirSync, readFileSync, writeFileSync } from 'node:fs'
import { dirname, join } from 'node:path'

export const STORE_KEYS = {
  setting: 'setting',
  commands: 'commands',
  historyOpenedUrls: 'historyOpenedUrls'
} as const

let storePath = ''
let cache: Record<string, unknown> = {}

export function initStore(): void {
  storePath = join(app.getPath('userData'), 'store.json')
  mkdirSync(dirname(storePath), { recursive: true })

  try {
    cache = JSON.parse(readFileSync(storePath, 'utf-8')) as Record<string, unknown>
  } catch {
    cache = {}
    persist()
  }
}

export function getStoreValue<T>(key: string, fallback: T): T {
  if (Object.hasOwn(cache, key)) {
    return cache[key] as T
  }

  return fallback
}

export function setStoreValue<T>(key: string, value: T): void {
  cache[key] = value
  persist()
}

export function deleteStoreValue(key: string): void {
  delete cache[key]
  persist()
}

function persist(): void {
  if (!storePath) {
    return
  }

  writeFileSync(storePath, `${JSON.stringify(cache, null, 2)}\n`, 'utf-8')
}
