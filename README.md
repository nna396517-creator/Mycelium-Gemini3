# Mycelium-Gemini3
A decentralized disaster resilience network powered by Gemini 3

---

## 🌟 Key Features

### 1. 🧠 Multimodal AI Analysis (Gemini 3)
Instead of simple text reports, Mycelium analyzes **raw imagery** from the disaster scene.
* **Visual Reasoning**: Identifies structural damage, fire hazards, and trapped survivors from uploaded photos.
* **Task Distribution**: Automatically generates prioritized missions (Medic, Rescue, Supply) based on risk levels.

### 2. 🛡️ Resilient Offline Mapping
Designed for connectivity-loss scenarios.
* **Google Maps Integration**: Full interactive map when online.
* **Fallback Grid System**: Automatically switches to a **"Dev Mock Mode"** (Offline Grid) when map services are unreachable or API quotas are exceeded, ensuring the command center never goes blind.

### 3. 🖥️ Tactical HUD Interface
A "Situation Room" grade dashboard designed for high-stress environments.
* **Real-time Monitoring**: Visualizes local risk indices, available resources, and system latency.
* **Dark Mode Optimization**: Reduces eye strain for operators working in low-light environments.

### 4. 🌍 Global Readiness (i18n)
* **Bilingual Support**: Instant toggle between **English** and **Traditional Chinese**.
* Built for international cooperation in global disaster relief scenarios.

### 5. 🔐 Secure Node Access
* **Simulated Biometric Auth**: A specialized login overlay simulating secure terminal access.
* **Role-Based Access**: Commander verification flow (Demo Credential: `admin`).

---

## 🛠️ Tech Stack

* **Framework**: [Next.js 15](https://nextjs.org/) (App Router)
* **Language**: TypeScript
* **Styling**: Tailwind CSS v4 + Shadcn/ui
* **AI Model**: Google Gemini 3 (Pro Vision / Flash)
* **Maps**: Google Maps Platform + React Google Maps
* **Deployment**: Vercel

---

## 🎮 Demo Instructions (Mock Mode)

Even without API keys, you can explore the UI flow:
1.  **Login**: Enter `admin` in the ID field and click **Connect**.
2.  **Toggle Language**: Use the switch in the top-right corner.
3.  **Simulate Analysis**:
    * Click the **Upload (Clip)** icon in the chat bar.
    * Select any image.
    * Watch the **Gemini 3 Reasoning** animation.
    * Observe the **Tactical Map** update with rescue nodes.

---

## 🤝 Team
* **Frontend & UI/UX**: Dashboard design, interactive map, i18n system.
* **AI Engineer**: Gemini API integration, prompt engineering.
* **PM**: Scenario design, disaster response logic.

---
*Built for the Google DeepMind Gemini 3 Hackathon. 2026.*
