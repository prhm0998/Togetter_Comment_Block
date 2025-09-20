/**
 * 指定要素の子要素を監視し、新しいコメントを処理する ※子要素の指定にタグ必須
 */

// 実装本体（index?: number で両方をカバー）
export default function useWatchComment(
  targetElement: HTMLElement,
  targetTag: string,
  callback: (element: HTMLElement, index?: number) => void
): MutationObserver {
  // 初期状態の子要素を処理
  targetElement.querySelectorAll(targetTag).forEach((el, index) => {
    callback(el as HTMLElement, index) // indexは渡しても、使わない関数なら無視される
  })

  let index = 0
  const observer = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
      mutation.addedNodes.forEach((node) => {
        if (node instanceof HTMLElement && node.tagName.toLowerCase() === targetTag) {
          // DOM上の順序を index として取得
          Array.from(targetElement.querySelectorAll(targetTag)).indexOf(node)
          callback(node, ++index)
        }
      })
    })
  })

  observer.observe(targetElement, { childList: true })
  return observer
}
