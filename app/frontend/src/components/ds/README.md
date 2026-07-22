# BookIt Design System (pulled from Claude Design)

Synced from the Claude Design project **BookIt Design System** (`2f7aa67d-…`) via the DesignSync tool.

## Layout
- `tokens/` — CSS custom properties: `colors.css` (teal primary + availability-pressure scale + light/dark), `typography.css` (Inter + IBM Plex Sans Arabic, RTL font swap), `spacing.css` (space/radius/shadow), `fonts.css`, `base.css`.
- `components/` — ES-module React components, importable via the barrel: `import { Button, Card, CalendarDayCell, ... } from "@/components/ds"`. Styling is class-based (`bk-*`) from `components/components.css`.
- `styles.css` — imports all tokens + component CSS. Loaded globally by `src/app/globals.css`.
- `screens-reference/` — **reference only.** The 4 Claude Design screens (SearchScreen, ProviderScreen, BookingsScreen, NavShell). They use Claude Design's sandbox globals (`window.BookItDesignSystem_*` / `window.BookItKit`), **not** ES imports, so they are **not importable**. Use them as visual/composition references when building the real Next.js pages: swap the globals for `@/components/ds` imports and the mock data for API data.

## Components available
Button · Input · Select · Accordion · Badge · Card · CalendarDayCell · Table · Tabs · Modal · Toast

## Notes
- Components are `.jsx` (untyped). `allowJs` is on; add prop types when composing pages if desired.
- Only 4 reference screens exist (not all 10 page prompts) — remaining pages (report §6.4 A–J) are composed from these components. This is the intended Design-System-first outcome.
