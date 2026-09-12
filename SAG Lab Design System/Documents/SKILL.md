---
name: sag-lab-design
description: Use this skill to generate well-branded interfaces and assets for SAG Lab (ساج لاب), either for production or throwaway prototypes/mocks/etc. Contains essential design guidelines, colors, type, fonts, assets, and UI kit components for protoyping.
user-invocable: true
---

Read the README.md file within this skill, and explore the other available files.
If creating visual artifacts (slides, mocks, throwaway prototypes, etc), copy assets out and create static HTML files for the user to view. If working on production code, you can copy assets and read the rules here to become an expert in designing with this brand.
If the user invokes this skill without any other guidance, ask them what they want to build or design, ask some questions, and act as an expert designer who outputs HTML artifacts _or_ production code, depending on the need.

## This system in one paragraph

Arabic, right-to-left, presentation-only. Every artifact is a fixed 16:9 slide frame (1920×1080)
with 96px safe margins and a reserved 96px footer zone; nothing scrolls and nothing reflows.
Two navies (#223A71 heading, #142447 dark surface), sky #38B6D9 for **structure**, teal #16C7B7 for
**state** only, snow #EEF2F8 cards, ink #333B48 body at full opacity. IBM Plex Sans Arabic with
line-height 1.75; body never below 22px. Logical CSS properties only; Latin fragments and code are
wrapped so they cannot reorder the Arabic line. Max 2px shadow, no gradients, no emoji, no animation
that carries meaning. Budget per slide: ≤7 bullets, ≤~90 Arabic words, ≤8 table rows.
