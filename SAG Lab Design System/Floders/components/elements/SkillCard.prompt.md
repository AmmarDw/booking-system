Small card for one acquired skill — used in a 3-across grid on closing slides. Wrap several in `<div className="sag-skill-grid">`.

```jsx
<div className="sag-skill-grid">
  <SkillCard icon="terminal" text="تشغيل أول أمر في Claude Code" />
  <SkillCard icon="git-branch" text="ربط المستودع بـ GitHub" state="done" />
</div>
```

Set `--cols` on the grid to change from 3 columns.