export default defineUnlistedScript(async () => {
  const origPushState = history.pushState
  history.pushState = function (state, title, url) {
    try {
      if (url) {
        // 現在のパスと比較
        const current = new URL(location.href)
        const next = new URL(url, location.origin)

        if (current.pathname === next.pathname) {
          return history.replaceState(state, title, url)
        }
      }
    }
    catch (e) {
      console.warn('pushState フック中にエラー:', e)
    }
    return origPushState.apply(this, arguments)
  }
})