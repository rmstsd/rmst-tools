import fs from 'node:fs'
import path from 'node:path'
import { parse } from 'dotenv'
import { expand } from 'dotenv-expand'

const isWindows = typeof process !== 'undefined' && process.platform === 'win32'
const windowsSlashRE = /\\/g
export function slash(p: string): string {
  return p.replace(windowsSlashRE, '/')
}

function tryStatSync(file: string): fs.Stats | undefined {
  try {
    // The "throwIfNoEntry" is a performance optimization for cases where the file does not exist
    return fs.statSync(file, { throwIfNoEntry: false })
  } catch {
    // Ignore errors
  }
}
function normalizePath(id: string): string {
  return path.posix.normalize(isWindows ? slash(id) : id)
}

function getEnvFilesForMode(mode: string, envDir: string): string[] {
  return [`.env`, `.env.${mode}`].map(file => normalizePath(path.join(envDir, file)))
}

export function loadEnv(mode: string, envDir: string): Record<string, string> {
  const envFiles = getEnvFilesForMode(mode, envDir)

  const parsed = Object.fromEntries(
    envFiles.flatMap(filePath => {
      if (!tryStatSync(filePath)?.isFile()) {
        return []
      }

      return Object.entries(parse(fs.readFileSync(filePath)))
    })
  )

  return parsed
}
