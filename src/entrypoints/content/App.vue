<script setup lang="ts">
import { ContentScriptContext } from '#imports'
import { useDebounceFn } from '@vueuse/core'

const props = defineProps<{ ctx: ContentScriptContext }>()
// NG設定の読み込み
const { state: userOption } = useUserOption()
const { state: ignoreWord, upsert: upsertWord } = useIgnore('local:Word')
const { state: ignoreId, upsert: upsertId } = useIgnore('local:Id')
const { state: ignoreSessionId, upsert: upsertSessionId } = useIgnore('session:Id')
const { ignoreWordReg } = useIgnoreWordsReg(ignoreWord, userOption)

const commentOuter: Element | null = await waitForElement('.comment_box ul')
let togetterComments: PreAnalyzedTogetterComment[] = []

if (commentOuter && commentOuter instanceof HTMLElement) {
  // 記事末尾のコメント一覧を一件ずつ取得
  useWatchComment(commentOuter, 'li', (comment: HTMLElement, index) => {
    processComment(comment, index)
    processAllComment()
  })
}

// 返信やアンカークリックで表示されるダイアログに対する処理
//const { stop } =
useDialogObserver((el) => {
  const commentDialog = el.querySelector('div.css-1l55ltb .css-fzg4w1')
  const comments = Array.from(commentDialog?.querySelectorAll<HTMLElement>('.css-1l9tjqg') ?? [])
  comments.forEach((comment) => {
    comment.style.visibility = 'hidden'
    processComment(comment)
    comment.style.visibility = 'visible'
  })
})

function processComment(comment: HTMLElement, index?: number) {
  //commentをTogetterComment型に変換
  const togetterComment = getComment(comment)
  // コメントにBANボタンを追加
  useAddButton(togetterComment, props.ctx, processAllComment, upsertId)
  // BANするかの判定
  const judgeResult: Ref<JudgeResult> = useJudgeComment(togetterComment, ignoreWordReg, ignoreId, ignoreSessionId, userOption)
  // BAN処理 (Ban/Unban処理を兼ねるのでjudgeに関わらず処理する)
  useBannedProcess(togetterComment, judgeResult, userOption, upsertWord, upsertId, upsertSessionId)

  if (index) {
    togetterComments.push(togetterComment)
  }
}

//
const processAllComment = useDebounceFn(() => {
  const commentObjArr = getAnalyzedComments(togetterComments)

  for (const comment of commentObjArr) {
    // コメントごとに無視対象レス件数をカウント
    const count = comment.responseIdIndexes.reduce((acc, resId) => {
      if (ignoreId.value.has(resId) || ignoreSessionId.value.has(resId)) {
        return acc + 1
      }
      return acc
    }, 0)

    // BAN対象からの返信がついたコメント
    if (count) {
      const responseElm = comment.elm.querySelector('.css-1317rze > span')
      if (responseElm && responseElm.textContent) {
        // 現在の数字を取得
        const currentValue = Number(responseElm.textContent.trim())
        if (!isNaN(currentValue)) {
          // count分減算
          const newValue = Math.max(0, currentValue - count) // 0未満にならないように
          // textContentを更新
          responseElm.textContent = newValue.toString()
        }
      }
    }

    const containerElm = comment.elm.querySelector<HTMLElement>('.css-1317rze')

    if (containerElm) {
      // すでに追加済みか確認（classで判定）
      if (!containerElm.querySelector('.injected-counter')) {
        const span = document.createElement('span')
        span.textContent = `${comment.currentCount}/${comment.totalCount}`
        span.style.color = '#e83929'   // ピンク色
        span.classList.add('injected-counter') // 複数追加防止用の目印

        containerElm.prepend(span)
      }
    }
  }

}, 100)
</script>

<template>
  <div />
</template>
