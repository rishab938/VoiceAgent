# Lunara AI — Voice-Controlled Task Manager

Lunara AI is a premium, voice-activated task management system that allows you to manage your daily tasks and memories using natural voice commands. It features a sleek, moonlight-themed dashboard with real-time audio processing and spectral analysis.

## ✨ Features

- **Voice Interaction**: High-accuracy speech-to-text processing for natural commands.
- **Task Management**: Create, list, update, and delete tasks entirely through voice.
- **Neural Memory Bank**: Store important thoughts and reminders that persist across sessions.
- **Premium UI**: A glassmorphic, moonlight-inspired dashboard built with React and Framer Motion.
- **Spectral Audio**: Visual feedback for voice activity.

## 🛠️ Tech Stack

### Backend
- **FastAPI**: High-performance web framework for Python.
- **Edge TTS**: Microsoft Edge Text-to-Speech integration.
- **Gemini AI**: Powers the agent logic for task parsing and intent recognition.
- **Pydub**: Audio manipulation and processing.

### Frontend
- **React (Vite)**: Modern frontend framework.
- **Framer Motion**: Smooth animations and transitions.
- **Lucide React**: Premium icon set.
- **CSS3**: Advanced glassmorphism and custom gradients.

## 🚀 Getting Started

### Prerequisites
- Python 3.9+
- Node.js 18+
- Google API Key (for Gemini)

### Backend Setup
1. Navigate to the `backend` directory.
2. Create a virtual environment: `python -m venv venv`.
3. Activate it: `venv\Scripts\activate` (Windows) or `source venv/bin/activate` (Mac/Linux).
4. Install dependencies: `pip install -r requirements.txt`.
5. Create a `.env` file with your `GOOGLE_API_KEY`.
6. Start the server: `uvicorn app.main:app --reload`.

### Frontend Setup
1. Navigate to `frontend/voice-frontend`.
2. Install dependencies: `npm install`.
3. Start the development server: `npm run dev`.

## 📄 License
This project is licensed under the MIT License.
