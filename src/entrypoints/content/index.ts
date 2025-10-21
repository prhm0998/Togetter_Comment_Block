import App from './App.vue'
export default defineContentScript({
  // ここではサイトの指定のみ
  matches: [
    '*://*.togetter.com/*',
    '*://*.posfie.com/*',
  ],
  async main(ctx) {

    await injectScript('/history-replace.js', { keepInDom: true })
    console.log('Done!')
    const urlPatterns = [
      /^https:\/\/(?:[\w-]+\.)?togetter\.com\/li+\/\d+/,
      /^https:\/\/(?:[\w-]+\.)?posfie\.com\/.+/]
    if (!urlPatterns.some((pattern) => pattern.test(location.href))) return
    // const { state: inner } = useUserOption()
    // useContent(ctx)
    const ui = createIntegratedUi(ctx, {
      position: 'inline',
      anchor: 'body',
      onMount: (container) => {
        // Create the app and mount it to the UI container
        const app = createApp(App, {
          ctx,
        })
        app.mount(container)
        return app
      },
      onRemove: (app) => {
        // Unmount the app when the UI is removed
        if (app) {
          app.unmount()
        }
      },
    })
    // Call mount to add the UI to the DOM
    ui.mount()
  },
})
