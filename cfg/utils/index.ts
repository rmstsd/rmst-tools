import path from 'node:path'
import wpkPaths from './wpk.paths'
import webpack from 'webpack'
import { ResolveAlias } from '@rspack/core'

export function getWebpackResolveAlias(): ResolveAlias {
  return {
    '@common': path.resolve(wpkPaths.srcPath, 'common/'),
    '@main': wpkPaths.srcMainPath,
    '@renderer': wpkPaths.srcRendererPath
  }
}
