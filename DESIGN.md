---
name: SIWAT
description: Dale color a lo que otros invisibilizan. A case is a stamped legal record.
colors:
  plum: "#38113b"
  plum-700: "#4c1d50"
  plum-50: "#f4ecf3"
  coral: "#f4a261"
  coral-hover: "#f08a3c"
  coral-ink: "#2a0d2c"
  exit: "#2b2d42"
  exit-hover: "#1c1d2c"
  paper: "#fbf7f2"
  sheet: "#ffffff"
  edge: "#ddd1da"
  control-edge: "#8c7a89"
  ink: "#24112a"
  ink-muted: "#63506a"
  red: "#e63946"
  red-text: "#a61b29"
  red-tint: "#fdeef0"
  yellow: "#e9c46a"
  yellow-stamp: "#c99a1e"
  yellow-text: "#6e5100"
  yellow-tint: "#fcf5e1"
  green: "#2a9d8f"
  green-text: "#1b6b61"
  green-tint: "#e8f5f3"
typography:
  display:
    fontFamily: "'Atkinson Hyperlegible', system-ui, sans-serif"
    fontSize: "clamp(1.625rem, 1.3rem + 1.6vw, 2.125rem)"
    fontWeight: 700
    lineHeight: 1.2
    letterSpacing: "-0.02em"
  headline:
    fontFamily: "'Atkinson Hyperlegible', system-ui, sans-serif"
    fontSize: "1.5rem"
    fontWeight: 700
    lineHeight: 1.2
  title:
    fontFamily: "'Atkinson Hyperlegible', system-ui, sans-serif"
    fontSize: "1.25rem"
    fontWeight: 700
    lineHeight: 1.2
  body:
    fontFamily: "'Atkinson Hyperlegible', system-ui, sans-serif"
    fontSize: "1.0625rem"
    fontWeight: 400
    lineHeight: 1.55
  body-sm:
    fontFamily: "'Atkinson Hyperlegible', system-ui, sans-serif"
    fontSize: "0.9375rem"
    fontWeight: 400
    lineHeight: 1.55
  label:
    fontFamily: "'Atkinson Hyperlegible', system-ui, sans-serif"
    fontSize: "1.0625rem"
    fontWeight: 700
    lineHeight: 1.25
  folio-data:
    fontFamily: "ui-monospace, 'SFMono-Regular', 'Cascadia Mono', 'Roboto Mono', monospace"
    fontSize: "0.8125rem"
    fontWeight: 400
    letterSpacing: "0.08em"
    fontFeature: "tnum"
  stamp-label:
    fontFamily: "'Atkinson Hyperlegible', system-ui, sans-serif"
    fontSize: "1.35rem"
    fontWeight: 700
    letterSpacing: "0.1em"
rounded:
  sheet: "4px"
  control: "8px"
  pill: "999px"
spacing:
  space-1: "0.25rem"
  space-2: "0.5rem"
  space-3: "0.75rem"
  space-4: "1rem"
  space-5: "1.5rem"
  space-6: "2rem"
  space-7: "3rem"
components:
  button-primary:
    backgroundColor: "{colors.coral}"
    textColor: "{colors.coral-ink}"
    typography: "{typography.label}"
    rounded: "{rounded.control}"
    padding: "0.5rem 1.5rem"
    height: "48px"
  button-primary-hover:
    backgroundColor: "{colors.coral-hover}"
  button-plum:
    backgroundColor: "{colors.plum}"
    textColor: "{colors.sheet}"
    typography: "{typography.label}"
    rounded: "{rounded.control}"
    padding: "0.5rem 1.5rem"
    height: "48px"
  button-plum-hover:
    backgroundColor: "{colors.plum-700}"
  button-outline:
    backgroundColor: "{colors.sheet}"
    textColor: "{colors.plum}"
    rounded: "{rounded.control}"
    padding: "0.5rem 1.5rem"
    height: "48px"
  button-outline-hover:
    backgroundColor: "{colors.plum-50}"
  button-danger:
    backgroundColor: "{colors.sheet}"
    textColor: "{colors.red-text}"
    rounded: "{rounded.control}"
    padding: "0.5rem 1.5rem"
    height: "48px"
  button-danger-hover:
    backgroundColor: "{colors.red-tint}"
  button-ghost:
    textColor: "{colors.plum}"
    padding: "0.5rem 0.75rem"
    height: "48px"
  quick-exit:
    backgroundColor: "{colors.exit}"
    textColor: "{colors.sheet}"
    rounded: "{rounded.control}"
    padding: "0 1rem"
    height: "48px"
  quick-exit-hover:
    backgroundColor: "{colors.exit-hover}"
  topbar:
    backgroundColor: "{colors.plum}"
    textColor: "{colors.sheet}"
    padding: "0.5rem 1rem"
  input:
    backgroundColor: "{colors.sheet}"
    textColor: "{colors.ink}"
    rounded: "{rounded.control}"
    padding: "0.5rem 0.75rem"
    height: "48px"
  input-invalid:
    backgroundColor: "{colors.red-tint}"
  chip:
    backgroundColor: "{colors.sheet}"
    textColor: "{colors.ink}"
    typography: "{typography.body-sm}"
    rounded: "{rounded.pill}"
    padding: "0.5rem 1rem"
    height: "48px"
  chip-selected:
    backgroundColor: "{colors.plum}"
    textColor: "{colors.sheet}"
  choice-option-selected:
    backgroundColor: "{colors.plum-50}"
    textColor: "{colors.ink}"
    rounded: "{rounded.control}"
  folio-sheet:
    backgroundColor: "{colors.sheet}"
    textColor: "{colors.ink}"
    rounded: "{rounded.sheet}"
    padding: "1.5rem 1.5rem 2rem"
  dialog:
    backgroundColor: "{colors.sheet}"
    textColor: "{colors.ink}"
    rounded: "{rounded.sheet}"
    padding: "1.5rem"
    width: "26rem"
  notice:
    backgroundColor: "{colors.green-tint}"
    textColor: "{colors.ink}"
    typography: "{typography.body-sm}"
    rounded: "{rounded.control}"
    padding: "1rem"
  notice-warning:
    backgroundColor: "{colors.yellow-tint}"
  verdict-stamp-red:
    textColor: "{colors.red}"
    size: "8.5rem"
  verdict-stamp-yellow:
    textColor: "{colors.yellow-stamp}"
    size: "8.5rem"
  verdict-stamp-green:
    textColor: "{colors.green}"
    size: "8.5rem"
---

# Design System: SIWAT

## Overview

**Creative North Star: "Folio y sello" (The Stamped Case File)**

A case in SIWAT is a legal record, not a wellness journey. Every step of the diagnosis is a numbered folio: a white sheet laid on warm paper, its head ruled off with a dashed line and its folio number and case code typed in monospace. The verdict is not a badge or a gradient card; it is an inked rubber stamp pressed onto the result folio, rotated a few degrees, carrying the traffic-light word, the UTC date and the case code. The world borrows its authority from the notary's desk so that a woman reading it under stress, on a phone, trusts that what she keeps is evidence.

Density is low and the reading is single-column. One plum bar frames every screen with the brand on the left and the quick exit on the right; below it, sheets stack down a 40rem column. Colour is flat and spent with discipline: plum is the voice of the record (headings, links, navigation, secondary actions), coral is the one forward step, and the three traffic-light inks appear only where the law's verdict appears. The confirmed refusal is the soft-gradient NGO card stack: no gradients, no floating rounded cards, no decorative illustration.

**Key Characteristics:**
- Warm paper ground, white folio sheets with a hairline edge and a stacked-sheet lip.
- Monospace reserved for record data: folio numbers, case codes, SHA-256 hashes, UTC times.
- Shape-coded verdict stamps: octagon (red), triangle (yellow), circle (green), always with the word.
- Flat colour throughout; the only lifted surface is a modal dialog.
- 48px minimum for every tap target; one decision per section.

## Colors

A flat, ink-on-paper palette: one deep plum voice, one warm coral action, and three legal-severity inks that never appear without a shape and a word.

### Primary
- **Notarial Plum** (`plum`): the shell bar, every heading, links, focus rings, form accent colour, selected options and the secondary filled button (including the "Estoy en peligro físico ahora" emergency action). **Plum Deep** (`plum-700`) is its hover; **Plum Wash** (`plum-50`) fills selected yes/no options, the outline-button hover and the progress track.

### Secondary
- **Seal Coral** (`coral`): the primary forward action of a folio (start the diagnosis, download the Bitácora PDF) and text selection. Its text is **Coral Ink** (`coral-ink`), a near-black plum, never white. **Coral Pressed** (`coral-hover`) is its hover.

### Tertiary (traffic-light inks)
- **Stamp Red** (`red`), **Stamp Ochre** (`yellow-stamp`) and **Stamp Teal** (`green`): the stroke and lettering of the verdict stamp and the coloured borders of notices. **Signal Yellow** (`yellow`) appears only in the SIWAT isotype, beside red and green.
- **Red Text**, **Yellow Text**, **Green Text** (`red-text`, `yellow-text`, `green-text`): the readable variants, at 4.5:1 or better on white and on their tints. They carry the verdict title, error messages, the destructive button and notice icons.
- **Red Tint**, **Yellow Tint**, **Green Tint** (`red-tint`, `yellow-tint`, `green-tint`): backgrounds for an invalid field, a warning notice and the privacy notice.

### Neutral
- **Folio Paper** (`paper`): the page ground behind every sheet; also the hover wash on long checklists.
- **Sheet White** (`sheet`): folio sheets, dialogs, inputs, chips and outline buttons.
- **Hairline Edge** (`edge`): sheet borders, the dashed folio-head rule, list dividers, the stacked-sheet lip and the scrollbar.
- **Control Edge** (`control-edge`): the resting 1.5px border of inputs, selects, chips and yes/no options; 3.7:1 on paper, meeting WCAG 1.4.11.
- **Record Ink** (`ink`): body text and field labels.
- **Faded Ink** (`ink-muted`): hints, descriptions, folio-head data and the input hover stroke.
- **Exit Slate** (`exit`, hover `exit-hover`): the quick-exit button only. It is a brand commitment and must not be reused for any other control.

### Named Rules
**The One Coral Rule.** A folio or dialog carries at most one coral button. Every other action is plum, outline or ghost. Coral means "the next step", nothing else.

**The Text Ink Rule.** The base traffic-light inks are for strokes, stamps and borders. Any traffic-light *text* uses its `-text` variant.

**The Three Signals Rule.** Severity is never colour alone: every verdict carries a colour, a stamp shape and a word (ROJO / AMARILLO / VERDE).

## Typography

**Body Font:** Atkinson Hyperlegible (with system-ui, sans-serif), loaded at 400 and 700 only.
**Label/Mono Font:** ui-monospace (with SFMono-Regular, Cascadia Mono, Roboto Mono, monospace).

**Character:** One humanist face designed for low-vision legibility does all the speaking, from the welcome headline to the fine print; the monospace is the typewriter that fills in the record. The pairing reads as a form someone took seriously, not as a brand campaign.

### Hierarchy
- **Display** (700, `clamp(1.625rem → 2.125rem)`, 1.2, -0.02em): the opening H1 of a fresh start: the P01 welcome and the P05 assistant.
- **Headline** (700, 1.5rem, 1.2): screen H1s on the diagnosis steps and the verdict title on P04; dialog titles.
- **Title** (700, 1.25rem, 1.2): section H2s inside a folio (Tu ruta de acción).
- **Body** (400, 1.0625rem / 17px, 1.55): all prose, on a 17px base chosen for reading under stress. Lines stay within the 40rem column.
- **Body small** (400, 0.9375rem, 1.55): hints, descriptions, notices, legal articles, chips.
- **Label** (700, 1.0625rem): buttons, field labels, legends, disclosure summaries.
- **Folio data** (mono 400, 0.8125rem, 0.08em, uppercase, tabular figures): folio heads ("FOLIO 01", case code). Inline data (hashes, codes) uses mono at 0.92em of its context.
- **Stamp label** (700, 1.35rem, 0.1em, uppercase; 1.05rem in the triangle): the verdict word inside the stamp.

### Named Rules
**The Typewriter Rule.** Monospace is only for data that must be read exactly: folio numbers, case codes, SHA-256 hashes, UTC timestamps. Never for headings, labels or decoration.

**The Two Weights Rule.** Atkinson Hyperlegible ships at 400 and 700. Hierarchy comes from size and colour (plum headings, ink body), never from a third weight.

## Layout

A single reading column: `min(100% - 2rem, 40rem)` centred, with 1.5rem above and 3rem below the content. The sticky plum bar aligns its contents to the same column edges. Sheets stack vertically with 1.5rem between them; inside a sheet, blocks sit on a 1rem gap and sections are separated by a dashed or hairline rule rather than by new cards.

Spacing is one 4px-based scale (`space-1` to `space-7`, 0.25rem to 3rem); `space-2` to `space-4` do most of the work. Every interactive element has a 48px minimum height (`--touch`), including links in the welcome folio and disclosure summaries.

Responsive behaviour is mobile-first with three content-driven thresholds: at 30rem folio padding grows from 1rem to 1.5rem; at 34rem paired question groups on P02 move into two columns; below 26rem the verdict stamp moves above the verdict title instead of beside it. Desktop is the same column, not a wider layout.

## Elevation & Depth

Depth is paper, not light. Folio sheets lie flat on the paper ground, separated by a 1px hairline edge and a stacked-sheet lip: a second hairline 3px below the sheet that reads as the sheet underneath. This lip is a structural paper edge, not a drop shadow. The only true shadow belongs to native modal dialogs, which rise above a dimmed plum-ink backdrop (`rgb(36 17 42 / 0.55)`).

### Shadow Vocabulary
- **Sheet lip** (`box-shadow: 0 3px 0 -1px var(--sheet), 0 3px 0 0 var(--edge)`): every folio sheet.
- **Dialog lift** (`box-shadow: 0 24px 48px -16px rgb(36 17 42 / 0.45)`): modal dialogs only (emergency call, clear data, local space).

### Named Rules
**The Paper Stack Rule.** A surface earns depth only by being another sheet (hairline plus lip) or a modal (dialog lift). No ambient card shadows, no glows, no gradients.

## Shapes

Two radii carry the whole system. Paper is nearly square: sheets and dialogs use a 4px corner. Controls are gently rounded at 8px: buttons, inputs, yes/no options, notices and the quick exit. The pill (999px) is reserved for things that are tokens, not surfaces: the conduct chips on P02 and the progress bar.

Borders do the structural work. Sheets have a 1px hairline; controls use a 1.5px stroke, and outline or destructive buttons a 2px stroke. The folio head and section breaks use a 1px dashed hairline, the typed-form rule of a paper record.

The verdict stamp is the system's one free form: an SVG outline with a 6px round-joined stroke and an 8% ink fill, an octagon for red, a triangle for yellow and a circle for green, rotated -8deg and blended with `multiply` so it reads as ink on paper.

### Named Rules
**The Two Radii Rule.** Sheets 4px, controls 8px. A pill is only for chips and progress; a stamp is only for the verdict.

## Components

### Buttons
Flat, full-weight and thumb-sized: every button reads as a decision, not a decoration.
- **Shape:** gently rounded (8px), 2px border slot, 48px minimum height, 0.5rem × 1.5rem padding, bold label at body size, optional 1.25em leading icon.
- **Primary (coral):** coral fill with coral-ink text. The forward step of a folio.
- **Plum:** plum fill with white text; hover to plum-700. Emergency calls, institution channels and other committed actions.
- **Outline:** white fill, 2px plum stroke, plum text; hover to plum-50. Secondary routes beside a plum action.
- **Danger:** white fill, 2px red-text stroke and text; hover to red-tint. Only "Limpiar datos de este dispositivo", isolated at the end of its folio.
- **Ghost:** transparent, plum underlined text. Dismiss actions in dialogs.
- **Hover / Focus:** colour transitions over 160ms on the system ease-out; focus is a 3px plum outline at 3px offset (white on the plum bar). Disabled is 45% opacity with a not-allowed cursor.
- **Block:** buttons inside folios run full width on every breakpoint.

### Chips
- **Style:** pill (999px), white fill, 1.5px stroke, bold small text, 48px tall, the native input stretched invisibly over the chip.
- **State:** selected fills solid plum with white text and shows a check icon; focus draws the plum outline around the whole chip.

### Cards / Containers (Folio Sheet)
- **Corner Style:** 4px.
- **Background:** sheet white on folio paper.
- **Shadow Strategy:** the sheet lip (see Elevation & Depth).
- **Border:** 1px hairline edge.
- **Internal Padding:** 1rem (1.5rem bottom) on small screens, 1.5rem (2rem bottom) from 30rem.
- **Head:** case sheets open with a folio head: "Folio NN" left and the case code right, mono, uppercase, faded ink, over a dashed hairline. Sheets outside the case file omit the head.

### Inputs / Fields
- **Style:** white fill, 1.5px stroke, 8px corners, 48px minimum height, 0.5rem × 0.75rem padding; textareas start at 7.5rem and resize vertically. Labels are bold ink above the field; hints are body-small faded ink.
- **Hover:** the stroke darkens to faded ink.
- **Focus:** the global 3px plum outline at 3px offset.
- **Error:** on `:user-invalid` the stroke turns red-text and the fill red-tint; the error line is bold red-text body-small with a leading alert icon.
- **Yes/No options:** two equal 8px-cornered option tiles; the checked tile takes a plum stroke and plum-wash fill.
- **Checklists:** conduct rows are full-width rows divided by hairlines, plum-wash when checked, paper-wash on hover.

### Navigation
- **Top bar:** sticky plum bar, brand mark (traffic-light isotype plus "SIWAT" in bold tracked capitals) on the left as the home link, quick exit on the right. White on plum; focus outlines turn white.
- **Quick exit:** exit-slate fill, white bold text tracked at 0.03em, a translucent white 1.5px stroke, log-out icon, 48 × 48px minimum. Always present on every case screen; also Esc twice.
- **Step indicator:** a bold plum small label over an 8px pill progress bar (plum on plum-wash).
- **Disclosures:** full-width summaries in bold plum with a chevron that rotates 90° over 200ms; content opens by animating block size over 300ms. Both respect reduced motion.

### Notice
- **Style:** 8px corners, 1.5px teal stroke on green tint, body-small text, a 1.4rem green-text icon. The warning variant switches to an ochre stroke on yellow tint with a yellow-text icon.

### Verdict Stamp (signature)
The memorable moment of the product. An 8.5rem square stamp sits top-right of the P04 result folio, crossing the folio-head rule, rotated -8deg. Inside the shape: the verdict word in stamp-label type, then the UTC date and time and the case code in 10px bold mono, all in the stamp ink. It enters once with the stamp press: from 1.35× scale, -16deg and 35% opacity to rest over 520ms on the ease-out curve, only when reduced motion is not requested. The stamp is `aria-hidden`; the verdict title and folio head carry the same information as text.

## Do's and Don'ts

### Do:
- **Do** put every step of the case on a folio sheet with its mono folio head and the case code.
- **Do** keep coral to one forward action per folio or dialog, with coral-ink text.
- **Do** pair every traffic-light colour with its stamp shape (octagon, triangle, circle) and its word.
- **Do** use the `-text` traffic-light variants for any severity text and the base inks only for strokes, stamps and borders.
- **Do** keep every tap target at 48px minimum and the quick exit visible on every case screen.
- **Do** separate sections inside a sheet with a dashed or 1px hairline rule rather than nesting cards.
- **Do** gate every authored motion behind `prefers-reduced-motion: no-preference`.

### Don't:
- **Don't** use gradients, glows or soft card stacks in the case world. (The P06 weather camouflage deliberately imitates a generic weather app and sits outside this world.)
- **Don't** use monospace for headings, buttons or decoration.
- **Don't** add a third Atkinson weight or a display face.
- **Don't** reuse exit slate for any control other than the quick exit.
- **Don't** add motion beyond the stamp press and the disclosure reveal; the stamp is the one authored moment.
- **Don't** draw a control's resting border lighter than `control-edge`; anything below 3:1 against the sheet fails WCAG 1.4.11.
