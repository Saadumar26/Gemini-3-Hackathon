<div align="center">
  <h1>📚 ScholarAI</h1>
  <p>AI-powered assistant for analyzing academic papers, identifying research gaps, and generating learning roadmaps</p>
  
  <img src="thumbnail.svg" alt="ScholarAI" width="900" />
  
  <p>
    <img alt="React" src="https://img.shields.io/badge/React-19-blue?logo=react" />
    <img alt="TypeScript" src="https://img.shields.io/badge/TypeScript-5.8-blue?logo=typescript" />
    <img alt="Gemini API" src="https://img.shields.io/badge/Google_AI-Gemini-orange?logo=google" />
    <img alt="License" src="https://img.shields.io/badge/License-MIT-yellow" />
  </p>
</div>

---

## 📖 Overview

ScholarAI is an interactive AI research assistant designed to help researchers and students analyze academic papers more effectively. By leveraging Google's Gemini API, it provides intelligent paper analysis, identifies research opportunities, and creates personalized learning pathways.

**What it does:**
- Accepts pasted paper text, a paper/topic search, or a built-in demo paper
- Uses Gemini with Google Search grounding for searches; it does not directly download or parse PDF files
- Generates comprehensive structured analyses
- Identifies unexplored research directions
- Provides document-grounded Q&A capabilities
- Creates step-by-step learning roadmaps with prerequisite concepts

**Built for:** Researchers, PhD students, academics, and anyone exploring scientific literature who wants to understand papers faster and discover research opportunities.

**🌐 [Try Live Demo](https://aistudio.google.com/apps/drive/1Y4XXnhx5rj725aRxljccrz_x5bGAMZ5p?fullscreenApplet=true&showPreview=true&showAssistant=true)**

---

## 🚀 Features

- **Structured Summaries** — Generate comprehensive analysis including problem statements, methodologies, contributions, and limitations
- **Research Gap Analysis** — Identify methodological, data, evaluation, and application gaps
- **Future Predictions** — Forecast potential research directions based on paper content
- **Interactive Chat** — Ask questions grounded in the paper with contextual explanations
- **Learning Roadmap** — Get prerequisite concepts and recommended papers to understand the research. The app does not currently extract an arXiv ID from the search or pasted text, so the target paper's arXiv link may be unavailable or incorrect.

## 🛠️ Tech Stack

| Component | Technology |
|-----------|------------|
| **Frontend** | React 19, TypeScript, Tailwind CSS |
| **Build Tool** | Vite |
| **AI Integration** | Google Gemini API |
| **Runtime** | Node.js LTS |

## ⚡ Quick Start

### Prerequisites
- Node.js (v18 or newer)
- Gemini API key

### Installation

1. **Clone the repository**
```bash
git clone https://github.com/Saadumar26/Gemini-3-Hackathon.git
cd Gemini-3-Hackathon
```

2. **Install dependencies**
```bash
npm install
```

3. **Configure environment**
Create `.env.local` in the project root:
```env
GEMINI_API_KEY=your_gemini_api_key_here
```
Keep this key private. In the current Vite setup it is included in the browser app, so do not deploy this configuration publicly or commit the key.

4. **Run development server**
```bash
npm run dev
```

5. **Open your browser**
Navigate to `http://localhost:3000`

### Build for Production
```bash
npm run build
npm run preview
```

## 📖 How to Use

1. **Load Paper** — Search for a paper/topic, paste paper text, or try the built-in demo. Search returns Gemini-generated paper content grounded with Google Search; it does not fetch the original PDF. PDF upload is not currently supported.
2. **Choose Mode** — Select from Summary, Gaps, Predictions, Reader, Chat, or Roadmap
3. **Interact** — Generate analyses and ask questions about the paper

## 📁 Project Structure

```
├── components/          # UI components
├── services/           # Gemini API integration
├── App.tsx            # Main application
├── index.tsx          # Entry point
├── constants.ts       # Configuration
└── types.ts           # TypeScript definitions
```

## 👥 Team

- **Muhammad Fiaz** — Project Manager
- **Abdul Rehman** — Full Stack Developer
- **Muhammad Saad Umar** — AI/ML Engineer
- **Umm E Rubab** — Pitch/Demo Lead

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🎯 Hackathon

Built for **Gemini 3 Hackathon**

---

<div align="center">
  Made with ❤️ by the ScholarAI Team
</div>
