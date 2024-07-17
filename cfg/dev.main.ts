import webpack from 'webpack'
import config from './wpk.main'
import picocolors from 'picocolors'

export function buildMain() {
  console.log(picocolors.blue('main start build'))

  return new Promise((resolve, reject) => {
    webpack(config, (err, stats) => {
      if (err || (stats && stats.hasErrors())) {
        console.error('err')
      }

      console.log(picocolors.green('main build success'))

      resolve(undefined)
    })
  })
}
