# Prism - Learning Summarizer

**Prism** is a multi-modal learning tool that transforms text into conversations, networks, and maps.

## Features

- **🎙️ Podcast Mode**: Generates a 2-host audio podcast from text using Gemini AI and Neural TTS.
- **🕸️ WordWeb Mode**: Creates an interactive scientific knowledge graph.
- **🗺️ BookMap Mode**: Visualizes narrative timelines for stories.

## Prerequisites

- **Python 3.12+**
- **Node.js 18+**
- **Gemini API Key** (Set in `api/.env`)

---

## 🚀 Startup Guide

You need **two separate terminal windows** running simultaneously.

### Terminal 1: Backend Server (FastAPI)
This handles the AI processing (Text -> Script/Audio/Graph).

1. Open a terminal at the project root (`Restart2025/`).
2. Run the server:
   ```bash
   uvicorn api.main:app --reload
   ```
3. Wait until you see: `Application startup complete`.
   *Runs on: http://localhost:8000*

### Terminal 2: Frontend Server (Next.js)
This runs the web interface (Prism UI).

1. Open a **new** terminal window.
2. Navigate to the `web` folder:
   ```bash
   cd web
   ```
3. Run the development server:
   ```bash
   npm run dev
   ```
4. Wait until you see: `Ready in ...`.
   *Runs on: http://localhost:3000*

---

## 🛑 Shutdown Guide

When you are finished using Prism, follow these steps to turn everything off:

### 1. Stop Frontend
1. Go to the **Terminal 2** window (where `npm run dev` is running).
2. Press `Ctrl + C` on your keyboard.
3. The server will stop.

### 2. Stop Backend
1. Go to the **Terminal 1** window (where `uvicorn` is running).
2. Press `Ctrl + C` on your keyboard.
3. The server will stop.

---

## Troubleshooting

- **"Failed to fetch" Error**: This usually means the **Backend (Terminal 1)** is not running. Make sure `uvicorn` is active.
- **Port Reuse Error**: If you see `Address already in use`, it means a server didn't close properly.
  - Fix: `lsof -t -i :8000 | xargs kill -9` (This kills the process on port 8000).
