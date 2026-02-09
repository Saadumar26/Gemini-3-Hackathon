<div align="center">
  <h1>📚 ScholarAI — Academic Research Assistant</h1>
  <p>An AI-powered assistant for analyzing academic papers, identifying research gaps, and generating learning roadmaps.</p>
</div>

<!-- Badges: tech stack, API, license, hackathon, status -->
<p align="center">
  <img alt="React" src="https://img.shields.io/badge/React-18-blue?logo=react" />
  <img alt="TypeScript" src="https://img.shields.io/badge/TypeScript-5.8-blue?logo=typescript" />
  <img alt="Vite" src="https://img.shields.io/badge/Vite-6.2-brightgreen?logo=vite" />
  <img alt="Node" src="https://img.shields.io/badge/Node.js-LTS-green?logo=node.js" />
  <img alt="Google AI - Gemini" src="https://img.shields.io/badge/Google_AI-Gemini-orange?logo=google" />
  <img alt="License" src="https://img.shields.io/badge/License-MIT-yellow" />
  <img alt="Hackathon" src="https://img.shields.io/badge/Hackathon-Gemini--3--Hackathon-red" />
  <img alt="Status" src="https://img.shields.io/badge/Status-Active-success" />
</p>

---

**Repository:** ScholarAI — Gemini 3 Hackathon submission

## 🚀 Overview

- **Purpose:** Provide researchers an interactive assistant that ingests a paper and produces structured summaries, research-gap analysis, predictions, a reader interface, and roadmap suggestions.
- **Built with:** React, Vite, Tailwind, and the Gemini API.

## ✨ Key Features

- **Structured Summaries:** Generate problem statements, method overviews, contributions, and limitations.
- **Research Gaps:** Extract methodological, data, evaluation, and application gaps.
- **Predictions:** Forecast plausible research directions based strictly on paper content.
- **Reader & Chat Interface:** Ask questions grounded in the paper text; explain selections.
- **Learning Roadmap:** Produce prerequisite concepts and recommended arXiv papers to reach the target paper.

## 🗂️ Project Structure

- **App entry:** [index.tsx](index.tsx)
- **Main UI:** [App.tsx](App.tsx)
- **Components:** [components/](components) — AnalysisView, ChatInterface, PaperInput, ReaderView, RoadmapView, Sidebar, GenealogyView
- **Services:** [services/gemini.ts](services/gemini.ts) — Gemini API integration
- **Config & types:** [constants.ts](constants.ts), [types.ts](types.ts)

## ⚙️ Prerequisites

- Node.js (v16+ recommended)
- A Gemini API key (set as `GEMINI_API_KEY`)

## ▶️ Run Locally

1. Install dependencies:

```bash
npm install
```

2. Create a `.env.local` in the project root and add your Gemini key:

```env
GEMINI_API_KEY=your_gemini_api_key_here
```

3. Start the development server:

```bash
npm run dev
```

The app will be available at `http://localhost:3000` (or the port shown in the terminal).

## 🧪 Build & Preview

```bash
npm run build
npm run preview
```

## 🔐 Environment & Security Notes

- Do not commit keys to source control. Use environment files or secrets management.
- Rate limits and cost: be mindful of Gemini API usage during demos.

## 🧭 How to Use (Quick)

1. Open the app and paste or search for a paper via the input.
2. Use the sidebar to switch modes: Summary, Gaps, Predictions, Reader, Chat, Roadmap.
3. Generate analyses and interact with the paper using the chat or reader annotations.

## 📁 Submission Notes (Gemini 3 Hackathon)

- This repository is prepared for the Gemini 3 Hackathon.
- Ensure `GEMINI_API_KEY` is set before demonstration.
- The app uses the `@google/genai` integration in [services/gemini.ts](services/gemini.ts).

## 🙋‍♀️ Contributing

- Pull requests are welcome. For hacks or improvements, create a feature branch and open a PR.

## 🧾 Credits & License

- Author: Hackathon team
- License: MIT — see LICENSE (add if desired)

---

If you'd like, I can also:

- Add a small demo GIF or screenshots to the README.
- Create a `.env.example` file and a short CONTRIBUTING.md.
- Commit the changes and open a release branch for submission.


