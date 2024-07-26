import cac from 'cac'
import { dev } from './scripts/dev'
import { build } from './scripts/build'

const cli = cac()

cli
  .command('dev', '启动开发环境')
  .option('--mode <mode>', '[string] 设置当前环境', { default: 'development' })
  .action((dir, options) => {
    console.log('启动开发环境')
    console.log(dir, options)

    dev()
  })

cli
  .command('build', '打包构建')
  .option('--mode <mode>', '[string] 设置当前环境', { default: 'production' })
  .action((dir, options) => {
    console.log('打包构建')
    console.log(dir, options)

    build()
  })

cli.version('0.0.0')

const parsed = cli.parse()
