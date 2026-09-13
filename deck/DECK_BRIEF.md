# Day 1 — deck brief

The slide-by-slide plan I build `project-package/slides/day-01.html` from. Every slide names the curriculum section it
comes from, and every content slide carries that reference as a visible `section-badge` so a trainee
can find it again on the section's own slides.

**Source of truth:** `project-package/bootcamp_roadmap_and_curriculum.md`. If the two ever disagree,
the curriculum wins and this brief is wrong.

**50 slides.** Numbers below are the real slide positions in the built deck.

**Day 1 budget:** شرح المفاهيم 62 د · تطبيق مع المدرب 62 د · استراحة 25 د · عمل المتدربين 79 د · مراجعة 12 د.

---

## Session 1 — شرح المفاهيم (62 د)

| # | الشريحة | القالب | القسم | المدّة | ملاحظات |
|---|---|---|---|---|---|
| 1 | الغلاف | `slide-title` | — | — | تفصيلها أدناه |
| 2 | حزمة المشروع — وصلتكم؟ | `slide-quote` | §4 | 1 د | شريحة اقتباس داكنة: الحزمة = منطق المشروع وقوانينه وسياقه، و«نسخة مصغّرة من المدرب». التفصيل في الشريحتين 13–14 |
| 3 | رموز الشرائح | `slide-content` (bento 2×2) | — | 2 د | أربع إشارات، كلٌّ ببرهان حيّ على الشريحة نفسها: **Ctrl/⌘ + نقر** ينقلك للقسم (وBackspace يرجّعك) · تمرير الفأرة على خطّ منقّط · أيقونة **i** لمصطلح قصير · أيقونة **؟** تفتح نافذة مصطلحات الشريحة. لازم تسبق الشريحة 4، أول شريحة تستخدمها |
| 4 | أجندة اليوم — جلسة شرح المفاهيم | `slide-content` (session/tasks) | §6.1 | 3 د | 14 بندًا في عمودين · **✓ على ما غطّيناه فعلًا** حتى هذه الشريحة · «اليوم الأول أطول في الشرح» |
| 5 | أجندة اليوم — الجلسات الثلاث الباقية | `slide-content` (session/tasks) | §6.1 | 2 د | تطبيق 62 د · عملك 79 د · مراجعة 12 د · المهمة 8.1 بلا وقت مخصّص |
| 6 | أجندة اليوم — أهداف اليوم | `slide-content` (bento) | §6.1 | 3 د | ست بطاقات: ما نحقّقه اليوم من كل مهارة، وما يؤجَّل ولأي يوم |
| 7 | فهرس المحتويات | `slide-content` | فهرس المحتويات | 2 د | العناوين الرئيسية **فقط** (1–17)، بلا أقسام فرعية. مرور سريع: «هذا ما يحتويه المعسكر» |
| 8 | كيف نشتغل في المعسكر — بنية المنهج | `slide-content` | §1 | 3 د | الأقسام التعريفية 1–5 · الأجندة 6 · التأسيسي 7 · المنهجية 8–17 |
| 9 | منهجية العصف الذهني | `slide-quote` | §1 | 2 د | «اكتب كل ما يخطر ببالك أوّلًا، ثم رتّبه» — قاعدة تتكرّر طوال المعسكر |
| 10 | نبذة عن المعسكر | `slide-content` | §2 | 3 د | 10 أيام · 40 ساعة · MVP قابل للنشر · بلا خبرة برمجية عميقة |
| 11 | المهارات — ١/٢ | `skill-card` grid in `slide-content` | §3 | 2 د | 9 بطاقات، لا قائمة نقطية |
| 12 | المهارات — ٢/٢ | `skill-card` grid | §3 | 2 د | 9 بطاقات + «كل يوم يحقّق جزءًا منها» |
| 13 | حزمة المشروع — الشجرة | `slide-content` (`pkgtree`) | §4 | 3 د | شجرة الحزمة كاملة، 26 سطرًا، لكل سطر وصف من سطر و**؟** يفتح شرحًا أطول. مجلّدا `assets/` و`media/` بتلميح فقط — لا تخصّ المتدرّب. **عمودان بعرض المحتوى، موسّطان، والخطّ 37/38px** — العرض يُملأ بحجم الخطّ لا بتمديد عمود (امتلاء 94٪). و**تُمرّر داخل إطارها** والشريحة ثابتة — 13 سطرًا مرئيًا من 26 |
| 14 | حزمة المشروع — من وين تبدأ | `slide-content` (bento 2×2) | §4 | 2 د | أربع خطوات: نزّل المضغوط ← فكّ الضغط ← افتح Claude Code داخل المجلّد ← «السلام عليكم». **شريط علويّ يقول متى تُنفّذ كل خطوة**: 1–2 الآن، و 3–4 بعد البند 5 من 7.10 (رابط `reflink` → شريحة 38) |
| 15 | حزمة المشروع — ما تقرؤه أنت | `slide-content` (bento 2) | §4 | 2 د | يمين: `slides/day-01.html` + `PRODUCT.md` + `conversation_history.md`. يسار: `CLAUDE.md` + `.claude/rules/` + `.claude/skills/` + ملف المنهج — كلّها لـClaude. ملاحظة أسفل: لماذا القواعد والأدلّة منفصلة |
| 16 | يومك التدريبي | `agenda-row` × 5 in `slide-content` | §5.1 | 3 د | شرح ~45 د · تطبيق مع المدرب ~1 ساعة · استراحة 25 د · عملك ~1.5 ساعة · مراجعة ~30 د. **بلا نطاقات — متوسّطات مقرّبة**، مع «تتفاوت بحسب ما نُنجزه» |
| 17 | المراجعة ليست جلسة منفصلة | `slide-quote` | §5.1 | 2 د | المراجعة جزء من دورتك مع Claude، وتُفصل في الجدول للتخطيط فقط |
| 18 | الأجندة — مهامԏ كل يوم، وين تلقاها | `slide-content` | §6 | 2 د | شريط علويّ يشرح بنية بلوك اليوم (المهامԏ أولًا ثم الأهداف) · ثلاث بطاقات · إحصاءان. البطاقة الثالثة تحمل **؟** يفتح **خريطة المهامԏ الكاملة (29 مهمّة)** داخل نافذة عريضة (`data-wide`) — العمود الأوسط **«دورك فيها»** لا «مَن ينفّذها»: تقرّر وتوصف (10) · تراجع وتصحّح (7) · تجرّب وتعدّل (12). لا تُعِد شرح 5.1 |
| 19 | ما هو Claude و Claude Code؟ | `slide-content` (bento 2 + span-2) | §7.1 | 3 د | بطاقتان + **مثال الطبّاخ**: تكلّمه بالتلفون فيعطيك الوصفة، مقابل دخوله مطبخك وطبخه بنفسه. «الطرفية» أُزيلت — صارت `Terminal` ومعها تلميح `i` |
| 20 | الجلسة وذاكرة Claude | `slide-content` | §7.2 | 5 د | ثلاث بطاقات، ومثال محسوس للعزل («كمّل اللي وقفنا عنده أمس»). **`؟` يوضّح أن `conversation_history.md` ليس ميزة في Claude** بل قاعدة أضفناها في `.claude/rules/bootcamp-mvp-process.md`. وإحالة `reflink` إلى 7.4 للمعنى الآخر لـ«جلسة» |
| 21 | الرصيد والـtokens — ١/٢ | `slide-content` | §7.3 | 4 د | كيف تُحسب التكلفة |
| 22 | الرصيد والـtokens — ٢/٢ | `slide-media` | §7.3 | 3 د | **لقطة من Claude Desktop تُظهر الاستهلاك** |
| 23 | حدود خطة Pro | `slide-content` | §7.4 | 4 د | نافذة 5 ساعات + الحدّ الأسبوعي |
| 24 | ما التكاملات (MCP)؟ — ١/٢ | `slide-content` | §7.5 | 4 د | التعريف وممّ تتكوّن |
| 25 | ما التكاملات (MCP)؟ — ٢/٢ | `slide-content` | §7.5 | 4 د | لماذا اختُرعت |
| 26 | لماذا للـMCP تكلفة في كل رسالة؟ | `slide-content` | §7.6 | 4 د | تكلفة تكاملات **Claude** وحدها — لا علاقة لها بحزم Antigravity (شريحة 34) |
| 27 | ما المنتج الأولي (MVP)؟ | `slide-content` | §8 — المفهوم العام | 4 د | |
| 28 | الغايات مقابل النطاق | `slide-split` | §8 — المفهوم العام | 2 د | |

## Session 2 — تطبيق مباشر مع المدرب (62 د)

**These are the media-led slides.** Each is `slide-media` with one instruction line; the presenter
performs the step live while the slide shows the target screen.

| # | الشريحة | القالب | القسم | المدّة | الوسائط |
|---|---|---|---|---|---|
| 29 | تهيئة أدوات العمل — الخريطة | `slide-steps` | §7.10 | 2 د | 6 بنود كـ`step-chip` — نظرة عامة قبل البدء |
| 30 | ١) تثبيت Claude Code | `slide-media` | §7.10 بند 1 | 4 د | `01-claudecode-install-*.gif` |
| 31 | ١) تسجيل الدخول والتحقّق | `slide-media` | §7.10 بند 1 | 3 د | `02-claudecode-login.gif` |
| 32 | ٢) Git — إلزامي على كل الأنظمة | `slide-media` | §7.10 بند 2 | 5 د | `03-git-install-win.gif` · `04-git-macos-clt.png` |
| 33 | ٢) اضبط هويّتك في Git | `slide-media` | §7.10 بند 2 | 3 د | `05-git-config.png` — **بدونها يفشل أول حفظ** |
| 34 | ٣) Claude Desktop ومتابعة السقف | `slide-media` | §7.10 بند 3 | 3 د | `06-desktop-usage.png` |
| 35 | ٤) تثبيت Antigravity | `slide-media` | §7.10 بند 4 | 3 د | `07-antigravity-download.png` |
| 36 | ٤) خطوات البدء بعد التثبيت | `slide-steps` + `media-frame` | §7.10 بند 4 | 5 د | `08-antigravity-signin.png` · `09-antigravity-theme.png` |
| 37 | «Connect Plugins» تخصّ مساعد المحرّر | `slide-media` | §7.10 بند 4 | 2 د | `10-antigravity-plugins.png` — تجاوزها كلّها: حزمٌ لمساعد Antigravity (Gemini)، تُحفَظ مستقلّةً عن إعدادات Claude ولا يراها |
| 38 | ٥) إضافة Claude Code للمحرّر | `slide-media` | §7.10 بند 5 | 2 د | `11-extension-install.gif` |
| 39 | ٦أ) ربط context7 | `slide-media` | §7.10 بند 6 | 4 د | `12-context7-apikey.png` — المفتاح يُلصق في المحادثة، **وClaude يكتب أمر الربط** |
| 40 | ٦ب) إنشاء مشروع Supabase | `slide-media` | §7.10 بند 6 | 4 د | `13-supabase-newproject.png` |
| 41 | ٦ب) ربط Supabase MCP | `slide-media` | §7.10 بند 6 | 4 د | `14-supabase-mcp.png` |
| 42 | المهمة 14.1 — إنشاء مستودعك | `slide-media` | المهمة 14.1 | 8 د | `15-github-new-repo.png` — حقلًا حقلًا |
| 43 | المهمة 14.1 — Claude يهيّئ تطبيقك | `slide-steps` | المهمة 14.1 | 10 د | صِف فكرتك بجملة واحدة ← يهيّئ ← يربط القاعدة ← يشغّل |
| 44 | ماذا سترى حين يعمل | `slide-media` | المهمة 14.1 | 12 د | `16-app-running.png` — صفحة تسجيل الدخول |

## Session 3 — عمل المتدربين (79 د) · Session 4 — مراجعة (12 د)

| # | الشريحة | القالب | القسم | المدّة | ملاحظات |
|---|---|---|---|---|---|
| 45 | دورك الآن — ١/٢ | `slide-steps` | §7.10 | 30 د | أكمل التثبيت · أنشئ مشروع Supabase · اربط التكاملَين. **«يتفاوت بحسب جهازك»** ظاهرة على الشريحة |
| 46 | دورك الآن — ٢/٢ | `slide-steps` | المهمة 14.1 | 39 د | مستودعك 7 د · فكرتك بجملة 22 د · شغّله 10 د |
| 47 | أول حفظ ورفع | `slide-media` | المهمة 14.1 | 10 د | `17-first-commit.png` |
| 48 | مراجعة اليوم | `slide-closing` | المهمة 14.1 | 12 د | تطبيقك يعمل + تسجيل الدخول يفتح = اليوم ناجح |
| 49 | إن بقي لديك وقت | `slide-content` | المهمة 8.1 | — | **بلا وقت مخصّص:** ابدأ بجمع ملاحظاتك الحرّة عن فكرة مشروعك — والإكمال غدًا |
| 50 | غدًا | `slide-closing` | §6.2 | — | لمحة عن اليوم 2: تعريف المنتج ونطاقه ومستخدموه |

---

## Slide 1 — الغلاف (exact content)

**Surface:** dark (`--brand-deep`). **Hero mark:** ساج لاب wordmark, large, upper area.

**العنوان:**
> برنامج تدريبي تطبيقي لبناء المنتجات الرقمية
> **من الفكرة إلى منتج منشور**

**تحته:**
> بناء مشاريع تقنية أولية (MVP) باستخدام Claude
> رحلة تطبيقية متكاملة لتحويل الفكرة إلى منتج تقني قابل للاستخدام والاختبار والنشر.

**شريط الحقائق** (four `timing-pill`-style items):
`Claude + Claude Code` · `أسبوعان، من الأحد إلى الخميس` · `40 ساعة تدريبية` · `10 أيام تدريبية`

**`presenter-block`:**
- Circular photo from `C:\Users\ammar\personal\photo.png`, ~180 px, 2 px `--brand-sky` ring.
- **إعداد وتقديم: م. عمار محمد أنمار دويدري**
- <span dir="ltr">Eng. Ammar Mohamed Anmar Dwidari</span> — Latin name forced LTR so it does not mirror
- صمّم محتوى المعسكر ومنهجه بالكامل

> The **م. / Eng.** title is used every time the name appears anywhere in the deck.

**التذييل:** `مقدم من شركة ساج التقنية` + the SAG TECH horizontal lockup, small, bottom corner.
**No legal-entity line** — so `Logo_Full.svg` is not used anywhere.

---

## Rules the build must honour

- **No slide scrolls.** Content budget: ≤ 7 bullets, ≤ ~90 Arabic words, ≤ 8 table rows. Over budget
  ⇒ split into `١/٢`, `٢/٢`. A build-time check fails the build if any slide overflows its frame.
- **Every content slide shows its `section-badge`** — that badge is the trainee's route back to the guide.
- **Durations on slides are rounded and prefixed «تقريبًا»**, matching §5.1's «المدد تقديرية لا حرفية».
- **Media is referenced from `project-package/slides/media/`, never embedded** — keeps the file light and shared across days.
- Days 2–10 add a new `day-NN.html` only; they add **no new design work**.
