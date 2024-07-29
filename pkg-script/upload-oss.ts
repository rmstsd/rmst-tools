import COS, { UploadFileItemParams } from 'cos-nodejs-sdk-v5'
import fse, { createReadStream, fstatSync, readJsonSync } from 'fs-extra'
import path from 'path'

// import { SecretId, SecretKey } from './sk.local' // 本地测试使用 sk 文件被 git 忽略

type Platform = 'win' | 'mac'
type ReleaseEnv = 'test' | 'prod'

const [si, sk, platform, env] = process.argv.slice(2) as [string, string, Platform, ReleaseEnv]

const cos = new COS({ SecretId: si, SecretKey: sk })

const Bucket = 'rmst-tools-1301117996'
const Region = 'ap-nanjing'

const envDir: ReleaseEnv = env ?? 'test'
const platformDir: Platform = platform ?? 'win'

const version = readJsonSync('./package.json').version
const latest = 'latest'

const distPath = path.join(__dirname, '../dist')

const upDir = [envDir, platformDir].join('/')

bootstrap()

async function bootstrap() {
  await deleteLatestDirFiles()

  console.log('upload')

  const filesName = fse.readdirSync(distPath).filter(item => {
    if (fse.statSync(path.join(distPath, item)).isDirectory()) {
      return false
    }
    if (item === 'latest.yml') {
      return true
    }
    const reg = /\.exe(\.blockmap)?$/
    return reg.test(item)
  })

  const files: UploadFileItemParams[] = []
  filesName.forEach(item => {
    const upItemEnvDir: UploadFileItemParams = {
      Bucket,
      Region,
      Key: path.join(upDir, version, item).replaceAll('\\', '/'),
      FilePath: path.join(distPath, item)
    }
    const upItemLatestDir: UploadFileItemParams = {
      Bucket,
      Region,
      Key: path.join(upDir, latest, item).replaceAll('\\', '/'),
      FilePath: path.join(distPath, item)
    }
    files.push(upItemEnvDir, upItemLatestDir)
  })

  cos
    .uploadFiles({
      files,
      onProgress: ({ percent }) => {
        console.log('整体 percent', percent)
      }
    })
    .then(res => {
      console.log('上传完毕')
    })
}

async function deleteLatestDirFiles(marker = undefined) {
  const Prefix = `${upDir}/latest/`

  const listResult = await cos.getBucket({ Bucket, Region, Prefix })
  var nextMarker = listResult.NextMarker
  var objects = listResult.Contents.map(item => ({ Key: item.Key })).filter(item => !item.Key.endsWith('/'))

  if (!objects.length) {
    return
  }

  await cos.deleteMultipleObject({ Bucket, Region, Objects: objects }).then(deleteResult => {
    if (listResult.IsTruncated === 'true') {
      deleteLatestDirFiles(nextMarker)
    } else {
      console.log('delete complete')
    }
  })

  console.log('deleteLatestDirFiles end')
}
