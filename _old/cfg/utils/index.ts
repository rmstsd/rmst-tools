import path from 'node:path'
import { Rspack } from '@rsbuild/core'
import fse from 'fs-extra'

import wpkPaths from './wpk.paths'

export function getWebpackResolveAlias(): Rspack.ResolveAlias {
  return {
    '@common': path.resolve(wpkPaths.srcPath, 'common/'),
    '@main': wpkPaths.srcMainPath,
    '@renderer': wpkPaths.srcRendererPath
  }
}

export function cleanDistDir() {
  fse.removeSync(path.join(wpkPaths.rootPath, 'dist'))
}

export function getElectronPath(): string {
  let electronExecPath = process.env.ELECTRON_EXEC_PATH || ''
  if (!electronExecPath) {
    const electronModulePath = path.dirname(require.resolve('electron'))
    const pathFile = path.join(electronModulePath, 'path.txt')
    let executablePath
    if (fse.existsSync(pathFile)) {
      executablePath = fse.readFileSync(pathFile, 'utf-8')
    }
    if (executablePath) {
      electronExecPath = path.join(electronModulePath, 'dist', executablePath)
      process.env.ELECTRON_EXEC_PATH = electronExecPath
    }
  }

  // console.log('electronExecPath', electronExecPath)
  return electronExecPath
}
