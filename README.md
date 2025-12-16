<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# Run and deploy your AI Studio app

This contains everything you need to run your app locally.

View your app in AI Studio: https://ai.studio/apps/temp/1

## Run Locally

**Prerequisites:**  Node.js


1. Install dependencies:
   `npm install`
2. Create a `.env` file and set `VITE_GEMINI_API_KEY` to your Gemini API key (do **not** commit `.env`)
3. Run the app:
   `npm run dev`

## Deploy to GitHub Pages ✅

1. Ensure `base` in `vite.config.ts` matches your repo name (`/DAVID_AI_REVISI/`).
2. Push to `main` on GitHub — the included GitHub Actions workflow will build and publish to the `gh-pages` branch.
3. Once the Action succeeds, your app will be available at: `https://frgwnabim.github.io/DAVID_AI_REVISI/`

> Note: The workflow publishes the `dist` folder built by `npm run build`.
