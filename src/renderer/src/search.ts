import type { DirNamesTree } from './types'

export interface HighlightChunk {
  start: number
  end: number
  highLight: boolean
}

export function searchProjects(dirNames: DirNamesTree[], keyword: string): string[] {
  if (!keyword) {
    return []
  }

  return dirNames
    .filter((item) => item.children.some((name) => fuzzyMatch(name, keyword)))
    .flatMap((item) =>
      item.children
        .filter((name) => fuzzyMatch(name, keyword))
        .map((name) => joinProjectPath(item.name, name))
    )
}

export function findPosIndexList(keyword: string, data: string): number[] {
  const lowerKeyword = keyword.toLowerCase()
  const lowerData = data.toLowerCase()
  const positions: number[] = []
  const keywordArray = lowerKeyword.split('')

  let dataIndex = 0
  while (dataIndex < lowerData.length) {
    if (lowerData.charAt(dataIndex) === keywordArray[0]) {
      positions.push(dataIndex)
      keywordArray.shift()
    }

    dataIndex += 1
  }

  return keywordArray.length === 0 ? positions : []
}

export function findAllChunks(positions: number[], data: string): HighlightChunk[] {
  const ranges: { start: number; end: number }[] = []

  for (const position of positions) {
    const previous = ranges.at(-1)
    if (!previous) {
      ranges.push({ start: position, end: position + 1 })
    } else if (position === previous.end) {
      previous.end += 1
    } else {
      ranges.push({ start: position, end: position + 1 })
    }
  }

  const chunks: HighlightChunk[] = []
  let lastIndex = 0

  for (const range of ranges) {
    appendChunk(chunks, lastIndex, range.start, false)
    appendChunk(chunks, range.start, range.end, true)
    lastIndex = range.end
  }

  appendChunk(chunks, lastIndex, data.length, false)
  return chunks
}

function fuzzyMatch(originValue: string, keyword: string): boolean {
  return findPosIndexList(keyword, originValue).length > 0
}

function appendChunk(
  chunks: HighlightChunk[],
  start: number,
  end: number,
  highLight: boolean
): void {
  if (end - start > 0) {
    chunks.push({ start, end, highLight })
  }
}

function joinProjectPath(rootPath: string, childName: string): string {
  const separator = rootPath.includes('\\') ? '\\' : '/'
  return `${rootPath.replace(/[\\/]+$/, '')}${separator}${childName}`
}
