export function useCommentManager() {
  const { comments, remove, mountButton } = useCommentManagerBase<CommentState>()

  function add(el: HTMLElement) {
    const prev = comments.find(c => c.el === el)
    if (prev) prev.app?.unmount()

    const { authorId: id, commentBody } = getComment(el)
    const { text: message, mentions } = commentBody

    const state = reactive<CommentState>({
      el, id, message, mentions,
      idCountCurrent: 0,
      idCountTotal: 0,
      prevJudge: undefined,
      app: null,
    })

    comments.push(state)
    state.app = mountButton(el, state)
  }

  // この manager 固有の count 再計算
  watchEffect(() => {
    comments.forEach((c, idx) => {
      const id = c.id
      c.idCountCurrent =
        comments.slice(0, idx).filter(x => x.id === id).length + 1
      c.idCountTotal = comments.filter(x => x.id === id).length
    })
  })

  return { add, remove }
}
