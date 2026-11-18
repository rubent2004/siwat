# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Stack

delegated: Vue 3 + TypeScript + Vite, static build with no backend. A server would contradict the privacy requirement that nothing leaves the device. Deploys to Netlify Drop or GitHub Pages.

## Users

Politically active women in El Salvador (mayors, síndicas, councillors, deputies, candidates, party members, community leaders, activists and human-rights defenders) who are being attacked online. They often use SIWAT in distress, from a phone, sometimes a shared or monitored one.

## Product Purpose

SIWAT («Dale color a lo que otros invisibilizan») lets a woman check in about 2 minutes whether what she lives online is political violence under Salvadoran law, measures its urgency (red / yellow / green traffic light), preserves evidence with verifiable integrity (SHA-256 + UTC timestamp, Bitácora PDF) and sends her directly to the official channels that apply (ISDEMU 126 / 126 Te Orienta, PNC 911, FGR, TSE). Success: she understands her situation, keeps valid evidence before blocking, and knows exactly where to go. She decides whether and when to report.

## Positioning

A legal self-diagnosis that maps her answers to specific Salvadoran articles (LEIV, LEDIC, Código Electoral, LIE, Belém do Pará) and hands her a chain-of-custody record, without ever collecting her identity or data.

## Operating Context

Hackathon «Innovando por una participación política segura» (ANDRYSAS, ONU Mujeres El Salvador, Centro de Estudios de Género UES; Agencia Vasca de Cooperación). Used mid-crisis, possibly near the aggressor or an observer, on low connectivity.

## Capabilities and Constraints

- Six screens: P01 welcome, P02 identify aggression, P03 risk and evidence, P04 result and route, P05 button-guided assistant, P06 weather camouflage.
- SIWAT does NOT file complaints and does not replace State institutions; it must say so.
- No account needed; optional local space with pseudonym + 4-digit PIN. Data stays in sessionStorage/localStorage only. "Limpiar datos de este dispositivo" erases it.
- Quick exit (button or Esc twice) to a neutral weather screen; hold the sun 2 s to return.
- Works offline; no AI in the crisis assistant.
- Undecided: anonymous statistics endpoint for the ANDRYSAS observatory (phase 2).

## Brand Commitments

- Name SIWAT, slogan «Dale color a lo que otros invisibilizan».
- Fixed palette: plum #38113B (headers, navigation, isotype), coral #F4A261 (primary button), quick-exit #2B2D42, traffic light green #2A9D8F, yellow #E9C46A, red #E63946, always with colour + symbol + text.
- Screen copy is fixed by the functional specification v2.0 (Spanish).

## Evidence on Hand

- Functional spec: `../Especificación Funcional - SIWAT (Versión Actualizada).pdf`.
- Not on hand, must not be fabricated: official logo files, ANDRYSAS manual text for per-network report steps.

## Product Principles

1. Safety before features: quick exit, camouflage and erase are always one action away.
2. Orient, never decide: she chooses whether to report.
3. Nothing leaves the device.
4. Plain, warm language a non-technical person understands under stress.
5. Every recommendation points to a real, official channel.

## Accessibility & Inclusion

Mobile-first, large touch targets (≥ 48 px for quick exit), colour never the only signal in the traffic light, readable under stress, WCAG 2.2 AA.
