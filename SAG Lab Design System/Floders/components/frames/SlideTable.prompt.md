Compact reference table — header row in `--brand-snow`, hairline rules, max 8 rows.

```jsx
<SlideTable title="الأوامر الأساسية"
  columns={["الأمر", "ما يفعله", { label: "المدة", numeric: true }]}
  rows={[[<span className="tok-code">/init</span>, "يقرأ المستودع", "٢ د"]]} focusRow={0} />
```

Wrap commands and paths in `.tok-code`, and Latin product names in `.tok-lat`, so cells do not reorder.