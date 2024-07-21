import picocolors from 'picocolors'
import { webpack } from 'webpack'

import wpkRendererProd from '../wpk.renderer.prod'
import wpkMainProdConfig from '../wpk.main.prod'
import wpkPreloadProdConfig from '../wpk.preload.prod'

buildApp()

async function buildApp() {
  buildRenderer()
  buildPreload()
  buildMain()
}

function buildRenderer() {
  const compiler = webpack(wpkRendererProd)
  return new Promise((resolve, reject) => {
    compiler.run((err, stats) => {
      if (!err) {
        resolve(undefined)
      }
    })
  })
}

function buildPreload() {
  const compiler = webpack(wpkPreloadProdConfig)
  return new Promise((resolve, reject) => {
    compiler.run((err, stats) => {
      if (!err) {
        resolve(undefined)
      }
    })
  })
}

function buildMain() {
  const compiler = webpack(wpkMainProdConfig)
  return new Promise((resolve, reject) => {
    compiler.run((err, stats) => {
      if (!err) {
        resolve(undefined)
      }
    })
  })
}
