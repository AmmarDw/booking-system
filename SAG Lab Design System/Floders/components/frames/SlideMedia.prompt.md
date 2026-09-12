The most important frame in the deck — media-dominant, image ≥55% of the frame, text supporting it.

```jsx
<SlideMedia badge={{ number: "7.10" }} title="أول تشغيل"
  instruction="اكتب الأمر ثم انتظر ظهور الخطة قبل الموافقة."
  media={{ src: "./run.gif", caption: "الخطة تظهر قبل التنفيذ", callouts: [{ x: "10%", y: "22%" }] }} />
```

The default `layout="stacked"` gives the image ~58% of the frame; it drops the frame caption (the instruction line beneath does that job) and sets the badge inline with the title to buy the image height. `layout="side"` drops it to ~39%, so it is reserved for tall/portrait screenshots and is the one place the >=55% budget does not hold. Never add a second text block — that is a `slide-split`.