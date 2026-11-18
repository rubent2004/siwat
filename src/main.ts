import '@fontsource/atkinson-hyperlegible/400.css'
import '@fontsource/atkinson-hyperlegible/700.css'
import './styles/tokens.css'
import './styles/base.css'
import './styles/controls.css'

import { createApp } from 'vue'
import App from './app/App.vue'
import { router } from './app/router'
import { installQuickExit } from './features/camouflage/quick-exit'
import { i18n, restoreLocale } from './i18n'

installQuickExit(router)
const app = createApp(App).use(i18n).use(router)
// A language chosen earlier in this tab is loaded before the first paint, so Spanish never flashes in.
void restoreLocale().finally(() => app.mount('#app'))
