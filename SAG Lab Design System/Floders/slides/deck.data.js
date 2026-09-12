const S = window.SAGLabDesignSystem_5a6e2d;
const day = "اليوم السابع";
const presenter = { name: "م. عبدالله السعيد", role: "مدرّب معمل بناء المنتج", org: "ساج لاب — بإشراف ساج التقنية" };

window.SAG_SLIDES = [
  { id: "title", label: "slide-title", el: () => (
    <S.SlideTitle program="معمل بناء المنتج الأدنى القابل للتطبيق"
      subtitle="عشرة أيام لبناء منتج حقيقي مع Claude Code"
      presenter={presenter} day={day} slideNumber={1} />
  ) },
  { id: "section", label: "slide-section", el: () => (
    <S.SlideSection number="7.10" title="قراءة ما يكتبه Claude"
      subtitle="كيف تتابع خطواته دون أن تفقد السياق" day={day} slideNumber={41} />
  ) },
  { id: "content", label: "slide-content", el: () => (
    <S.SlideContent badge={{ kind: "القسم", number: "7.10" }}
      title="ماذا يقرؤه Claude من مستودعك؟"
      lead="الترتيب ليس عشوائيًا — وهذا ما يجعل الوصف الدقيق مهمًا."
      bullets={[
        <span>ملفات الإعداد أولاً: <span className="tok-code">package.json</span> ثم <span className="tok-code">README.md</span></span>,
        <span>ثم بنية المجلدات، لا محتوى كل ملف</span>,
        <span>ثم الملفات التي ذكرتها أنت في الطلب</span>,
        <span>ثم الملفات المرتبطة بها عبر الاستيراد</span>,
        <span>ما لم يُذكر ولم يُستورد يبقى خارج السياق</span>
      ]}
      focusIndex={2} day={day} slideNumber={42}
      progress={<S.DayProgress activeDay={7} within={45} />}>
      <S.Callout tone="rule">اذكر المسار كاملاً في طلبك — <span className="tok-code">app/(dashboard)/page.tsx</span> — ولا تعتمد على التخمين.</S.Callout>
    </S.SlideContent>
  ) },
  { id: "split", label: "slide-split", el: () => (
    <S.SlideSplit badge={{ kind: "القسم", number: "7.11" }} title="قراءتان لنفس الملف"
      start={{ label: "ما تقرؤه أنت", items: ["اسم الملف ومكانه", "التعليقات التي كتبتها", "ما تتذكّره من الأمس"] }}
      end={{ label: <span>ما يقرؤه <span className="tok-lat">Claude</span></span>, items: ["البنية والاعتماديات", "أسماء الدوال والأنواع", "ما ورد في طلبك الآن فقط"] }}
      day={day} slideNumber={43} />
  ) },
  { id: "media", label: "slide-media", el: () => (
    <S.SlideMedia badge={{ kind: "المهمة", number: "14.1" }} title="أول تشغيل داخل المشروع"
      instruction="اكتب الأمر، ثم اقرأ الخطة كاملة قبل الموافقة عليها."
      layout="stacked"
      media={{ placeholder: "لقطة شاشة — نافذة Claude Code بعد /init", caption: "الخطة تظهر قبل التنفيذ، ويمكنك رفضها.", callouts: [{ x: "7%", y: "16%" }, { n: 2, x: "38%", y: "62%" }] }}
      day={day} slideNumber={44} />
  ) },
  { id: "steps", label: "slide-steps", el: () => (
    <S.SlideSteps badge={{ kind: "القسم", number: "7.12" }} title="من الفكرة إلى أول نشر" activeIndex={2}
      steps={[
        { title: "أنشئ المستودع", note: <span>على <span className="tok-lat">GitHub</span>، فارغًا بلا قوالب</span> },
        { title: <span>شغّل <span className="tok-lat">Claude Code</span> من مجلد المشروع</span>, note: "من الطرفية، لا من المتصفح" },
        { title: "اطلب أصغر نسخة تعمل", note: "شاشة واحدة، وظيفة واحدة" },
        { title: <span>انشر على <span className="tok-lat">Vercel</span></span>, note: "ثم شارك الرابط في المعمل" }
      ]} day={day} slideNumber={45} />
  ) },
  { id: "table", label: "slide-table", el: () => (
    <S.SlideTable badge={{ kind: "القسم", number: "7.13" }} title="الأوامر التي ستستخدمها اليوم"
      caption="احفظ هذه الشريحة — ستعود إليها في كل يوم لاحق."
      columns={[{ label: "الأمر", width: "26%" }, { label: "ما يفعله" }, { label: "المدة", width: "14%", numeric: true }]}
      rows={[
        [<span className="tok-code">/init</span>, "يقرأ المستودع ويبني ملف السياق", "٢ د"],
        [<span className="tok-code">/plan</span>, "يعرض خطة قبل أي تعديل", "١ د"],
        [<span className="tok-code">/diff</span>, "يُظهر ما تغيّر قبل الحفظ", "١ د"],
        [<span className="tok-code">npm run dev</span>, "يشغّل النسخة المحلية", "٣ د"]
      ]} focusRow={1} day={day} slideNumber={46} />
  ) },
  { id: "quote", label: "slide-quote", el: () => (
    <S.SlideQuote tone="rule" text="لا تطلب من Claude ما لا تستطيع وصفه في سطر واحد."
      attribution="قاعدة المعمل الأولى" day={day} slideNumber={47} />
  ) },
  { id: "closing", label: "slide-closing", el: () => (
    <S.SlideClosing title="نهاية اليوم السابع"
      accomplished={[
        { icon: "terminal", text: "شغّلت أول أمر داخل المشروع" },
        { icon: "git-branch", text: "ربطت المستودع بـ GitHub" },
        { icon: "rocket", text: "نشرت نسخة تعمل على الإنترنت" }
      ]}
      next={["ربط المشروع بقاعدة بيانات Supabase", "أول اختبار مع مستخدم حقيقي", "تجهيز عرض اليوم العاشر"]}
      day={day} slideNumber={48} progress={<S.DayProgress activeDay={7} within={100} />} />
  ) }
];
if (window.SAG_ON_SLIDES) window.SAG_ON_SLIDES();
