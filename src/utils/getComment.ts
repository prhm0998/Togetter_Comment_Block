export interface PreAnalyzedTogetterCommentContent {
  mentions: string[];
  text: string;
}

export interface PreAnalyzedTogetterComment {
  elm: HTMLElement; //これを消したらまるっと消える
  insertElm: Element | null; // ここにボタンを付け足したら丁度いい
  authorName: string;
  authorId: string;
  commentBody: PreAnalyzedTogetterCommentContent;
}

/**
 * ユーザー名（authorName）を抽出する
 */
function getAuthorName(li: HTMLElement): string {
  const screenNameEl = li.querySelector('a.screen-name')
  return screenNameEl?.childNodes[0]?.textContent?.trim() ?? ''
}

/**
 * ユーザーID（authorId）を抽出する
 */
function getAuthorId(li: HTMLElement): string {
  const screenNameEl = li.querySelector('a.screen-name')
  return screenNameEl
    ?.querySelector('span')
    ?.textContent?.trim()
    .replace(/^@/, '') ?? ''
}

/**
 * 本文テキスト（text）を抽出する
 */
function getCommentText(li: HTMLElement): string {
  return li.querySelector('p span')?.textContent?.trim() ?? ''
}

/**
 * メンション（mentions）を抽出する
 */
function getMentions(li: HTMLElement): string[] {
  const mentions: string[] = []
  li.querySelectorAll('p a').forEach(a => {
    const text = a.textContent?.trim()
    if (text) {
      mentions.push(text.replace(/^@/, ''))
    }
  })
  return mentions
}

/**
 * ボタンの挿入先要素（insertElm）を抽出する
 */
function getInsertElement(li: HTMLElement): Element | null {
  return li.querySelector('footer')
}

export default function (li: HTMLElement): PreAnalyzedTogetterComment {
  return {
    elm: li,
    insertElm: getInsertElement(li),
    authorName: getAuthorName(li),
    authorId: getAuthorId(li),
    commentBody: {
      mentions: getMentions(li),
      text: getCommentText(li),
    },
  }
}