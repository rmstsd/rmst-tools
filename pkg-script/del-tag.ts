import { sync as spawnSync } from 'cross-spawn'

delTag()

function delTag() {
  synchronizeLocalTagFromRemote()

  const pc = spawnSync('git', ['tag', '--list'])
  const tagList = pc.stdout.toString().split('\n').filter(Boolean)
  console.log('tagList', tagList)

  const maxTag = getMaxVersion(tagList)
  console.log('maxTag', maxTag)

  const deleted = tagList.filter(item => item !== maxTag)
  console.log('deleted', deleted)

  // spawnSync('git', ['tag', '-d'].concat(deleted)) // 删除本地

  if (deleted.length) {
    spawnSync('git', ['push', 'origin', '--delete', 'tag'].concat(deleted), { stdio: 'inherit' }) // 删除远程
  }

  synchronizeLocalTagFromRemote()

  // git tag -d v1.0.9 v1.0.6
  // git push origin --delete tag v1.0.9
}

function synchronizeLocalTagFromRemote() {
  // 将远程仓库中的 tag 信息同步到本地, 并删除本地已经不存在的 tag
  spawnSync('git', 'fetch --prune --prune-tags --tags'.split(' '), { stdio: 'inherit' })
}

function getMaxVersion(versionList: string[]) {
  // 首先去掉空字符串
  const versions = versionList.filter(v => v !== '')

  // 将版本号转换为数字数组
  const versionNums = versions.map(v => {
    const parts = v.slice(1).split('.').map(Number)
    return parts.reduce((acc, cur, i) => acc * 100 + cur * Math.pow(10, 2 - i), 0)
  })

  // 找到最大值的索引
  const maxIndex = versionNums.indexOf(Math.max(...versionNums))

  // 返回最大版本号
  return versions[maxIndex]
}
