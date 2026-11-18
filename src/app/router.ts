import { nextTick } from 'vue'
import { createMemoryHistory, createRouter } from 'vue-router'
import { useCase } from '../features/case/use-case'

declare module 'vue-router' {
  interface RouteMeta {
    camouflage?: boolean
    title?: string
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
      meta: { title: 'Paso 1 de 2' },
      beforeEnter: () => useCase().state.consentAccepted || { name: 'welcome' },
    },
    {
      path: '/paso-2',
      name: 'risk',
      component: () => import('../features/diagnosis/RiskEvidenceView.vue'),
      meta: { title: 'Paso 2 de 2' },
      beforeEnter: () => useCase().step1Complete.value || { name: 'identify' },
    },
    {
      path: '/resultado',
      name: 'result',
      component: () => import('../features/result/ResultView.vue'),
      meta: { title: 'Resultado' },
      beforeEnter: () => useCase().step2Complete.value || { name: 'risk' },
    },
    {
      path: '/asistente',
      name: 'assistant',
      component: () => import('../features/assistant/AssistantView.vue'),
      meta: { title: 'Asistente rápido' },
    },
    {
      path: '/clima',
      name: 'weather',
      component: () => import('../features/camouflage/WeatherView.vue'),
      meta: { camouflage: true },
    },
  ],
})

router.afterEach((to) => {
  if (to.meta.camouflage) return
  document.title = to.meta.title ? `${to.meta.title} · SIWAT` : 'SIWAT — Dale color a lo que otros invisibilizan'
  window.scrollTo({ top: 0 })
  // Move focus to the new screen's heading so screen readers announce the step change.
  void nextTick(() => document.querySelector<HTMLElement>('main h1')?.focus({ preventScroll: true }))
})
