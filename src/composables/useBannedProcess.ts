import { PreAnalyzedTogetterComment } from '@/utils/getComment'

export function useBannedProcess(
  ycomment: PreAnalyzedTogetterComment,
  result: Ref<JudgeResult>,
  userOption: Ref<UserOption>,
  upsertWord: (word: string) => void,
  upsertId: (id: string) => void,
  upsertSessionId: (id: string) => void
) {
  watch([result, userOption], ([newResult, newUserOption]) => {
    if (newResult.isGuilty && newUserOption.enabled) {
      if (!hasNoneStyle(ycomment.elm)) {
        const { useWordSensitive,
          useTemporaryWordSensitive,
          useMentionSensitive,
          useTemporaryMentionSensitive,
          // useInvalidMentionSensitive,
          // useTempraryInvalidMentionSensitive
        } = newUserOption
        switch (newResult?.type) {
          case 'Word':
            // 禁止ワードに抵触した
            upsertWord(newResult.matchedWord)
            ycomment.elm.style.display = 'none'
            if (useWordSensitive) {
              // 禁止ワードを使ったユーザーを永続的に禁止
              upsertId(newResult.author)
              ycomment.elm.style.display = 'none'
            }
            else if (useTemporaryWordSensitive) {
              // 禁止ワードを使ったユーザーを一時的に禁止
              upsertSessionId(newResult.author)
              ycomment.elm.style.display = 'none'
            }
            break
          case 'Id':
            // 禁止ネームを使ったユーザー
            upsertId(newResult.matchedUser)
            ycomment.elm.style.display = 'none'
            break
          case 'Mention':
            if (useMentionSensitive) {
              // 禁止ネームに対してメンションを送ったユーザーを永続的に禁止
              upsertId(newResult.author)
              ycomment.elm.style.display = 'none'
            }
            else if (useTemporaryMentionSensitive) {
              // 禁止ネームに対してメンションを送ったユーザーを一時的に禁止
              upsertSessionId(newResult.author)
              ycomment.elm.style.display = 'none'
            }
            break
          case 'Session':
            // 一時的に禁止のユーザーの発言をすべて非表示
            ycomment.elm.style.display = 'none'
            break
        }
      }
    }
    else {
      if (hasNoneStyle(ycomment.elm)) {
        ycomment.elm.style.display = ''
      }
    }
  }, { immediate: true })
}

function hasNoneStyle(elm: HTMLElement) {
  return elm.style.display === 'none'
}
