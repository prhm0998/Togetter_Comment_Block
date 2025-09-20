// composables/useUrlChangeObserver.ts
import { useDebounceFn } from '@vueuse/core'

/**
 * URLの変更を検知し、指定されたコールバック関数を実行するフック
 * @param callback URL変更時に実行する関数
 * @returns MutationObserver インスタンス。監視を停止するために使用。
 */
export default function useUrlChangeObserver(callback: () => void) {
  let prevHref = location.href // 現在のURLを初期値として設定

  // コールバック関数をデバウンスします。
  // 300ミリ秒以内に複数回URLが変更されても、最後の変更から300ミリ秒後に1度だけ実行されます。
  const run = useDebounceFn(() => {
    // 現在のURLが前回のURLと異なる場合のみ実行
    if (prevHref !== location.href) {
      prevHref = location.href // URLを更新
      callback() // コールバック関数を実行
    }
  }, 300)

  // DOMの変更を監視する MutationObserver を作成
  const urlObserver = new MutationObserver(() => {
    run() // デバウンスされた関数を実行
  })

  // ドキュメント全体の子要素とサブツリーの変更を監視開始
  urlObserver.observe(document, { childList: true, subtree: true })

  // 監視を停止するために、オブザーバーインスタンスを返します
  return urlObserver
}