import { Ref, computed } from 'vue'
import { IgnoreBase } from '@/composables/useIgnore'
import { IgnoreWordReg } from '@/composables/useIgnoreWordsReg'
import { UserOption } from './useUserOption'
import { PreAnalyzedTogetterComment } from '@/utils/getComment'

export type JudgeResult =
  | { isGuilty: true; type: 'Id' | 'Mention' | 'Session'; author: string; matchedUser: string }
  | { isGuilty: true; type: 'Word'; author: string; matchedWord: string }
  | { isGuilty: true; type: 'Uncategorized'; author: string }
  | { isGuilty: false; type?: never; author?: never; matchedUser?: never; matchedWord?: never }
  ; export function useJudgeComment(
    commentObj: PreAnalyzedTogetterComment,
    ignoreWordReg: Ref<IgnoreWordReg[]>,
    ignoreId: Ref<Map<string, IgnoreBase>>,
    ignoreSessionId: Ref<Map<string, IgnoreBase>>,
    userOption: Ref<UserOption>
  ): Ref<JudgeResult> {

  const { authorId: author, commentBody: { mentions, text: commentText } } = commentObj

  const result = computed<JudgeResult>(() => {
    // ignoreName
    const isBannedUser = userCheck(author, ignoreId.value)
    if (isBannedUser) {
      return {
        isGuilty: true,
        type: 'Id',
        author,
        matchedUser: author,
      }
    }

    // ignoreWord
    const matchedWordKey = spamCheck(userOption.value.useNormalize ? normalizedWord(commentText) : commentText, ignoreWordReg.value)
    if (matchedWordKey) {
      return {
        isGuilty: true,
        type: 'Word',
        author,
        matchedWord: matchedWordKey,
      }
    }

    // ignoreMention
    const matchedMentions =
      mentionCheck(mentions, ignoreId.value) || mentionCheck(mentions, ignoreSessionId.value)
    if (matchedMentions) {
      return {
        isGuilty: true,
        type: 'Mention',
        author,
        matchedUser: matchedMentions,
      }
    }

    // ignoreSession
    const matchedSessions = userCheck(author, ignoreSessionId.value)
    if (matchedSessions) {
      return {
        isGuilty: true,
        type: 'Session',
        author,
        matchedUser: author,
      }
    }

    return { isGuilty: false }
  })

  return result
}

const spamCheck = (comment: string, ignoreWordReg: IgnoreWordReg[]): string | null => {
  const match = ignoreWordReg.find((reg) => reg.regExp.test(comment))
  return match ? match.key : null
}

const userCheck = (author: string, ignoreId: Map<string, IgnoreBase>): string | null => {
  return ignoreId.has(author) ? author : null
}

const mentionCheck = (mentions: string[], ignoreId: Map<string, IgnoreBase>): string | null => {
  const matchedId = mentions.find(id => ignoreId.has(id))
  return matchedId || null
}
