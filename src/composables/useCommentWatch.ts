import { waitElementCycle, watchElement, watchElementRemoval } from '@prhm0998/shared/utils'
import type { WaitElementCycleCallbacks } from '@prhm0998/shared/utils'

import { useCommentManager } from '@/composables/useCommentManager'

export function useCommentWatch() {
  const { add, remove } = useCommentManager()
  const cycler: WaitElementCycleCallbacks<HTMLElement> = {
    onFound: (commentOuter) => {
      watchElement(commentOuter, 'li', (c) => {
        add(c)
        watchElementRemoval(c, () => {
          remove(c)
        })
      })
    },
  }
  waitElementCycle(cycler, '.comment_box ul')
}

export function useDialogWatch() {

  const { add, remove } = useDialogManager()

  const cycler: WaitElementCycleCallbacks<HTMLElement> = {

    onFound: (dialog: HTMLElement) => {
      watchElement(dialog, '.css-1xc01s9', (commentOuter) => {
        watchElement(commentOuter, '.css-1l9tjqg', (c) => {
          add(c)
          watchElementRemoval(c, () => {
            remove(c)
          })
        })
      })
    },
  }

  waitElementCycle(cycler, '.css-1l55ltb')
}