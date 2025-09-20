// useDialogObserver.ts
import { useDebounceFn, useMutationObserver } from '@vueuse/core'

export function useDialogObserver(callback: (el: HTMLElement) => void) {
  // デバウンス付きコールバック
  const debouncedCallback = useDebounceFn((el: HTMLElement) => {
    callback(el)
  }, 1) //1ms

  // body 全体を監視
  const observer = useMutationObserver(
    document.body,
    (mutations) => {
      for (const mutation of mutations) {
        if (mutation.type === 'childList') {
          mutation.addedNodes.forEach((node) => {
            if (
              node instanceof HTMLElement &&
              node.tagName === 'DIV' &&
              node.getAttribute('role') === 'dialog'
            ) {
              debouncedCallback(node)
            }
          })
        }
      }
    },
    {
      childList: true,
      subtree: true,
    }
  )

  return {
    stop: observer.stop, // 監視を停止したいとき用
  }
}
