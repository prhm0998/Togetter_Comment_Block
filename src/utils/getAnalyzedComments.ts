export interface AnalyzedTogetterComment extends PreAnalyzedTogetterComment {
  currentCount: number
  totalCount: number
  responseIdIndexes: string[]
}

/**
 * authorIdごとの totalCount を計算
 */
function buildTotalCountMap(comments: PreAnalyzedTogetterComment[]): Map<string, number> {
  const totalCountMap = new Map<string, number>()
  for (const c of comments) {
    totalCountMap.set(c.authorId, (totalCountMap.get(c.authorId) ?? 0) + 1)
  }
  return totalCountMap
}

/**
 * currentCount を更新しつつ返す
 */
function getCurrentCount(
  authorId: string,
  currentCountMap: Map<string, number>
): number {
  const prev = currentCountMap.get(authorId) ?? 0
  const current = prev + 1
  currentCountMap.set(authorId, current)
  return current
}

/**
 * 自身より後ろのコメントから responseIdIndexes を計算
 */
function findResponseIdIndexes(
  comments: PreAnalyzedTogetterComment[],
  authorId: string,
  startIndex: number
): string[] {
  const result: string[] = []
  for (let j = startIndex + 1; j < comments.length; j++) {
    if (comments[j].commentBody.mentions.includes(authorId)) {
      result.push(comments[j].authorId)
    }
  }
  return result
}

/**
 * メイン関数
 */
export default function analyzeComments(
  comments: PreAnalyzedTogetterComment[]
): AnalyzedTogetterComment[] {
  const totalCountMap = buildTotalCountMap(comments)
  const currentCountMap = new Map<string, number>()

  return comments.map((comment, i) => {
    const currentCount = getCurrentCount(comment.authorId, currentCountMap)
    const responseIdIndexes = findResponseIdIndexes(comments, comment.authorId, i)

    return {
      ...comment,
      currentCount,
      totalCount: totalCountMap.get(comment.authorId) ?? 0,
      responseIdIndexes,
    }
  })
}
