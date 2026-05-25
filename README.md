# VedaAI Assessment Creator 🚀

A full-stack, AI-powered assessment generation platform designed for educators. This application allows teachers to instantly generate structured, customized exam papers using Google's Gemini LLM, complete with real-time UI updates and optimized background processing.

## 🏗️ Architecture & System Design

This project goes beyond a simple CRUD app by implementing an **Event-Driven Asynchronous Architecture** to ensure high availability and prevent server timeouts during heavy AI processing.

* **Frontend:** Next.js 14, React, Tailwind CSS (v4), Zustand
* **Backend:** Node.js, Express, TypeScript
* **Database:** MongoDB
* **Message Queue & Caching:** Upstash Redis, BullMQ
* **Real-time Engine:** Socket.io (WebSockets)
* **AI Provider:** Google Gemini (2.5 Flash)

### Key Technical Highlights
* **Cache-Aside Idempotency:** Implemented a Redis caching layer using SHA-256 hashing. If a teacher requests an exam with identical parameters to a previous request, the system bypasses the LLM and serves the cached JSON instantly, saving API costs and reducing latency from ~4 seconds to ~50 milliseconds.
* **Background Job Processing:** Heavy LLM API calls are offloaded to a BullMQ worker queue. This prevents the main Express thread from blocking and ensures the server remains highly responsive.
* **Real-Time WebSockets:** The moment the background worker finishes generating and saving the exam, a Socket.io event is emitted directly to the specific client's room, triggering an instant UI update without requiring long-polling.
* **Client-Side PDF Generation:** Utilizes `html2canvas` and `jsPDF` to generate beautifully formatted, printable exam papers directly in the browser, complete with dynamic Student Information sections.

---

## 🚀 Core Features

* **Dynamic Assignment Creation:** Teachers can specify topics, exact question types, difficulty distributions, and total marks.
* **Strict JSON AI Parsing:** Prompt engineering restricts the Gemini LLM to output precise, deeply nested JSON structures representing the exam hierarchy, bypassing the risks of raw markdown rendering.
* **Results Dashboard:** Clean, accessible UI displaying sections, questions, and visual difficulty badges.
* **One-Click PDF Export:** Generates physical-ready test papers.
* **Instant Regeneration:** Allows educators to instantly roll the dice for a new variation of the exam.

---

## 🛠️ Local Setup Instructions

### 1. Clone the Repository
\`\`\`bash
git clone https://github.com/rajkiran89/veda-ai-assessment.git
cd veda-ai-assessment
\`\`\`

### 2. Backend Setup
\`\`\`bash
cd backend
npm install
\`\`\`
Create a `.env` file in the `backend` directory:
\`\`\`env
PORT=8080
MONGO_URI=your_mongodb_connection_string
REDIS_URL=your_upstash_redis_url
GEMINI_API_KEY=your_google_gemini_key
CLIENT_URL=http://localhost:3000
\`\`\`
Start the backend server:
\`\`\`bash
npm run dev
\`\`\`

### 3. Frontend Setup
Open a new terminal window:
\`\`\`bash
cd frontend
npm install
\`\`\`
Start the Next.js development server:
\`\`\`bash
npm run dev
\`\`\`

The application will now be running at `http://localhost:3000`.

---
*Built for the VedaAI Full Stack Engineering Assignment.*