import path from 'node:path'
import wpkPaths from './wpk.paths'
import webpack from 'webpack'

export function getWebpackResolveAlias(): webpack.ResolveOptions['alias'] {
  return {
    '@common': path.resolve(wpkPaths.srcPath, 'common/'),
    '@main': wpkPaths.srcMainPath,
    '@renderer': wpkPaths.srcRendererPath
  }
}
