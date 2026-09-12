Numbered vertical sequence with optional thumbnails — the "do this, then this" frame.

```jsx
<SlideSteps title="من الفكرة إلى أول نشر" activeIndex={1}
  steps={[{ title: "أنشئ المستودع" }, { title: "شغّل Claude Code", note: "من مجلد المشروع" }]} />
```

3–6 steps. Past steps show a navy check, the active step is teal, the rest are outlines.