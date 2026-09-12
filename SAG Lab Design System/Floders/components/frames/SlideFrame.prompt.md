The 16:9 shell every other frame is built on — use it directly only for a layout the nine named frames do not cover.

```jsx
<SlideFrame surface="dark" day="اليوم الأول" slideNumber={3}>…</SlideFrame>
```

Fixed 1920x1080 with 96px safe margins and a 96px footer zone. Scale it to the viewport with a CSS `transform`, never by changing font sizes.