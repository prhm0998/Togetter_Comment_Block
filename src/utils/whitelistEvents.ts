// whitelistEvents.ts

// ホワイトリストに含めたいイベント名
const allowEvents: string[] = ['focusin']

export function enableEventLogging(): void {
  const originalAddEventListener = EventTarget.prototype.addEventListener

  EventTarget.prototype.addEventListener = function (
    type: string,
    listener: EventListenerOrEventListenerObject,
    options?: boolean | AddEventListenerOptions
  ): void {
    // ホワイトリストにないイベントはそのまま登録
    if (!allowEvents.includes(type)) {
      return originalAddEventListener.call(this, type, listener, options)
    }

    console.log('[addEventListener]', type, 'on', this)

    // 発火時のログを追加
    const wrappedListener: EventListener = function (this: EventTarget, event: Event) {
      console.log('[event fired]', type, 'on', this, 'with', event)
      if (typeof listener === 'function') {
        return listener.apply(this, [event])
      }
      else {
        return (listener as EventListenerObject).handleEvent(event)
      }
    }

    return originalAddEventListener.call(this, type, wrappedListener, options)
  }
}
