import path from 'node:path'

const rootPath = path.join(__dirname, '../')

const srcPath = path.join(rootPath, 'src')
const srcMainPath = path.join(srcPath, 'main')
const srcRendererPath = path.join(srcPath, 'renderer')

const releasePath = path.join(rootPath, 'release')
const appPath = path.join(releasePath, 'app')
const appPackagePath = path.join(appPath, 'package.json')
const appNodeModulesPath = path.join(appPath, 'node_modules')
const srcNodeModulesPath = path.join(srcPath, 'node_modules')

const outputPath = path.join(rootPath, 'output')
const outputMainPath = path.join(outputPath, 'main')
const outputRendererPath = path.join(outputPath, 'renderer')

console.log('outputMainPath', outputMainPath)

const buildPath = path.join(releasePath, 'build')

const webpackPaths = {
  rootPath,
  srcPath,
  srcMainPath,
  srcRendererPath,
  releasePath,
  appPath,
  appPackagePath,
  appNodeModulesPath,
  srcNodeModulesPath,
  outputPath,
  outputMainPath,
  outputRendererPath,
  buildPath
}

export default webpackPaths
