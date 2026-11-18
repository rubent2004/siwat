import '@fontsource/atkinson-hyperlegible/400.css'
import '@fontsource/atkinson-hyperlegible/700.css'
import './styles/tokens.css'
import './styles/base.css'
import './styles/controls.css'

import { createApp } from 'vue'
import App from './app/App.vue'
import { router } from './app/router'
import { installQuickExit } from './features/camouflage/quick-exit'

installQuickExit(router)
createApp(App).use(router).mount('#app')
