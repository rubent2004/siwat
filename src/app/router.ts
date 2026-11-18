import { nextTick, watch } from 'vue'
import { createMemoryHistory, createRouter, type RouteLocationNormalizedLoaded } from 'vue-router'
import { useCase } from '../features/case/use-case'
import { i18n } from '../i18n'

declare module 'vue-router' {
  interface RouteMeta {
    camouflage?: boolean
    /** Message key of the document title, e.g. `app.routes.result`. */
    titleKey?: string
  }
}

/**
 * Memory history on purpose: the steps never enter the browser history,
 * so the back button or the history list cannot reveal SIWAT screens.
 */
export const router = createRouter({
  history: createMemoryHistory(),
  routes: [
    { path: '/', name: 'welcome', component: () => import('../features/welcome/WelcomeView.vue') },
    {
      path: '/paso-1',
      name: 'identify',
      component: () => import('../features/diagnosis/IdentifyView.vue'),
      meta: { titleKey: 'app.routes.identify' },
      beforeEnter: () => useCase().state.consentAccepted || { name: 'welcome' },
    },
    {
      path: '/paso-2',
      name: 'risk',
      component: () => import('../features/diagnosis/RiskEvidenceView.vue'),
      meta: { titleKey: 'app.routes.risk' },
      beforeEnter: () => useCase().step1Complete.value || { name: 'identify' },
    },
    {
      path: '/resultado',
      name: 'result',
      component: () => import('../features/result/ResultView.vue'),
      meta: { titleKey: 'app.routes.result' },
      beforeEnter: () => useCase().step2Complete.value || { name: 'risk' },
    },
    {
      path: '/asistente',
      name: 'assistant',
      component: () => import('../features/assistant/AssistantView.vue'),
      meta: { titleKey: 'app.routes.assistant' },
    },
    {
      path: '/clima',
      name: 'weather',
      component: () => import('../features/camouflage/WeatherView.vue'),
      meta: { camouflage: true },
    },
  ],
})

function applyDocumentTitle(route: RouteLocationNormalizedLoaded) {
  if (route.meta.camouflage) return
  const { t } = i18n.global
  document.title = route.meta.titleKey ? `${t(route.meta.titleKey)} · SIWAT` : t('app.defaultTitle')
}

// The title follows a language change without leaving the screen.
watch(i18n.global.locale, () => applyDocumentTitle(router.currentRoute.value))

router.afterEach((to) => {
  if (to.meta.camouflage) return
  applyDocumentTitle(to)
  window.scrollTo({ top: 0 })
  // Move focus to the new screen's heading so screen readers announce the step change.
  void nextTick(() => document.querySelector<HTMLElement>('main h1')?.focus({ preventScroll: true }))
})
