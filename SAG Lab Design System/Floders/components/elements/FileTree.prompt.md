Monospace directory tree, `dir="ltr"` enforced, with optional Arabic notes column.

```jsx
<FileTree tree={"my-mvp/\n├── app/\n│   └── page.tsx\n└── package.json"}
          notes={["مجلد app هو ما يقرؤه Claude أولاً"]} />
```

Never let a tree inherit RTL — the connectors invert and paths become unreadable. Inline paths inside prose use the `.tok-code` utility instead.