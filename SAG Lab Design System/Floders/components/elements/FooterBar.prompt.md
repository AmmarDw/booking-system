The reserved footer zone of every slide frame: endorsement mark (start/right), optional progress, day + slide number (end/left).

```jsx
<FooterBar day="اليوم السابع" slideNumber={42} progress={<DayProgress activeDay={7} />} />
```

Frames render this for you when you pass `day` / `slideNumber`; use it directly only when composing a custom frame.