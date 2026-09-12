Two-column comparison — «ما تقرؤه أنت» / «ما يقرؤه Claude».

```jsx
<SlideSplit title="قراءتان لنفس الملف"
  start={{ label: "ما تقرؤه أنت", items: ["الاسم", "التعليقات"] }}
  end={{ label: "ما يقرؤه Claude", items: ["البنية", "الاعتماديات"] }} />
```

`start` is the right column — reading order, not screen position. Both columns keep the same item count so the frame stays balanced.