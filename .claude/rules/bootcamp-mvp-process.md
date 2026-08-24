# Bootcamp MVP Process — Rule File for Guiding Claude

> **What this is.** A reusable, project-agnostic guide for bootcamp trainees. Copy it into your own project's `.claude/rules/` folder and let it steer Claude across the 6-day process. It tells Claude *how* to work with you so your MVP stays on scope and finishes on time. You do not need to be an expert — just follow the day-by-day prompts and answer Claude's questions.

---

## 0. Golden Rules (read first)

1. **Stay inside the MVP.** Your product has **3–5 core features**. Do not add more until the core user journey works end to end.
2. **Use demo data only.** Never enter real, sensitive, or secret data during the bootcamp.
3. **Plan before building.** For any coding task, tell Claude: *"Enter plan mode first."* Review the plan, then approve.
4. **Review by using the product, not by reading its code.** You never read or write code — you judge each result by using the product through its UI and by reading Claude's plain-language report. (Claude writes and tests the code — see §6 and §7.)
5. **Keep up-to-date docs.** When Claude writes code against a library or framework, instruct it to **use the `context7` MCP tool** to pull current documentation, so the code matches the latest APIs.
6. **Save daily.** Commit and push to GitHub at the end of each day.
7. **One language for docs.** Keep all project documents in a single language (default: English) for consistency.
8. **Claude builds and tests; you try it out.** Claude scaffolds the project, writes the code, tests it, and reports back in plain language; you describe what you want and try the result in the product's UI (see §6 and §7).

---

## 1. Requirements Standard (how to write requirements)

Follow the shared standard in `requirements-standards.md`. In short:

- **EARS syntax** — never plain prose. Pick the pattern that fits:
  - Ubiquitous: `The [system] shall [action].`
  - Event-driven: `WHEN [trigger], the [system] shall [action].`
  - State-driven: `WHILE [state], the [system] shall [action].`
  - Unwanted behavior: `IF [trigger], THEN the [system] shall [action].`
- **IDs are flat:** `FR-1, FR-2, …` for functional, `NFR-1, NFR-2, …` for non-functional.
- **User Story** (to capture value): `As a [user], I want [feature], so that [benefit].`
- **Acceptance criteria (Gherkin)** — every requirement needs them:
  `Given [context], When [action], Then [outcome].`
- **Quality check** before finalizing any requirement: Necessary · Atomic · Verifiable · Clear (replace vague words like "fast/easy" with numbers).

---

## 2. The User-Journey Text Format (so it converts cleanly to a diagram)

On Day 1 you describe the main user journey in text. On Day 2 it becomes an **activity diagram** (via the **draw.io** skill). To make that conversion clean, write the journey using this exact structure so Claude can parse it:

```
JOURNEY: <name of the journey>
ACTOR: <who performs it>

START
1. <action step>            # a normal action
2. <action step>
3. DECISION: <question?>
   - IF <condition A> -> go to step <n>
   - IF <condition B> -> go to step <m>
4. <action step>
...
END
```

Rules for the journey text:
- One numbered step = one action or one decision.
- Use `DECISION:` for any branching point, and list each branch with `IF … -> go to step`.
- Name the actor; if multiple actors, split into separate `JOURNEY:` blocks.
- Keep steps short and verb-first ("Select service", "Enter email").

When formatting a trainee's raw description, Claude must rewrite it into this structure **without dropping any step**.

---

## 3. The 6-Day Flow (what to do each day)

Each day mirrors the bootcamp: ~1h concepts, ~1h live with trainer, ~3h building, ~1h review. Claude's job is to move you through the steps and produce the day's output.

### Day 1 — Requirements & Scope
- Define the MVP (problem, purpose, objectives — kept to one short section).
- Define users/stakeholders.
- Describe the main user journey **in the format above**.
- Specify product functionalities as **FR-# requirements with acceptance criteria** (this is your SRS).
- Flag the **main features** and give each a **priority score** (out of 5 or 10).
- State the **MVP scope**.
- **Output:** product definition, requirements, scope.

### Day 2 — UX Plan
- Turn the journey text into an **activity diagram** (draw.io skill).
- Define screens/pages and a first UI model (**Claude Design**) — see *Working with Claude Design* below.
- Write the **implementation plan** (requirements → acceptance criteria), and remember to run Claude in **plan mode** when executing it.
- **Output:** user journey diagram + initial design + implementation plan.

#### Working with Claude Design (the iteration loop)

Claude Design (in claude.ai) is where you generate and visually iterate your UI; Claude Code (your coding assistant) turns it into real code. Think of it as a loop:

1. **Claude Code → you (prompts).** Ask Claude Code for **ready-to-paste Claude Design prompts** built from your requirements: first a **Design-System setup** prompt, then one prompt per screen. Claude Code encodes your colors, spacing, states, and any special rules (e.g. RTL) so the output is on-spec.
2. **You → Claude Design (generate).** In Claude Design, **create a Design System project** (recommended over starting blank or from a template): define your **tokens** (colors, typography, spacing, radius) and **core components** (button, input, card, modal, toast, table…). Then **generate each screen from that system** and iterate visually until you like it. (You *can* instead pick a template and adapt it, but a Design System keeps screens consistent.)
3. **Back to code — two ways:**
   - **Copy-prompt:** Claude Design offers a **"copy prompt"**; paste it to Claude Code and it implements that screen in your framework.
   - **DesignSync (`/design-sync`):** Claude Code pulls the **component library** from your Claude Design project straight into the repo, **one component at a time** (never a wholesale replace), then wires the components into pages and the backend. Choose this to keep a living component library in sync.
4. **Repeat** per screen. Keep tokens in the Design System as the single source of truth so everything stays consistent.

> Tip: give Claude Design the **same token values** your code uses (or vice-versa) so the design and the build never drift.

### Day 3 — Foundation
- Create the project + **GitHub repo** + work environment (configure MCP tools, incl. **context7**).
- Build the main interfaces; create the **database** (prefer an **ERD**).
- Implement **sign up / sign in**; connect the app to the database.
- **Output:** an initial version running locally, connected to the DB.

### Day 4 — Core Function
- Implement the product's core function **start to finish**.
- Save / view / edit data; build the **dashboard**.
- Add **basic permissions** (role-based access; implement the security filter chain in your stack).
- Review the user journey.
- **Output:** a complete, testable main user journey.

### Day 5 — Integration & Hardening
- Connect an **API / external service**; manage keys and environment variables safely.
- Test **basic and error cases**; debug & fix (use the **chrome-devtools** MCP for live browser testing).
- Review **security** (try to access pages/actions you should not be allowed to); improve performance & UX.
- **Output:** a near-final, integrated, tested product.

### Day 6 — Deploy & Present
- Prepare the production environment and **deploy** (e.g., **Vercel**); add basic analytics.
- Write a short **user guide** and a brief product overview.
- Present the project and review the **future development plan**.
- **Output:** an MVP live at a real URL, with a presentation and a future plan.

---

## 4. Standing Instructions for Claude (paste-ready)

When starting a session, remind Claude of these:

- "Before any coding task, **enter plan mode** and wait for my approval."
- "When writing code that uses a library/framework, **use the context7 MCP tool** for current docs."
- "Write requirements in **EARS** syntax with flat IDs and **Gherkin acceptance criteria**."
- "Format my user-journey description using the **JOURNEY/DECISION structure** in the rule file."
- "Keep everything within our **3–5 core features**; propose extras as future work, don't build them yet."
- "At the end of each day, help me **commit and push to GitHub** and summarize progress."

---

## 5. Tools Used (fill in as you go)

Keep a live table in your report. Typical bootcamp tools:

| Tool | Purpose |
|------|---------|
| Claude Code | AI pair-programmer / project driver |
| context7 (MCP) | Up-to-date library & framework documentation |
| draw.io (skill) | Activity / user-journey diagrams |
| Claude Design | Initial UI/screen design |
| GitHub (MCP) | Version control & repository |
| chrome-devtools (MCP) | Live browser testing & debugging |
| Vercel | Production deployment |
| *(add your stack-specific tools)* | |

---

## 6. Default Tech Stack & Project Setup

When the trainee doesn't specify technologies (the usual case), Claude uses a simple, beginner-friendly stack that is easy to build **and** easy to deploy, and **scaffolds the project itself**:

- **One full-stack Next.js app (TypeScript):** the same framework serves the UI and the server, so there is **no separate frontend/backend folder split**. (That split is only needed when the UI and server are different languages.)
- **All app code in a single subfolder** inside the project (e.g. `app/`); the docs stay at the project root.
- **Database: Supabase (free hosted) — no Docker, no local install.** It also provides **built-in authentication**; copy its connection key into the secrets file (`.env`). The same database works in development and after deploy (no drift).
- **Deploy to Vercel** for the whole app + the already-hosted Supabase database — one deploy, all on free tiers.
- **What the trainee does manually = accounts and keys only:** create a GitHub account/repo, a Supabase project, a Vercel account, and any external service — and put the keys in `.env`. **Scaffolding the structure, wiring the database, and pulling the design components are Claude's job.**
- If the trainee has an explicit tech preference, honor it; otherwise this is the default Claude follows without being asked to specify it.

---

## 7. How Claude Works While Building (simple summary, build, test, report)

- **A plain-language summary before every step:** Claude opens any implementation plan with a short, jargon-free **"What we'll build now"** section (3–6 bullets) that the trainee reads and approves; the technical detail comes **after** it under a clearly-labelled heading like **"Technical details — the trainee need not read these."**
- **The trainee never reads or writes code:** they review by using the product's UI and by reading Claude's plain-language report.
- **Testing is Claude's job, in three layers after each function it builds:** (1) it writes **automated, re-runnable test cases** for each functionality (to confirm it works and keeps working); (2) it exercises the server functions directly from the command line; (3) it opens the browser via chrome-devtools to walk the real user journey. It then **reports to the trainee — in non-technical language — what it did and found.** The trainee/trainer are not asked to run these tests; they trigger them (even implicitly — any development entails its testing), and their own role is to test by **using the UI**.
- **Password hashing is mandatory:** Claude always stores passwords **hashed**, never as plaintext; the trainer's only job is to **verify they are actually hashed**.
- **Server lifecycle during testing:** when Claude needs to run a server/app to test, **it starts it and explicitly stops it when done**, so the trainee doesn't hit a "port occupied" error when starting the app themselves to try it.

---

## 8. Deploying to Vercel (Claude-driven; the trainee only confirms login)

The default stack deploys to **Vercel** (one Next.js app), with the **Supabase** database already hosted. Claude drives the deploy with two tools together: the **Vercel MCP** (manage the project/deployments, read deploy logs to diagnose failures accurately, search docs) and the **CLI** (the actual deploy + env vars — the MCP has no env-var tools yet). The trainee's part is a couple of one-time browser confirmations:

- **Prerequisite — connect the Vercel MCP (once, before deploying):** Claude runs `claude mcp add --transport http vercel https://mcp.vercel.com` then `/mcp`; the trainee authorizes in the browser (OAuth). Claude Code is an officially supported client. This lets Claude read deploy logs and diagnose failures instead of guessing.
- **CLI login (trainee step):** Claude runs `vercel login`; it shows a **confirmation link/code** the **trainee completes in their browser** — Claude can't, because it needs the trainee's identity. This grants Claude permission to deploy to the trainee's account.
- **Link & deploy (Claude drives, once logged in):** `vercel link` (creates the **`.vercel`** directory — kept **out of GitHub**) → set the **Root Directory** to the app folder (`app/`) → add **production env vars** (`vercel env add <NAME> production` — the Supabase connection and any external service) → `vercel --prod` → hand the **live URL** to the trainee.
- **After deploy:** Claude updates any external-service URLs (e.g. OAuth redirect URI, and CORS if a separate backend exists) to point at the new production URL.
- **Obstacles we prevent (from a real run):**
  1. Standing in the Vercel dashboard with no clear next step → Claude drives the steps.
  2. Identity check (`vercel whoami`) failing because the CLI isn't logged in → `vercel login` first.
  3. Forgetting to set the Root Directory or add env vars **before** deploying → breaks the app at runtime.
  4. Forgetting to update external-service URLs once the production URL is known.
  5. Accidentally committing `.vercel` → keep it in `.gitignore` always.
- **Tool split:** the MCP (`https://mcp.vercel.com`) manages the project/deployments, reads logs, diagnoses failures, and searches docs; **env vars and the actual deploy stay on the CLI** (the MCP has no env-var tools yet). The browser confirmations (connecting the MCP + `vercel login`) are the only manual actions, all one-time.
