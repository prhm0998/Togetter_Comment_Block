export function useDialogManager() {
  const { comments, mountButton, remove } = useCommentManagerBase<CommentStateBase>()

  function add(el: HTMLElement) {
    const prev = comments.find(c => c.el === el)
    if (prev) prev.app?.unmount()

    const { authorId: id, commentBody } = getComment(el)
    const { text: message, mentions } = commentBody

    const state = reactive<CommentStateBase>({
      el, id, message, mentions,
      prevJudge: undefined,
      app: null,
    })

    comments.push(state)
    state.app = mountButton(el, state)
  }

  return { add, remove }
}
