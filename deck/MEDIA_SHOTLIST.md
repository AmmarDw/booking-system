# Media shot list — Day 1

I cannot capture these: they are installers, browser dialogs and account screens on your machine.
**You record them, drop them in `project-package/slides/media/` with the exact filename below, and I wire them in.**

**Format rules**

- **Filenames exactly as written** — the deck references them by name.
- **PNG** for a single state · **GIF** for a short sequence (≤ 10 s, no audio) · **MP4** only if a step
  genuinely needs more than 10 s.
- Capture at **1920×1080 or larger**, then crop tight to the relevant window. A full desktop shot is
  unreadable on a projector.
- **Use a clean throwaway account and a neutral desktop.** Several of these frames show account screens.
- ⚠ **Never capture a real key, token or password.** For `12-context7-apikey.png` blur or crop the key
  itself — the slide only needs to show *where* the button is, not the value.
- Prefer **light OS theme** — it matches the deck's light surfaces and reads better projected.

## ⚠ Reconciled against the built deck (50 slides)

`project-package/slides/day-01.html` consumes **14 media slots**. Capture these 14 first — they each have a slide waiting:

`01-claudecode-install-win.gif` · `02-claudecode-login.gif` · `05-git-config.png` ·
~~`06-desktop-usage.gif`~~ (تم) · `07-antigravity-download.png` · `09-antigravity-theme.png` ·
`10-antigravity-plugins.png` · `11-extension-install.gif` · `12-context7-apikey.png` ·
`13-supabase-newproject.png` · `14-supabase-mcp.png` · `15-github-new-repo.png` ·
`16-app-running.png` · `17-first-commit.png`

**Four entries below have no slot in the built deck — don't shoot them yet:**

| Shot | Why it has no slot |
|---|---|
| `03-git-install-win.gif` · `04-git-macos-clt.png` | Slide 32 covers Git as **three OS cards**, not a screenshot — it reads better as a comparison than as one platform's installer |
| `08-antigravity-signin.png` | Slide 36 shows only the theme step; sign-in is one line of text |
| `01-claudecode-install-mac.gif` | Slide 30 shows the Windows GIF with the macOS/Linux command as text |

Tell me if you'd rather any of those four become a real media slide and I'll restructure the slide to hold it.

---

| # | Filename | Type | OS | What must be visible | Slide |
|---|---|---|---|---|---|
| 1 | `01-claudecode-install-win.gif` | GIF | Windows | PowerShell open (prompt shows `PS C:\`), the `irm …` command pasted, install running to success | 30 |
| 1b | `01-claudecode-install-mac.gif` | GIF | macOS | Terminal, the `curl …` command, install completing | 30 |
| 2 | `02-claudecode-login.gif` | GIF | any | Typing `claude`, the login prompt appearing, browser auth, returning to a ready prompt | 31 |
| 3 | `03-git-install-win.gif` | GIF | Windows | Git for Windows installer — the **default Next-through** path, ending on Finish | 32 |
| 4 | `04-git-macos-clt.png` | PNG | macOS | The **Xcode Command Line Tools** prompt that appears after `git --version` | 32 |
| 5 | `05-git-config.png` | PNG | any | Terminal showing both `git config --global user.name` / `user.email` set, then echoed back. **Use a demo name/email** | 33 |
| 6 | ✅ `06-desktop-usage.gif` | GIF | any | Claude Desktop usage screen showing the 5-hour window and the weekly limit | 34, 22 |
| 7 | `07-antigravity-download.png` | PNG | any | `antigravity.google/download` with the OS selected and **Antigravity IDE (Standalone)** visible | 35 |
| 8 | `08-antigravity-signin.png` | PNG | any | The welcome screen's **Google sign-in** step | 36 |
| 9 | `09-antigravity-theme.png` | PNG | any | The **theme picker** (System / Light / Dark) | 36 |
| 10 | `10-antigravity-plugins.png` | PNG | any | The **«Connect Plugins»** step with the plugin sets listed and **all toggles off** — this frame is the point of slide 37 | 37 |
| 11 | `11-extension-install.gif` | GIF | any | Extensions panel → search **Claude Code for VS Code** → Install → signed in | 38 |
| 12 | `12-context7-apikey.png` | PNG | any | context7 dashboard, **API Keys** page, the create-key button. **Key value blurred or cropped** | 39 |
| 13 | `13-supabase-newproject.png` | PNG | any | Supabase new-project form with the fields filled (project name, region, DB password field — **not the password**) | 40 |
| 14 | `14-supabase-mcp.png` | PNG | any | Claude Code showing Supabase MCP **connected** after `/mcp` | 41 |
| 15 | `15-github-new-repo.png` | PNG | any | `github.com/new` with the fields visible: name, private, **and README/gitignore left unchecked** | 42 |
| 16 | `16-app-running.png` | PNG | any | The scaffolded app running in a browser on `localhost`, **sign-in page open** | 44 |
| 17 | `17-first-commit.png` | PNG | any | Terminal after a successful first `commit` + `push`, and the repo showing the files on GitHub | 47 |

## Optional but worth it

| Filename | Why |
|---|---|
| `00-hero-loop.mp4` | A 5–8 s silent loop of Claude Code building something, behind the title slide. Strong opener; skip if time is short. |
| `04b-git-linux.png` | Only if you expect Linux trainees. |
| `01c-claudecode-install-linux.gif` | Same. |

## If a shot is missing

The deck degrades gracefully: `media-frame` falls back to the step's Arabic caption on a `--brand-snow`
panel, so a missing file leaves a readable slide rather than a broken one. **Tell me which ones you
skipped** and I will make sure those slides carry enough text to stand alone.
