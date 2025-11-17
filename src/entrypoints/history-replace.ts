export default defineUnlistedScript(async () => {
  const origPushState = history.pushState
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  history.pushState = function (state, title, url) {
    try {
      if (url) {
        // 現在のパスと比較
        const current = new URL(location.href)
        const next = new URL(url, location.origin)

        if (current.pathname === next.pathname) {
          /**
           * ブラウザの履歴にも残らないように変更
           * ブラウザの履歴に残したい場合はreplaceStateをしておく
           * //return history.replaceState(state, title, url)
           */
          //return history.replaceState(state, title, url)
          return
        }
      }
    }
    catch (e) {
      console.warn('pushState フック中にエラー:', e)
    }
    // @ts-expect-error ...
    // eslint-disable-next-line prefer-rest-params
    return origPushState.apply(this, arguments)
  }
})