import { loadEnv as rsLoadEnv } from '@rsbuild/core'
import wpkPaths from './utils/wpk.paths'

export function loadEnv(mode: string) {
  const { parsed } = rsLoadEnv({ cwd: wpkPaths.envPath, mode: mode })

  const parsedWithProcess = Object.keys(parsed).reduce((acc, item) => {
    return { ...acc, [`process.env.${item}`]: JSON.stringify(parsed[item]) }
  }, {})

  return { parsed, parsedWithProcess }
}
