import path from 'node:path'
import wpkPaths from './wpk.paths'
import webpack from 'webpack'

export function clearConsole() {
  process.stdout.write(process.platform === 'win32' ? '\x1B[2J\x1B[0f' : '\x1B[2J\x1B[3J\x1B[H')
}

export function getWebpackResolveAlias(): webpack.ResolveOptions['alias'] {
  return {
    '@common': path.resolve(wpkPaths.srcPath, 'common/'),
    '@main': wpkPaths.srcMainPath,
    '@renderer': wpkPaths.srcRendererPath
  }
}
