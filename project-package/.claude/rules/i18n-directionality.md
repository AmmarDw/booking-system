---
paths:
  - "**/*.{ts,tsx,js,jsx}"
  - "**/*.css"
  - "**/tailwind.config.*"
---

<div dir="rtl">

# قاعدة: التدويل (i18n) واتجاه الكتابة — Next.js App Router

> **النطاق.** قاعدة عامة لبناء تطبيقات متعدّدة اللغات وتراعي اتجاه الكتابة (عربي/إنجليزي) على **Next.js (App Router) + React + Tailwind**.
> **تحقّق من الواجهات البرمجية أثناء الكتابة** باستخدام أداة **context7 (MCP)** (المكتبات: `next-intl`، `next`) — فالإصدارات تتغيّر بسرعة.

---

## 1. اختر الأسلوب

| المسار | متى يُستخدم | المقايضة |
|---|---|---|
| **أ. `next-intl` + توجيه `[locale]`** *(الموصى به)* | تطبيقات متعدّدة اللغات فعليًا؛ روابط لكل لغة صديقة لمحرّكات البحث (SEO)؛ مكوّنات خادم (Server Components) | آمن من ناحية الأنواع (type-safe)، مبنيّ لأجل RSC؛ إعداد بسيط |
| **ب. React Context خفيف** | مشروع MVP/دورة، عدد قليل من النصوص، واجهة تعتمد على العميل (client) بشكل أساسي | بسيط؛ **يعمل على العميل فقط** (بلا روابط لكل لغة ولا ترجمة داخل مكوّنات الخادم) |

الافتراضي هو **أ**، إلا إذا كان المشروع MVP صغيرًا فعلاً يجعل **ب** أسرع.

---

## 2. قواعد غير قابلة للتفاوض (في كلا المسارَين)

1. **اضبط `dir` و`lang` على وسم `<html>` من جهة الخادم** لمنع قفزة التخطيط (layout jump) أو تعارض الترطيب (hydration mismatch):
   ```tsx
   // app/[locale]/layout.tsx
   <html lang={locale} dir={locale === 'ar' ? 'rtl' : 'ltr'}>
   ```
   اجمعها في دالة مساعدة واحدة `getDirection(locale)` — لا تكتب `rtl`/`ltr` مباشرةً داخل المكوّنات.
2. **استخدم خصائص CSS المنطقية (logical) لا الفيزيائية (physical)** — يجب أن ينعكس التخطيط تلقائيًا:

   | فيزيائي | منطقي (Tailwind) |
   |---|---|
   | `text-left`/`text-right` | `text-start` / `text-end` |
   | `left-0`/`right-0` | `start-0` / `end-0` |
   | `pl-*`/`pr-*` | `ps-*` / `pe-*` |
   | `ml-*`/`mr-*` | `ms-*` / `me-*` |
   | `border-l`/`border-r` | `border-s` / `border-e` |
   | `rounded-l-*`/`rounded-r-*` | `rounded-s-*` / `rounded-e-*` |

   أبقِ العناصر ذات الاتجاه الفعلي فيزيائية (قد تحتاج الأيقونات/السهام صيغة `rtl:`؛ و`translateX` ينعكس تلقائيًا تحت RTL).
3. **بنية مفاتيح مطابقة تمامًا بين اللغات**، مفروضة عبر نوع TypeScript:
   ```ts
   // messages/en.ts / ar.ts تشتركان في: type Messages = typeof en
   ```
4. **لا نصوص ثابتة مكتوبة مباشرةً في الواجهة.** كل نص معروض يأتي من قاموس الترجمة. نسّق التواريخ والأرقام عبر مُنسِّقات `Intl`/`next-intl`، لا بالدمج اليدوي للنصوص.
5. **لا تخلط الاتجاهين عشوائيًا** — أحِط أي نص من اتجاه معاكس مُضمَّن (مثل رابط لاتيني داخل نص عربي) بـ `dir="auto"` أو وسم `bdi`.

---

## 3. المسار أ — `next-intl` + `[locale]` (الموصى به)

```
app/
  [locale]/
    layout.tsx        # <html lang dir>، NextIntlClientProvider
    page.tsx
  ...
i18n/
  routing.ts          # اللغات المتاحة، اللغة الافتراضية
  request.ts          # getRequestConfig -> تحميل النصوص
middleware.ts         # تحديد اللغة والتحويلات
messages/
  en.ts  ar.ts        # قواميس الترجمة (بنية مشتركة)
```

- **مكوّنات الخادم (Server Components):** `const t = await getTranslations('namespace')`.
- **مكوّنات العميل (Client Components):** `const t = useTranslations('namespace')` تحت `NextIntlClientProvider`.
- **الاتجاه:** يُشتقّ من `locale` داخل `[locale]/layout.tsx` (من جهة الخادم) عبر `getDirection`.
- تحقّق من إعداد `next-intl` الحالي (middleware، `getRequestConfig`) عبر **context7** قبل الربط.

---

## 4. المسار ب — React Context خفيف (لمشاريع MVP)

يجب أن يقوم المزوّد (provider) بـ: اكتشاف اللغة الابتدائية (من الرابط أو localStorage) ← ضبط `dir`/`lang` على `<html>` ← إتاحة `t`، و`isRTL`، و`dir`. ومع ذلك، ارسم `dir`/`lang` من جهة الخادم في التخطيط الجذري (القاعدة 2.1). واحمِ مكوّنات i18n من جهة العميل من تعارض الترطيب:

```tsx
const [mounted, setMounted] = useState(false);
useEffect(() => setMounted(true), []);
if (!mounted) return <Skeleton />; // بنية محايدة إلى حين اكتمال التركيب
```

القواميس تشترك في بنية واحدة مفروضة بنوع محدّد (`en.ts`، `ar.ts`).

---

## 5. القائمة المرجعية قبل إطلاق i18n
- [ ] `<html dir lang>` يُعرَض من جهة الخادم؛ لا قفزة في التخطيط عند التحميل.
- [ ] البحث (grep) في الكود لا يُظهر أصناف Tailwind فيزيائية الاتجاه في التخطيط المتدفّق (`pl-`، `ml-`، `text-left`، `left-`).
- [ ] قاموسا `en`/`ar` يتحقّقان من الأنواع أمام بنية واحدة مشتركة؛ لا مفاتيح ناقصة.
- [ ] التواريخ والأرقام تستخدم `Intl`/مُنسِّقًا، لا دمج نصوص يدوي.
- [ ] اختبار دخان RTL: بدّل إلى العربية، وتحقّق من الانعكاس، واتجاه الأيقونات، والنصوص مختلطة الاتجاه.

---

*مصادر نمط App Router الحالي:* [توثيق next-intl لـ App Router](https://next-intl.dev/docs/getting-started/app-router) · [دليل next-intl من phrase.com](https://phrase.com/blog/posts/next-js-app-router-localization-next-intl/) · [شرح Localizely لـ i18n في Next.js](https://localizely.com/blog/nextjs-i18n-tutorial/).

</div>
