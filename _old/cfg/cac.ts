import cac from 'cac'

import dev from './scripts/dev'
import build from './scripts/build'

const cli = cac()

cli
  .command('dev', '启动开发环境')
  .option('--mode <mode>', '[string] 设置当前环境', { default: 'development' })
  .action(options => {
    console.log('启动开发环境 options', options)

    dev(options)
  })

cli
  .command('build', '打包构建')
  .option('--mode <mode>', '[string] 设置当前环境', { default: 'production' })
  .action(options => {
    console.log('打包构建 打包构建', options)

    build(options)
  })

cli.version('0.0.0')
cli.help()
cli.parse()
