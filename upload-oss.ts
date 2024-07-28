import COS from 'cos-nodejs-sdk-v5'
import { createReadStream } from 'fs-extra'

import { SecretId, SecretKey } from './sk'

const cos = new COS({ SecretId, SecretKey })

// cos.getService({ Region: 'ap-nanjing' }, function (err, data) {
//   console.log(err || data)
//   console.log(data.Buckets)
// })

const Bucket = 'rmst-tools-1301117996' /* 必须 */
const Region = 'ap-nanjing' /* 必须 */

cos
  .uploadFiles({
    files: [
      { Bucket, Region, Key: 'package.json', FilePath: './package.json' },
      { Bucket, Region, Key: 'tsconfig.node.json', FilePath: './tsconfig.node.json' }
    ]
  })
  .then(res => {
    console.log(res)
  })

// cos.putObject(
//   {
//     Bucket: 'rmst-tools-1301117996' /* 必须 */,
//     Region: 'ap-nanjing' /* 必须 */,
//     Key: 'tsconfig.node.json' /* 必须 */,
//     Body: createReadStream('./tsconfig.node.json') // 上传文件对象
//   },
//   function (err, data) {
//     console.log(err || data)
//   }
// )
