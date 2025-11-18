// useBaseCommentManager.ts
import { isEqual } from 'ohash'

import ExternalUi from '@/components/external/ExternalUi.vue'
import { useContentScriptContext } from '@/composables/useContentScriptContext'

export interface CommentStateBase {
  el: HTMLElement
  id: string
  message: string
  mentions: string[]
  prevJudge?: CommentJudgeResult
  app?: ReturnType<typeof createApp> | null
}

export interface CommentState extends CommentStateBase {
  idCountCurrent: number
  idCountTotal: number
}

export interface CommentJudgeResult {
  ignored: boolean
  byId: boolean
  bySessionId: boolean
  byWord: boolean
  byMention: boolean
}

/**
 * T: CommentStateBase / CommentState などを利用可能
 */
export function useCommentManagerBase<T extends {
  el: HTMLElement
  id: string
  message: string
  mentions: string[]
  prevJudge?: CommentJudgeResult
  app?: ReturnType<typeof createApp> | null
}>() {

  // ========= 共通 state =========
  const comments = reactive<T[]>([]) as T[]
  const hoverHandlers = new WeakMap<
    HTMLElement,
    { onEnter: () => void, onLeave: () => void }
  >()

  const { state: userOption } = useUserOption()
  const { state: ignoreId, upsert: upsertId } = useIgnore('local:Id')
  const { state: ignoreSessionId, upsert: upsertSessionId } = useIgnore('session:Id')
  const { state: ignoreWord } = useIgnore('local:Word')
  const { isIgnoredWord } = useIgnoreWordsReg(ignoreWord, userOption)
  const ctx = useContentScriptContext()

  // ========= mount =========

  const mountButton = (el: HTMLElement, state: T) => {
    let appInstance: ReturnType<typeof createApp> | null = null

    const ui = createIntegratedUi(ctx, {
      position: 'inline',
      anchor: el,
      append: 'last',
      onMount: (container) => {
        appInstance = createApp(ExternalUi, {
          state,
          onClick: () => upsertId(state.id),
        })
        appInstance.mount(container)
        return appInstance
      },
      onRemove: (app) => {
        if (app) {
          app.unmount()
        }
      },
    })

    ui.mount()
    return appInstance
  }

  // ========= 判定 =========

  const judgeComment = (comment: T): CommentJudgeResult => {
    const byId = ignoreId.value.has(comment.id)
    const bySessionId = ignoreSessionId.value.has(comment.id)
    const byWord = isIgnoredWord(comment.message)
    const byMention = comment.mentions.some(
      (id) => ignoreId.value.has(id) || ignoreSessionId.value.has(id)
    )

    return {
      ignored: byId || bySessionId || byWord || byMention,
      byId,
      bySessionId,
      byWord,
      byMention,
    }
  }

  const handleSensitiveUpsert = (
    id: string,
    isPermanent: boolean,
    isTemporary: boolean
  ) => {
    if (isPermanent) upsertId(id)
    else if (isTemporary) upsertSessionId(id)
  }

  const commentStyling = (el: HTMLElement, ignored: boolean) => {

    const existing = hoverHandlers.get(el)
    if (existing) {
      el.removeEventListener('mouseover', existing.onEnter)
      el.removeEventListener('mouseout', existing.onLeave)
    }

    // --- 2. ignored ではない場合 → 完全通常表示で終了 ---
    if (!ignored || !userOption.value.enabled) {
      el.style.opacity = ''
      el.style.display = ''
      return
    }

    // --- 3. ignored かつ enabled = true の場合の処理 ---

    // hover 表示を使う場合
    if (userOption.value.useShowOnHover) {
      el.style.display = ''
      el.style.opacity = '0.05'

      // 新しい hover ハンドラを登録
      const onEnter = () => {
        el.style.opacity = '1'
        el.style.display = ''
      }

      const onLeave = () => {
        el.style.opacity = '0.05'
        el.style.display = ''
      }

      el.addEventListener('mouseover', onEnter)
      el.addEventListener('mouseout', onLeave)
      hoverHandlers.set(el, { onEnter, onLeave })

      return
    }

    // hover 表示を使わない場合（完全非表示）
    el.style.display = 'none'
    el.style.opacity = ''
  }

  const bannedProcess = (comment: T, judge: CommentJudgeResult) => {
    const opt = userOption.value
    const { id, el } = comment
    const { ignored, byId, byWord, byMention } = judge

    const isHidden = opt.enabled && ignored
    commentStyling(el, isHidden)

    if (byId) upsertId(id)
    //if (bySessionId) upsertSessionId(id)
    if (byWord)
      handleSensitiveUpsert(id, opt.useWordSensitive, opt.useTemporaryWordSensitive)
    if (byMention)
      handleSensitiveUpsert(id, opt.useMentionSensitive, opt.useTemporaryMentionSensitive)
  }

  const processComment = (comment: T) => {
    const newJudge = judgeComment(comment)
    if (isEqual(newJudge, comment.prevJudge)) return

    bannedProcess(comment, newJudge)
    comment.prevJudge = newJudge
  }

  // コメント変更ウォッチ
  watchEffect(() => {
    for (const c of comments) processComment(c)
  })

  // オプション変更時、prevJudge をリセット
  watch(userOption, () => {
    for (const c of comments) c.prevJudge = undefined
  })

  // ========= 削除処理 =========

  const remove = (el: HTMLElement) => {
    const idx = comments.findIndex(c => c.el === el)
    if (idx === -1) return

    const state = comments[idx]
    state.app?.unmount()
    state.app = null

    comments.splice(idx, 1)
  }

  return {
    comments,
    mountButton,
    judgeComment,
    processComment,
    bannedProcess,
    handleSensitiveUpsert,
    commentStyling,
    remove,
  }
}
