Rounded, 2px-lift container for a screenshot, GIF or short clip, with optional caption and numbered callout dots for pointing at UI.

```jsx
<MediaFrame src="./claude-code.png" caption="نافذة Claude Code بعد أول أمر"
            callouts={[{ x: "8%", y: "18%" }, { n: 2, x: "42%", y: "64%" }]} />
```

Callout `x` is measured from the **start** (right) edge — it mirrors with the layout. On `slide-media` this frame must occupy ≥55% of the slide.