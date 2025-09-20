import { ContentScriptContext } from '#imports'
import UserButtons from '@/components/external/UserButtons.vue'
import { PreAnalyzedTogetterComment } from '@/utils/getComment'

export default function (
  comment: PreAnalyzedTogetterComment,
  ctx: ContentScriptContext,
  init: () => void,
  upsertId: (name: string) => void
) {
  const { insertElm, authorId: id } = comment
  if (!insertElm) return
  // appendがlastなので探すのは子孫のみ、兄弟要素に追加した時は別ロジックが必要
  const alreadySetup = insertElm.querySelector('#WXT-FIELD') !== null
  if (alreadySetup) return

  //**
  // ContentScriptContextを使うやつ
  // */

  const ui = createIntegratedUi(ctx, {
    position: 'inline',
    anchor: insertElm,
    append: 'last', // 追加の仕方でこのelmを後で探す方法が変わるので注意 last, firstはchildを探せばいいので簡単
    onMount: (container) => {
      return createApp(UserButtons, {
        upsertId,
        id,
        onIgnoreAdd: () => init(),
      }).mount(container)
    },
  })
  ui.mount()
}