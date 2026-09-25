# Media shot list

**Day 1 is the bulk of this file** — it was the recording-heavy onboarding day. From **2026-09-25** days 2–10 carry recordings too: the showcase reversal made every section's tasks a recorded demo on the course stack. Day 1 first, then a section per later day.

I cannot capture these: they are installers, browser dialogs and account screens on your machine.
**You record them, drop them in `project-package/slides/media/` with the exact filename below, and I wire them in.**

**Format rules**

- **Filenames exactly as written** — the deck references them by name.
- **PNG** for a single state · **MP4** for any sequence (no audio). **Not GIF.** A GIF has no
  playback API, and Chromium's `drawImage()` on an animated GIF returns frame 0 no matter what is on
  screen — measured, not assumed — so the deck's pause button could only ever snap the recording back
  to its thumbnail. `.gifbox` now drives a `<video>`, which stops on the frame the room is looking
  at; a box holding a plain `<img>` hides its pause button rather than lying about pausing.
- Capture at **1920×1080 or larger**, then crop tight to the relevant window. A full desktop shot is
  unreadable on a projector.
- **Use a clean throwaway account and a neutral desktop.** Several of these frames show account screens.
- ⚠ **Never capture a real key, token or password.** Blur or crop the value itself — the slide only
  needs to show *where* the button is, not the value. (This bit us for real once already: see the
  `context7-redacted.mp4` note below.)
- Prefer **light OS theme** — it matches the deck's light surfaces and reads better projected.

## ⚠ Reconciled against the built deck (49 slides)

`project-package/slides/day-01.html` consumes **12 media slots — all delivered now.**

~~`06-desktop-usage.mp4`~~ (تم) · ~~`node-js.mp4`~~ (تم) · ~~`chrome-devtools.mp4`~~ (تم) ·
~~`initial-build.mp4`~~ (تم) · ~~`push-1.mp4`~~ (تم) ·
~~`16-app-running.png`~~ (لم تعد لازمة — `initial-build.mp4` يغطّيها) ·
~~`github-auth.mp4`~~ (لم تعد لازمة — `github.mp4` يغطّيها) ·
~~`17-first-commit.png`~~ (لم تعد لازمة — `push-1.mp4` يغطّيها)

**Most of these shots are done, delivered under their own names rather than the placeholders below** —
each of these turned out better as one continuous recording than as the still frames originally
planned, so the slide embeds the real file directly (`<video controls>`, not a `media-frame`
placeholder):

- Slide 22 embeds `06-desktop-usage.mp4` (13.7s) as a `stepvid` now, not the old autoplay-loop
  `gifbox` — 4 timestamped steps (open the sidebar → Settings from the account name → Usage from the
  left nav → read the two usage bars). Same file also used by slide 31 below.
- Slide 31 embeds `claude-desktop.mp4` (Claude Desktop's install-and-login walkthrough).
- Slide 32 embeds `claude-code.mp4` (Claude Code's install-and-login walkthrough, with the real
  PATH-error hiccup and its fix) — this merge is also why the deck dropped from 51 slides to 50:
  slide 32's old "install" and 33's old "sign in" placeholders are now one slide with a scrollable,
  timestamped step list next to the video.
- Slide 34 embeds `git-setup.mp4` (1:46) — a single file joining `git.mp4` (install) and
  `git-auth.mp4` (identity setup) end to end. The identity section's step timestamps are the
  original `git-auth.mp4` times **plus `git.mp4`'s duration (50.7s)** — e.g. its `0:16` step is
  `1:07` in the joined file. This replaced the old `03-git-install-win.mp4` and `05-git-config.png`
  placeholders; slide 33 (the three-OS-card comparison) is untouched — the recording is
  Windows-only, so it doesn't replace the cards, it demonstrates what card #1 describes. The two
  source clips are kept in `media/` for reference but no longer referenced by the deck.
  **The identity half was re-shot (2026-09-20)** to the browser-driven sequence now on the slide,
  and the join is no longer a pure stream copy: the new clip is **1080p** while `git.mp4` is
  **720p**, and `-c copy` cannot splice mismatched resolutions. So `git.mp4` alone was upscaled and
  re-encoded once (`scale=1920:1080:flags=lanczos`, x264 CRF 18), and the re-shot clip was then
  concatenated into it **untouched** — verified by matching four frames (120/480/900/1440)
  byte-for-byte against the standalone file at +1521 frames, and by 1521 + 1684 = 3205 frames in the
  result. If either source is ever re-shot again, redo the upscale; do not `-c copy` across the
  resolution change.
- Slide 35 embeds `antigravity-ide.mp4` (2:00) — download through first-run onboarding to opening
  the project folder. This one recording surfaced real friction the deck never documented: a mobile
  QR-code account-verification step and a second sign-in some accounts need after that — both are
  now steps on the slide, framed as "if this happens to you" rather than a universal requirement.
  Replaced `07-antigravity-download.png`, `08-antigravity-signin.png`, `09-antigravity-theme.png`
  and `10-antigravity-plugins.png` — three slides (old 35, 36, 37) collapsed into this one.
- Slide 36 embeds `claude-code-extension.mp4` (1:08) — search the extension, a **"trust the
  publisher?" prompt no version of the deck had mentioned**, open the new Claude Code panel
  (separate from Antigravity's own Gemini-powered "Agent" panel), send "السلام عليكم", and watch the
  real reply: Claude actually reads `PRODUCT.md`/`conversation_history.md`/the curriculum to work
  out it's day one, then lists everything the trainee should already have done and states what it
  does first once they confirm — this is `CLAUDE.md`'s §أ.1/§أ.2 logic actually firing, caught on
  camera for the first time. Slide 17 only ever teased this in one line ("Claude will introduce
  itself..."); this slide is now the dedicated place that shows it. Replaced
  `11-extension-install.mp4` (never captured).
- Slide 37 embeds `node-js.mp4` (1:55) — the Node.js install (7.10 item 6), added because `github.mp4`
  caught Claude stopping mid-scaffold over a missing Node.js that no version of the deck had ever
  asked the trainee to install. Steps timed against Gemini's timestamped transcript of the real
  recording: download from nodejs.org and pick LTS (0:27) → run the installer on its defaults,
  **including accepting the license agreement — a real click the original steps never mentioned**
  (0:38) → the Tools for Native Modules screen, left unchecked (0:46, estimated inside Gemini's
  unsplit 0:38–0:54 installer window) → manual verification in a fresh command prompt with `node -v`/
  `npm -v` (0:54) → **two steps added from the recording that weren't in the original six**: asking
  Claude to verify instead of/in addition to the manual check (1:15 — Claude ran the same two checks
  itself over PowerShell in the background), and reviewing the session from `conversation_history.md`
  rather than scrolling Claude Code's own chat panel, because the panel's fixed LTR/RTL alignment
  garbles mixed Arabic/English text where the file's own formatting is under our control (1:42). One
  segment Gemini's transcript caught (0:00–0:27, the trainee asking Claude inside the IDE to summarize
  slide 37's own steps before opening the browser) was deliberately **left off the slide** — it's a
  detour that teaches nothing a trainee following the slide wouldn't already have.
- Slide 38 embeds `chrome-devtools.mp4` (0:29) — chrome-devtools moved here from task 14.2 (where every prior version of the curriculum deferred it) once the initial-build.mp4 recording showed it's actually needed from day one. Four steps, the shortest setup in the deck by a wide margin: open a fresh terminal, `claude plugin marketplace list`, `claude plugin install chrome-devtools-mcp@claude-plugins-official` (~15s wait), `claude mcp list` to confirm. **The one integration the trainee types themselves, not Claude** — confirmed against the official Claude Code plugin-marketplace docs: the install command opens an interactive confirmation view, which an agent's own Bash tool can't drive. The slide says so explicitly in step 1 so it doesn't read as a contradiction of "Claude writes the connection commands" on the other two integrations.
- Slide 39 embeds `context7-redacted.mp4` (1:49) — ask Claude for the steps (a real quoted prompt),
  sign in to context7.com, create an API key, paste it back, restart the editor, then watch Claude
  actually *test* the connection (not just check its status) by looking up real docs before
  confirming. **⚠ Security: the raw recording (`context7.mp4`) shows a real, fully-readable API key
  on screen for ~50s (0:56–1:46) — first on context7.com's "key created" modal, then pasted into the
  chat.** Redacted with `ffmpeg`'s `gblur` over exactly that window before wiring it into the slide
  (verified frame-by-frame: sharp right up to 0:55, fully unreadable through 1:46, sharp again by
  1:48). **The unredacted `context7.mp4` is still sitting in `media/` with the key fully visible** —
  delete it once you've confirmed that key is revoked on context7.com's dashboard. Replaced
  `12-context7-apikey.png` (never captured).
- Slide 40 embeds `supabase.mp4` — **re-recorded in full (3:22, replacing the 2:51 take)**. The new
  take actually shows the project-brief exchange on screen: the trainee asks what's next, Claude
  confirms Node.js/context7 are fine and asks for a one-line brief on the project idea, then
  **Claude itself proposes the Supabase project name** (`darrisni` in this recording) and recaps the
  coming steps before anything else happens. Both of those used to be markup-only placeholders (a
  `stepvid__step--new` "added" step with no timestamp, and a `stepvid__fix` note on "create the
  project" saying Claude would suggest the name) — now they're two real, timestamped steps, and both
  workaround markers are gone. Then: sign in (**the agent opens the browser itself**, the trainee
  only completes the GitHub login), **create an organization** (a real one-time prerequisite),
  create the project (password stays masked as dots — never exposed; the form now also shows
  `Enable Data API`/`RLS` security toggles left on their defaults, not covered before), connect the
  MCP, adjust the feature groups, paste the setup command, authenticate from a separate terminal
  (browser OAuth — no static token in the command). Two details this take newly reveals here: the
  concrete method shown is opening the project folder in File Explorer and right-clicking → `Open in
  Terminal`, and the very first `claude` run in a project after adding an MCP server shows a one-time
  trust prompt (`Use this MCP server`) that wasn't documented anywhere before. Then verify twice:
  right after linking (Claude says a restart is needed) and once after restarting (Claude actually
  lists the database's tables before confirming — word-for-word what it says on screen). Replaced
  `13-supabase-newproject.png` and `14-supabase-mcp.png` (never captured).
- Slide 41 embeds `github.mp4` (1:24) — ask Claude for the steps (it checks your Git identity
  first), copy a suggested repo name, create it on GitHub (Private, README/.gitignore/license left
  blank), hand the URL and a one-line product idea back to Claude, then watch it actually check your
  environment — the recording caught a genuinely missing prerequisite (**no version of the deck had
  ever mentioned Node.js**) — before writing a real plan file and presenting the three real
  accept-plan choices (auto-accept / manually approve / keep planning). No secrets on screen; checked
  before use. Replaced `15-github-new-repo.png` (never captured).
  **Two of this recording's steps no longer match the flow and are annotated on the slide rather
  than reshot:** the missing Node.js is now installed back at 7.10 item 6 (new slide 37), and the
  product idea is now handed over before the Supabase steps, not here — so the suggested repo name
  in the recording is generic where a trainee's will not be. Both carry a `.stepvid__fix` amber note.

**One entry below has no slot in the built deck — don't shoot it:**

| Shot | Why it has no slot |
|---|---|
| `04-git-macos-clt.png` | Slide 33 covers macOS as one text card (`git --version` triggers the Xcode Command Line Tools prompt) — a screenshot of that prompt doesn't add much a presenter can't just say |

Tell me if you'd rather that become a real media slide and I'll restructure the slide to hold it.

---

| # | Filename | Type | OS | What must be visible | Slide |
|---|---|---|---|---|---|
| 4 | `04-git-macos-clt.png` | PNG | macOS | The **Xcode Command Line Tools** prompt that appears after `git --version` | 33 |
| 6 | ✅ `06-desktop-usage.mp4` | MP4 | any | Claude Desktop usage screen showing the 5-hour window and the weekly limit | 31, 22 |
| 6b | ✅ `claude-desktop.mp4` | MP4 | any | Download the installer, run it, and sign in — through to the app's first ready chat. Delivered under its own name, not `06b-desktop-install.mp4` | 31 |
| 6c | ✅ `claude-code.mp4` | MP4 | Windows | Install → the real PATH-error hiccup and its fix → relaunch → sign-in in the browser → back to a trusted, ready prompt — one continuous take, 1:19 long. Timestamped in the slide's step list | 32 |
| 6d | ✅ `git-setup.mp4` | MP4 | Windows | Download the installer from git-scm.com, run it, click through the wizard's defaults (**except overriding the default branch name to `main`**), Install → Finish, verify with `git --version` — then the re-shot identity half: each command pasted first, its value fetched from GitHub's own settings, then substituted and run, ending at `git config --global --list`. One joined file, **1:46** long, 1080p (`git.mp4` upscaled + `git-auth.mp4` stream-copied) | 34 |
| 7e | ✅ `antigravity-ide.mp4` | MP4 | Windows | Download → installer wizard defaults → Finish → sign in with Google → **mobile QR verification if prompted** → **sign in again if the IDE doesn't notice** → theme → two default onboarding screens → skip the plugin packs → privacy screen → Open Folder → trust the authors. One continuous take, 2:00 long | 35 |
| 11 | ✅ `claude-code-extension.mp4` | MP4 | any | Extensions panel → search **Claude Code for VS Code** → **trust the publisher** → Install → open the new Claude Code panel → send "السلام عليكم" → real tool calls reading the project's files → the actual `CLAUDE.md`-driven greeting reply. One continuous take, 1:08 long. Replaced `11-extension-install.mp4` (never captured) | 36 |
| 6d-v2 | ✅ `git-auth.mp4` (re-shot) | MP4 | Windows VM | Open the command prompt → paste `git config --global user.name "Your Name"` **without running it** → github.com → Settings → Profile → copy the name at the top → substitute and run → paste the `user.email` command **without running it** → Settings → Emails → scroll to the bottom → tick **Keep my email addresses private** → copy the `ID+username@users.noreply.github.com` address → substitute and run → `git config --global --list`. 56.1s, 1080p. The account's Primary email address is legible on the Emails page at roughly 0:36–0:44 (1:27–1:35 merged) — **reviewed and accepted deliberately**: the trainer's own address, shown to a small known group, and the account is intentionally the trainer's real one so the GitHub authorization recorded on the VM carries over to their main machine. No redaction needed | 34 |
| 15f | ~~`github-auth.mp4`~~ **superseded** | — | — | **No longer needed.** This row asked for a separate capture of the GitHub OAuth authorization page, back when `github.mp4` predated that step. The `github.mp4` re-recording (2026-09-21) already shows it live — the `ارفع هيكل مشروعك` step (slide 41, 1:16) captures Git pushing the skeleton, the real **Authorize Git Credential Manager** browser page opening, and the push completing — so a standalone clip would only duplicate what's already on screen. Original request kept for the record: |
| 11b | ✅ `node-js.mp4` | MP4 | Windows | Open nodejs.org/en/download → pick LTS → download the `.msi` → run the wizard on its defaults, accepting the license agreement → the **Tools for Native Modules** screen left unchecked → Install → Finish → open a new command prompt → `node -v` then `npm -v` → ask Claude to verify the install too (it runs the same checks over PowerShell) → review the session via `conversation_history.md` rather than Claude Code's own chat panel. One continuous take, 1:55 long. Timestamped in the slide's step list from Gemini's transcript | 37 |
| 12 | ✅ `context7-redacted.mp4` | MP4 | any | Ask Claude for the steps → sign in to context7.com → create + copy an API key → paste it back → restart the editor → Claude tests the connection with a real doc lookup before confirming. One continuous take, 1:49 long. **Blurred 0:56–1:46** (`gblur`) to cover a real API key visible in the raw recording — see the ⚠ note above. Replaced `12-context7-apikey.png` (never captured) | 39 |
| 13d2 | ✅ `chrome-devtools.mp4` | MP4 | any | Open a fresh terminal → `claude plugin marketplace list` → `claude plugin install chrome-devtools-mcp@claude-plugins-official` → `claude mcp list` to confirm `chrome-devtools … ✔ Connected`. One continuous take, 0:29 long — the shortest of the three day-one integrations. | 38 |
| 13e | ✅ `supabase.mp4` | MP4 | any | Ask what's next → answer Claude's question about the project idea → Claude proposes the project name and recaps the plan → sign in (agent opens the browser itself) via GitHub → create an organization → create the project (password stays masked; security toggles left default) → Connect → MCP → Claude Code → adjust feature groups → copy the setup command → authenticate from a separate terminal (Open in Terminal, one-time trust prompt, browser OAuth) → verify, restart, verify again with a real table listing. One continuous take, re-recorded in full, 3:22 long. Replaced `13-supabase-newproject.png` and `14-supabase-mcp.png` (never captured) | 40 |
| 15e | ✅ `github.mp4` | MP4 | any | Ask Claude for the steps (it checks your Git identity first) → copy a suggested repo name → create it on GitHub (Private, README/.gitignore/license left blank) → hand back the URL + a one-line product idea → Claude checks your environment (**caught a real missing Node.js — new, previously undocumented**) → writes an actual plan file and presents the three real accept-plan choices. One continuous take, 1:24 long. Replaced `15-github-new-repo.png` (never captured) | 41 |
| 16a | ✅ `initial-build.mp4` | MP4 | any | The whole second half of task 14.1, one continuous take: issue the scaffold prompt with the "plain-language plan first" condition → Claude researches via context7 → plan appears in its two parts → approve `Yes, and auto-accept` → Claude builds into `application/` → **Chrome opens by itself under the "controlled by automated test software" banner** (chrome-devtools over MCP) → Claude fills the signup form, retries on server rejection, logs in, checks `/dashboard` is really protected → stops the server and **commits and pushes by itself** → summary → trainee opens the terminal, `cd application`, `npm run dev`, `localhost:3000`, signs up for real, confirms via the Supabase Auth email, logs in to the dashboard. **Edited:** four stretches sped 3× (orig 0:09–0:24, 0:42–1:28, 1:39–1:45, 1:59–2:09) → 3:15 becomes **2:24**; the silent audio track was dropped entirely (−91 dB, nothing to hear). Replaced `16-app-running.png` and the two card-only slides | 42 |
| 16 | ~~`16-app-running.png`~~ **superseded** | — | — | **No longer needed.** Slide 42 («ماذا سترى حين يعمل») was deleted and merged into the new slide 41, whose `initial-build.mp4` shows the running app for real. Original request kept for the record: | The scaffolded app running in a browser on `localhost`, **sign-in page open** | 42 |
| 17 | ~~`17-first-commit.png`~~ **superseded** | — | — | **No longer needed.** Slide 43 embeds `push-1.mp4` instead, a real recording of the trainee verifying the push rather than a still frame. Original request kept for the record: | Terminal after a successful first `commit` + `push`, and the repo showing the files on GitHub | — |
| 17a | ✅ `push-1.mp4` | MP4 | any | Ask Claude to confirm everything is pushed and up to date → Claude runs Git commands in the background and replies, naming `.env` and `node_modules` as deliberately excluded → refresh the repo page on GitHub, open the `application` folder to see the real uploaded files → switch between the editor's file tree and the GitHub page to confirm `.env.local` exists locally only. One continuous take, 0:47 long. Silent audio track (−91 dB), left as-is (no re-encode needed — nothing to speed up or trim). Timestamped from Gemini's transcript | 43 |

## Optional but worth it

| Filename | Why |
|---|---|
| `00-hero-loop.mp4` | A 5–8 s silent loop of Claude Code building something, behind the title slide. Strong opener; skip if time is short. |
| `04b-git-linux.png` | Only if you expect Linux trainees. |
| `01c-claudecode-install-linux.mp4` | Same. |

## Day 2 — تعريف المشروع ونطاقه

Recorded on **darrisni**, the project that now supplies every «شرح المفاهيم» demo. See
`.claude/skills/bootcamp-deck/references/showcase-strategy.md`.

| # | Filename | Type | What must be visible | Slide |
|---|---|---|---|---|
| d2-1 | ✅ `tasks-81-82.mp4` | MP4 | Tasks 8.1 and 8.2 end to end: the four questions on the deck → `notebook.txt` open in Notepad → the ready-made prompt typed into the Claude panel inside the IDE → the notebook pasted as the معطيات → Claude returns problem/goal/outcomes **without writing to `PRODUCT.md`** → previews reviewed → approval + the 8.2 scope request → scope **derived** from answer 4, four features, and a real gap offered as two explicit options → the trainer writes one message agreeing to the scope, choosing option (أ), and approving the last two lists → five features → commit & push → the three scope lists verified in `PRODUCT.md`. **Not in this cut:** the real session's correction round (splitting the ready-made prompt's merged problem/goal paragraph into two) — the trainer edited it out on purpose; it happened, but not on screen. One continuous take, **3:24**, 1080p. Delivered as `8.1_&_8.2_tasks.mp4` and renamed — `&` must be escaped in an HTML attribute and no other asset uses underscores | 9 |

| d2-2 | ✅ `tasks-91-92.mp4` | MP4 | Tasks 9.1 and 9.2 in one conversation: the deck's own roles slide → `notebook.txt` in Notepad holding three roles in plain words **and a single line** for stakeholders («email booking confirmation») → pasted into the Claude panel with **no** «make a table» / «update the file» instruction, just «ask me if you're unsure» → the `defining-users` skill firing, visible on screen → the roles table returned, with the e-mail line **reclassified** from a user to an external service → the `conversation_history.md` preview showing **nothing written to `PRODUCT.md` yet** → **Claude's two questions back**: the role-overlap question (quoting the deck slide) and the «who owns the mail account?» assumption offered for correction → the trainee's answer, and their own discovery that barring two roles per account does not bar one person opening two accounts → §2 written, **a fourth item appended to the §1.1 future plan written the day before**, commit & push → verification in the `PRODUCT.md` preview. One continuous take, **1:49**, 1080p. Delivered as `tasks-9.1-9.2.mp4` and renamed to drop the dots | 14 |

**Day 2 is fully covered.** Both recordings exist; no BookIt material remains on any Day-2 slide.

**Note on d2-2's first second:** it opens on the deck slide as it looked on 2026-09-25 (the BookIt
roles table). That slide has since been rebuilt, so the step carries a `stepvid__fix` saying so.

## If a shot is missing

The deck degrades gracefully: `media-frame` falls back to the step's Arabic caption on a `--brand-snow`
panel, so a missing file leaves a readable slide rather than a broken one. **Tell me which ones you
skipped** and I will make sure those slides carry enough text to stand alone.
