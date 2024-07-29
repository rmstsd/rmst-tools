import COS, { UploadFileItemParams } from 'cos-nodejs-sdk-v5'
import fse, { createReadStream, fstatSync, readJsonSync } from 'fs-extra'

import { SecretId, SecretKey } from './sk'
import path from 'path'

const cos = new COS({ SecretId, SecretKey })

// cos.getService({ Region: 'ap-nanjing' }, function (err, data) {
//   console.log(err || data)
//   console.log(data.Buckets)
// })

const envDir = 'test'
const version = readJsonSync('./package.json').version
const latest = 'latest'

const Bucket = 'rmst-tools-1301117996' /* 必须 */
const Region = 'ap-nanjing' /* 必须 */

const distPath = path.join(__dirname, 'dist')

bootstrap()

async function bootstrap() {
  await deleteFiles()

  console.log('upload')

  const filesName = fse.readdirSync(distPath).filter(item => {
    if (fse.statSync(path.join(distPath, item)).isDirectory()) {
      return false
    }
    if (item === 'latest.yml') {
      return true
    }
    // const reg = /\.exe(\.blockmap)?$/
    // return reg.test(item)
  })

  const files: UploadFileItemParams[] = []

  filesName.forEach(item => {
    const upItemEnvDir: UploadFileItemParams = {
      Bucket,
      Region,
      Key: path.join(envDir, version, item).replaceAll('\\', '/'),
      FilePath: path.join(distPath, item)
    }

    const upItemLatestDir: UploadFileItemParams = {
      Bucket,
      Region,
      Key: path.join(envDir, latest, item).replaceAll('\\', '/'),
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
      console.log(res)
    })
}

function deleteFiles(marker = undefined) {
  return cos.getBucket({ Bucket, Region, Prefix: 'test/latest/' }).then(listResult => {
    var nextMarker = listResult.NextMarker
    var objects = listResult.Contents.map(item => ({ Key: item.Key })).filter(item => !item.Key.endsWith('/'))

    if (!objects.length) {
      return
    }

    cos.deleteMultipleObject({ Bucket, Region, Objects: objects }).then(deleteResult => {
      if (listResult.IsTruncated === 'true') {
        deleteFiles(nextMarker)
      } else {
        console.log('delete complete')
      }
    })
  })
}
