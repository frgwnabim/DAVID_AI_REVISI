# DAVID_AI_REVISI — Usage Guide ✅

A concise guide to run, test, and deploy this project.

---

## 1) Prerequisites
- Node.js (18+ recommended)
- Git

## 2) Install (local)
1. Install dependencies:
   ```bash
   npm install
   ```
2. Copy `.env.example` → `.env` and set your Gemini API key:
   ```text
   VITE_GEMINI_API_KEY=YOUR_GEMINI_API_KEY_HERE
   ```
   **Important:** Do NOT commit `.env` (it's in `.gitignore`).

## 3) Run locally
```bash
npm run dev
```
Open http://localhost:3000 to view the app.

## 4) Build for production
```bash
npm run build
```
The build output will be placed in `dist/`.

## 5) Deploy to GitHub Pages (automatic)
This repository includes a GitHub Actions workflow that builds and deploys `dist/` to the `gh-pages` branch.

Steps to enable working deploy:
1. Create a Personal Access Token (PAT) on GitHub with `repo` and `workflow` scopes (recommended) or ensure Actions can write Pages.
2. Add the following repository secrets (Settings → Secrets & variables → Actions):
   - `GH_PAGES_TOKEN` — the PAT you created
   - `VITE_GEMINI_API_KEY` — your Gemini API key (optional for production builds)
3. The workflow in `.github/workflows/gh-pages.yml` uses `personal_token: ${{ secrets.GH_PAGES_TOKEN }}` to publish `./dist`.
4. Push to `main` to trigger the workflow. After success, your site will be available at:
   `https://frgwnabim.github.io/DAVID_AI_REVISI/`

If the Deploy step fails, open the Actions run page and check the **Deploy** step log for the error (permission/token issues are the most common).

## 6) Security notes
- Any `VITE_` env key becomes part of the client bundle and is public after build. For sensitive keys (like real production credentials), use a server-side proxy or backend to store and use the key.
- This project contains `env.d.ts` to provide TypeScript types for `import.meta.env`.

## 7) Where to look in the code
- Gemini API usage: `services/geminiService.ts`
- Vite config & base path for GitHub Pages: `vite.config.ts`
- Pages deploy workflow: `.github/workflows/gh-pages.yml`
- Env types: `env.d.ts`

---

If you'd like, I can now delete the old banner image link and tidy up any remaining docs. Tell me if you want me to commit this update and push it to the repository (I can do that).