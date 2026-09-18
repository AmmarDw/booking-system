# Media shot list — Day 1

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

## ⚠ Reconciled against the built deck (47 slides)

`project-package/slides/day-01.html` consumes **11 media slots**. Capture these first — they each have a slide waiting:

~~`06-desktop-usage.mp4`~~ (تم) ·
`16-app-running.png` · `17-first-commit.png`

**Eight shots are done, delivered under their own names rather than the placeholders below** —
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
- Slide 34 embeds `git-setup.mp4` — a single file joining `git.mp4` (install) and `git-auth.mp4`
  (identity setup) end to end via `ffmpeg -f concat -c copy` (both clips share the exact same
  encoding, so this is a lossless stream copy, not a re-encode). The identity section's step
  timestamps are the original `git-auth.mp4` times **plus `git.mp4`'s duration (50.7s)** — e.g. its
  `0:02` step is `0:53` in the joined file. This replaced the old `03-git-install-win.mp4` and
  `05-git-config.png` placeholders; slide 33 (the three-OS-card comparison) is untouched — the
  recording is Windows-only, so it doesn't replace the cards, it demonstrates what card #1
  describes. The two source clips (`git.mp4`, `git-auth.mp4`) are kept in `media/` for reference but
  no longer referenced by the deck.
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
- Slide 37 embeds `context7-redacted.mp4` (1:49) — ask Claude for the steps (a real quoted prompt),
  sign in to context7.com, create an API key, paste it back, restart the editor, then watch Claude
  actually *test* the connection (not just check its status) by looking up real docs before
  confirming. **⚠ Security: the raw recording (`context7.mp4`) shows a real, fully-readable API key
  on screen for ~50s (0:56–1:46) — first on context7.com's "key created" modal, then pasted into the
  chat.** Redacted with `ffmpeg`'s `gblur` over exactly that window before wiring it into the slide
  (verified frame-by-frame: sharp right up to 0:55, fully unreadable through 1:46, sharp again by
  1:48). **The unredacted `context7.mp4` is still sitting in `media/` with the key fully visible** —
  delete it once you've confirmed that key is revoked on context7.com's dashboard. Replaced
  `12-context7-apikey.png` (never captured).
- Slide 38 embeds `supabase.mp4` (2:51) — ask Claude for the steps, sign in, **create an
  organization** (a real one-time prerequisite the guide never mentioned), create the project (the
  generated database password stays masked as dots on screen the whole time — never exposed, no
  redaction needed here), connect the MCP, paste the setup command, authenticate from a separate
  terminal (browser OAuth — no static token embedded in the command, unlike context7), then verify
  twice: once right after linking (Claude says a restart is needed) and once after restarting
  (Claude actually lists the database's tables before confirming). This merge is why the deck
  dropped from 48 slides to 47 — the old "create project" and "link MCP" slides are now one, mirroring
  the same two-phase split as dividers inside the single step list. Replaced
  `13-supabase-newproject.png` and `14-supabase-mcp.png` (never captured).
- Slide 39 embeds `github.mp4` (1:24) — ask Claude for the steps (it checks your Git identity
  first), copy a suggested repo name, create it on GitHub (Private, README/.gitignore/license left
  blank), hand the URL and a one-line product idea back to Claude, then watch it actually check your
  environment — the recording caught a genuinely missing prerequisite (**no version of the deck had
  ever mentioned Node.js**) — before writing a real plan file and presenting the three real
  accept-plan choices (auto-accept / manually approve / keep planning). No secrets on screen; checked
  before use. Replaced `15-github-new-repo.png` (never captured).

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
| 6d | ✅ `git-setup.mp4` | MP4 | Windows | Download the installer from git-scm.com, run it, click through the wizard's defaults (**except overriding the default branch name to `main`**), Install → Finish, verify with `git --version` — then straight into setting `user.name`, `user.email`, and confirming both with `git config --global --list`. One joined file, 1:22 long (`git.mp4` + `git-auth.mp4`, concatenated) | 34 |
| 7e | ✅ `antigravity-ide.mp4` | MP4 | Windows | Download → installer wizard defaults → Finish → sign in with Google → **mobile QR verification if prompted** → **sign in again if the IDE doesn't notice** → theme → two default onboarding screens → skip the plugin packs → privacy screen → Open Folder → trust the authors. One continuous take, 2:00 long | 35 |
| 11 | ✅ `claude-code-extension.mp4` | MP4 | any | Extensions panel → search **Claude Code for VS Code** → **trust the publisher** → Install → open the new Claude Code panel → send "السلام عليكم" → real tool calls reading the project's files → the actual `CLAUDE.md`-driven greeting reply. One continuous take, 1:08 long. Replaced `11-extension-install.mp4` (never captured) | 36 |
| 12 | ✅ `context7-redacted.mp4` | MP4 | any | Ask Claude for the steps → sign in to context7.com → create + copy an API key → paste it back → restart the editor → Claude tests the connection with a real doc lookup before confirming. One continuous take, 1:49 long. **Blurred 0:56–1:46** (`gblur`) to cover a real API key visible in the raw recording — see the ⚠ note above. Replaced `12-context7-apikey.png` (never captured) | 37 |
| 13e | ✅ `supabase.mp4` | MP4 | any | Ask Claude for the steps → sign in via GitHub → create an organization → create the project (password stays masked) → Connect → MCP → Claude Code → adjust feature groups → copy the setup command → authenticate from a separate terminal (browser OAuth) → verify, restart, verify again with a real table listing. One continuous take, 2:51 long. Replaced `13-supabase-newproject.png` and `14-supabase-mcp.png` (never captured) | 38 |
| 15e | ✅ `github.mp4` | MP4 | any | Ask Claude for the steps (it checks your Git identity first) → copy a suggested repo name → create it on GitHub (Private, README/.gitignore/license left blank) → hand back the URL + a one-line product idea → Claude checks your environment (**caught a real missing Node.js — new, previously undocumented**) → writes an actual plan file and presents the three real accept-plan choices. One continuous take, 1:24 long. Replaced `15-github-new-repo.png` (never captured) | 39 |
| 16 | `16-app-running.png` | PNG | any | The scaffolded app running in a browser on `localhost`, **sign-in page open** | 41 |
| 17 | `17-first-commit.png` | PNG | any | Terminal after a successful first `commit` + `push`, and the repo showing the files on GitHub | 44 |

## Optional but worth it

| Filename | Why |
|---|---|
| `00-hero-loop.mp4` | A 5–8 s silent loop of Claude Code building something, behind the title slide. Strong opener; skip if time is short. |
| `04b-git-linux.png` | Only if you expect Linux trainees. |
| `01c-claudecode-install-linux.mp4` | Same. |

## If a shot is missing

The deck degrades gracefully: `media-frame` falls back to the step's Arabic caption on a `--brand-snow`
panel, so a missing file leaves a readable slide rather than a broken one. **Tell me which ones you
skipped** and I will make sure those slides carry enough text to stand alone.
