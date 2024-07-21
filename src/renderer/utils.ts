// 返回 path 的 d属性
const calcD = (radius: number, startAngle: number, endAngle: number, cx: number, cy: number) => {
  //角度转弧度
  function d2a(angle: number) {
    return (angle * Math.PI) / 180
  }

  //根据角度求坐标
  function point(angle: number) {
    return {
      x: cx + radius * Math.sin(d2a(angle)),
      y: cy - radius * Math.cos(d2a(angle))
    }
  }

  const arr: any[] = []

  const { x: x1, y: y1 } = point(startAngle)
  arr.push(`M ${cx} ${cy} L ${x1} ${y1}`)

  const { x: x2, y: y2 } = point(endAngle)
  arr.push(`A ${radius} ${radius} 0 0 1 ${x2} ${y2}`)
  arr.push('Z')

  const d = arr.join(' ')

  return { x1, y1, x2, y2, d }
}

export const svgWidth = 400
export const svgHeight = 400

export const calcPaths = list => {
  const centerX = svgWidth / 2
  const centerY = svgHeight / 2
  const radius = svgWidth / 2

  const perAngle = 360 / list.length

  const paths = list.map((item, index) => {
    const startAngle = index * perAngle
    const endAngle = startAngle + perAngle

    const { x1, y1, x2, y2, d } = calcD(radius, startAngle, endAngle, centerX, centerY)

    // 从圆心向四周作垂线 取四个点
    const c_p1 = { x: centerX, y: centerY - radius }
    const c_p2 = { x: centerX + radius, y: centerY }
    const c_p3 = { x: centerX, y: centerY + radius }
    const c_p4 = { x: centerX - radius, y: centerY }

    const x_min = Math.min(centerX, x1, x2)
    const y_min = Math.min(centerY, y1, y2)

    const x_max = Math.max(centerX, x1, x2)
    const y_max = Math.max(centerY, y1, y2)

    //     {x=r/2cosθ/2
    // {y=r/2sinθ/2

    Math.cos(endAngle - startAngle)

    return { ...item, d, rectCenter: { x: (x1 + x2) / 2, y: (y1 + y2) / 2 } }
  })

  return paths
}

export const defaultList = [
  {
    title: '谷歌',
    home: 'https://www.google.com.hk/webhp?hl=zh-CN',
    searchLink: 'https://www.google.com.hk/search?safe=strict&hl=zh-CN&q=',
    shortcutWd: ['gg']
  },
  {
    title: '百度',
    home: 'https://www.baidu.com/',
    searchLink: 'https://www.baidu.com/s?wd=',
    shortcutWd: ['bd']
  },
  {
    title: '掘金',
    home: 'https://juejin.cn/',
    searchLink: 'https://juejin.cn/search?query=',
    shortcutWd: ['jj']
  },
  {
    title: 'B站',
    home: 'https://www.bilibili.com/',
    searchLink: 'https://search.bilibili.com/all?keyword=',
    shortcutWd: ['bb', 'bz']
  },
  {
    title: '知乎',
    home: 'https://www.zhihu.com/',
    searchLink: 'https://www.zhihu.com/search?type=content&q=',
    shortcutWd: ['zh']
  },
  {
    title: 'npm',
    home: 'https://www.npmjs.com',
    searchLink: 'https://www.npmjs.com/search?q=',
    shortcutWd: ['npm']
  },
  {
    title: 'mdn',
    home: 'https://developer.mozilla.org/zh-CN/',
    searchLink: 'https://developer.mozilla.org/zh-CN/search?q=',
    shortcutWd: ['mdn']
  }
]
