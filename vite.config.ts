/// <reference types="vitest/config" />
import vue from '@vitejs/plugin-vue'
import Icons from 'unplugin-icons/vite'
import { defineConfig, type Plugin } from 'vite'
import { VitePWA } from 'vite-plugin-pwa'

/**
 * Production CSP: the browser itself refuses to send data to any other origin,
 * which backs the promise that nothing leaves the device.
 */
const CONTENT_SECURITY_POLICY = [
  "default-src 'self'",
  "img-src 'self' blob: data:",
  "style-src 'self' 'unsafe-inline'",
  "font-src 'self'",
  "connect-src 'self'",
  "worker-src 'self'",
  "object-src 'none'",
  "base-uri 'self'",
  "form-action 'none'",
].join('; ')

function contentSecurityPolicy(): Plugin {
  return {
    name: 'siwat-csp',
    apply: 'build',
    transformIndexHtml: (html) =>
      html.replace('<head>', `<head>\n    <meta http-equiv="Content-Security-Policy" content="${CONTENT_SECURITY_POLICY}" />`),
  }
}

// Relative base so the same build works on Netlify Drop and GitHub Pages subpaths.
export default defineConfig({
  base: './',
  // vue-i18n esm-bundler flags. Messages are compiled just in time to an AST (no eval), so the CSP holds.
  define: {
    __VUE_I18N_FULL_INSTALL__: true,
    __VUE_I18N_LEGACY_API__: false,
    __INTLIFY_PROD_DEVTOOLS__: false,
    __INTLIFY_DROP_MESSAGE_COMPILER__: false,
  },
  plugins: [
    vue(),
    contentSecurityPolicy(),
    // Icons are compiled into the bundle: no runtime requests to an icon API.
    Icons({ compiler: 'vue3' }),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.svg', 'weather.svg'],
      manifest: {
        name: 'SIWAT',
        short_name: 'SIWAT',
        description: 'Semáforo de Violencia Política Digital. Orientación privada, sin registro.',
        lang: 'es-SV',
        start_url: './',
        scope: './',
        display: 'standalone',
        theme_color: '#38113B',
        background_color: '#FBF7F2',
        icons: [
          { src: 'pwa-192.png', sizes: '192x192', type: 'image/png' },
          { src: 'pwa-512.png', sizes: '512x512', type: 'image/png' },
          { src: 'pwa-512.png', sizes: '512x512', type: 'image/png', purpose: 'maskable' },
        ],
      },
      workbox: { globPatterns: ['**/*.{js,css,html,svg,png,woff2}'] },
    }),
  ],
  test: { environment: 'node' },
})
