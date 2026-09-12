The workhorse content slide: badge, one heading, sky rule, optional lead, up to 7 bullets.

```jsx
<SlideContent badge={{ number: "7.10" }} title="ماذا يقرؤه Claude من مستودعك؟"
              bullets={["ملفات الإعداد أولاً", "ثم الصفحات المرتبطة بالمهمة"]} focusIndex={0} />
```

`focusIndex` is the static focus highlight — a sky tint and a teal inline-start edge on one bullet, letting a presenter point without animation. Non-focused bullets keep full-opacity ink: nothing in this system dims body text. Budget: ≤7 bullets, ≤~90 Arabic words.