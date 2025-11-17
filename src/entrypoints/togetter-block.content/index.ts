import { getHostOnlyPattern, isMatchPattern, sleep } from '@prhm0998/shared/utils'

import { setContentScriptContext } from '@/composables/useContentScriptContext'

import App from './App.vue'

const matchesOriginal = [
  '*://togetter.com/li/*',
  '*://posfie.com/*/p/*',
]

export default defineContentScript({
  // ここではサイトの指定のみ
  matches: matchesOriginal.map(getHostOnlyPattern).filter((v): v is string => v != null),
  async main(ctx) {
    // 完全なpatternでマッチさせる
    const isMatch = isMatchPattern(matchesOriginal, location.href, {
      processUrl: true,
    })
    if (!isMatch) return

    setContentScriptContext(ctx)

    const { state } = useUserOption()

    // 履歴の改変処理を非同期で読み込む
    sleep(1).then(async () => {
      if (state.value.useReplaceHistory) {
        await injectScript('/history-replace.js', { keepInDom: true })
      }
    })

    const ui = createIntegratedUi(ctx, {
      position: 'inline',
      anchor: 'body',
      onMount: (container) => {
        const app = createApp(App, {
          ctx,
        })
        app.mount(container)
        return app
      },
      onRemove: (app) => {
        if (app) {
          app.unmount()
        }
      },
    })
    ui.mount()
  },
})
