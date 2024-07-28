import path from 'node:path'

const rootPath = path.join(__dirname, '../../')

const srcPath = path.join(rootPath, 'src')
const srcMainPath = path.join(srcPath, 'main')
const srcPreloadPath = path.join(srcPath, 'preload')
const srcRendererPath = path.join(srcPath, 'renderer')

const releasePath = path.join(rootPath, 'release')
const appPath = path.join(releasePath, 'app')
const appPackagePath = path.join(appPath, 'package.json')
const appNodeModulesPath = path.join(appPath, 'node_modules')
const srcNodeModulesPath = path.join(srcPath, 'node_modules')

const outputPath = path.join(rootPath, 'out')
const outputMainPath = path.join(outputPath, 'main')
const outputPreloadPath = path.join(outputPath, 'preload')
const outputRendererPath = path.join(outputPath, 'renderer')

const buildPath = path.join(releasePath, 'build')

const envPath = path.join(rootPath, 'env')

const wpkPaths = {
  rootPath,
  srcPath,
  srcMainPath,
  srcPreloadPath,
  srcRendererPath,
  releasePath,
  appPath,
  appPackagePath,
  appNodeModulesPath,
  srcNodeModulesPath,
  outputPath,
  outputMainPath,
  outputPreloadPath,
  outputRendererPath,
  buildPath,
  envPath
}

export default wpkPaths
