# SIWAT prototype — functional web demo for the hackathon "Innovando por una participación política segura"
Branch: `feat/siwat-prototype` · Delivery: `single-pr` (greenfield demo, deadline 2026-11-18 21:00) · Tests: `pnpm test` (Vitest)
Source of truth for screen copy: `../Especificación Funcional - SIWAT (Versión Actualizada).pdf` (v2.0).

## Specs

- **S1 Stack/privacy**: static web app (no backend). All answers stay on the device (`sessionStorage`; optional `localStorage` space with "Seudónimo + PIN de 4 dígitos"). "nunca se sube ni almacena en servidores externos". No third-party CDN, fonts or icon API calls at runtime.
- **S2 Global chrome**: fixed top bar with SIWAT logo (→ P01) and «SALIR RÁPIDO» (min 48 px, #2B2D42, white text). Button or `Esc` pressed twice → P06. Footer: «SIWAT es una herramienta preventiva de orientación. No presenta denuncias por ti. Si estás en peligro físico ahora, llama al 911.» Palette: #38113B, #F4A261, #2A9D8F, #E9C46A, #E63946.
- **S3 P01 Welcome**: H1 «¿Lo que vives en redes es violencia política? Descúbrelo en 2 minutos.», description, scope notice, mandatory consent checkbox enabling «Iniciar Semáforo Diagnóstico», «Estoy en peligro físico ahora» opens a dialog with call 911 / call 126, links «Usar Asistente Rápido (Guía por botones)» and «Crear espacio local con PIN (Opcional)».
- **S4 P02 Step 1**: «Paso 1 de 2: Identifica lo que ocurrió» (50%), optional role and department (14), required platforms (≥1), required electoral context (Sí/No), required conducts (≥1 of 6), «Siguiente: Evaluar riesgo y prueba» saves to sessionStorage → P03.
- **S5 P03 Step 2**: «Paso 2 de 2: Nivel de urgencia y evidencia» (100%), two required Sí/No risk filters, preventive notice, optional URL, up to 3 JPG/PNG screenshots with browser-side SHA-256 + UTC timestamp, narrative max 500 chars, «Ver mi resultado del Semáforo» / «Atrás».
- **S6 Classification engine** (spec section 5): red / yellow / green with legal basis and suggested institutions; TSE route enabled when electoral context = Sí.
- **S7 P04 Result**: dynamic banner (colour + symbol + text), legal basis disclosure, Bitácora PDF (code `SIWAT-2026-XXXX`, UTC date, SHA-256 per image, URL, legal frame, keep-originals instruction) behind mandatory notice, «Limpiar datos de este dispositivo», per-network 3-step report guide, institution cards with direct official links/calls (audio L2), 3-item account shielding checklist, optional anonymous stats.
- **S8 P05 Assistant**: 4 fixed buttons, offline, no AI.
- **S9 P06 Camouflage**: neutral San Salvador weather (28°C, Parcialmente nublado), no SIWAT mention; hold the sun icon 2 s to return.
- **S10 Deploy**: builds to static files deployable on Netlify Drop / GitHub Pages; installable PWA works offline.

Assumptions (to validate with the team):
- A1: "Montaje íntimo" is captured by P03 filter 2 (imágenes íntimas). Impersonation/deepfake alone → yellow; red only combined with a red trigger.
- A2: Disinformation without electoral context, or no other match → green (preventive) with the symbolic-violence basis.
- A3: Per-network report steps are generic until the ANDRYSAS manual text is provided.
- A4: Anonymous statistics are previewed only; no endpoint is wired in phase 1.

## Tasks

| ID | Specs | Route | Status | Evidence |
|----|-------|-------|--------|----------|
| T1 | S1, S6 | inline | done | a11656c — 27 tests GREEN (RED observed first) |
| T2 | S2–S5, S7–S9 | inline | done | 3f98b8f — full flow driven in Chromium (mobile + desktop), PDF generated |
| T3 | S10 | inline | in review | build + PWA + CSP OK; Impeccable finish review pending |

## Log

- L1 (2026-11-18, user, verbatim): "https://126teorienta.gob.sv/dirservicios/   , podrias ayudarme a hacer este proyecto o simulador mejor dicho ahi hay un audio que puedes pasar a texto para ver mejor como seria , puedes usar cualquier herramienta como vue , typscript, vite, etc , tambien librerias como las de https://icons0.dev/ , https://vue-bits.dev/ ... recuerda hacerlo con la mejor arquitectura, modular , mejores practicas ..."
- L2 (audio transcription): "...en lugar de eso [asistencia entre pares / psicólogas / abogadas] ... a partir de los resultados ya estén los botones con los links que les lleven a las plataformas que ya son oficiales para hacer las denuncias..."
- L3: 126teorienta.gob.sv blocks automated clients (Cloudflare 403); linked directly from the institution card. Engram mirror pending (memory tools unavailable this session).
- L4 (2026-11-18): Visual direction «Folio y sello» chosen by the user on the Impeccable decision page (seed:e57a2df38d8f4d32). PRODUCT.md confirmed.
- L5: Playwright run: camouflage title «Clima — San Salvador», no «SIWAT» text on P06, 2 s hold returns to Resultado; PDF downloaded on both viewports. Impeccable detector: 0 findings.
