# Mycelium-Gemini3
A decentralized disaster resilience network powered by Gemini 3.

---

## 🌟 Key Features

### 1. 🧠 Multimodal AI Analysis & Triage
Mycelium goes beyond simple text reports by analyzing **raw imagery** from disaster scenes.
* **Scenario Recognition**: Automatically detects disaster types (Fire, Flood, Earthquake) based on visual input.
* **Task Distribution**: Generates prioritized missions (Medic, Rescue, Supply) with coordinate-based deployment on the tactical map.

### 2. 🔄 Interactive Command Workflow (New!)
A structured decision-making flow designed for clarity under pressure.
* **Intent Separation**: Upon image upload, commanders choose between **"Real-time Reporting"** (Structured Data) or **"Response Consultation"** (AI Advice).
* **Smart Forms**: Integrated disaster reporting form with **one-click GPS location**, required field validation, and resource request logging.

### 3. 🌤️ Dynamic Environmental Monitoring (New!)
* **Context-Aware Weather**: The dashboard features a real-time **Weather Widget** that adapts to the active scenario.
    * *Fire Scenario*: Displays high heat, low humidity, and strong winds.
    * *Flood Scenario*: Displays heavy precipitation and storm warnings.
    * *Standby*: Displays current local weather conditions.

### 4. 🖥️ Tactical HUD Interface
A "Situation Room" grade dashboard designed for high-stress environments.
* **Real-time Monitoring**: Visualizes Local Risk Indices, Resource Availability, and Network Latency.
* **Resilient Mapping**: seamlessly switches between **Google Maps** (Online) and **Tactical Grid Mode** (Offline/Mock) to ensure operational continuity.

### 5. 🌍 Global Readiness (i18n)
* **Full Bilingual Support**: Instant toggle between **English** and **Traditional Chinese**, covering all UI elements, AI responses, and reporting forms.
* Built for international cooperation in global disaster relief scenarios.

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

To experience the full range of scenarios, follow these steps:

### 1. Access & Login
* Enter `admin` in the Commander ID field.
* Click **Connect** to access the dashboard.

### 2. Trigger Disaster Scenarios
The system uses **filename detection** to simulate specific AI analysis results. Upload images with these keywords in their filename:

* 🔥 **Fire Scenario**: Upload an image named like `factory_fire.jpg`.
    * *Result*: Triggers high heat weather, fire hazard alerts, and burn unit tasks.
* 🌊 **Flood Scenario**: Upload an image named like `street_flood.jpg`.
    * *Result*: Triggers heavy rain weather, drowning risk alerts, and boat rescue tasks.
* 🏚️ **Earthquake Scenario**: Upload an image named like `building_collapse.jpg`.
    * *Result*: Triggers structural damage alerts, debris removal tasks, and heavy machinery requests.

### 3. Try the Interactive Flow
1.  **Upload** one of the images above.
2.  **Select Action**:
    * Click **📢 Real-time Reporting** to test the form validation and GPS feature.
    * Click **🤖 Response Consultation** to see the AI generate a bilingual situation summary and mission tasks.

---

## 🤝 Team
* **Frontend & UI/UX**: Dashboard architecture, interactive map, i18n system.
* **AI Engineer**: Gemini API integration, prompt engineering, scenario logic.
* **PM**: Disaster response protocols, user journey design.

---
*Built for the Google DeepMind Gemini 3 Hackathon. 2026.*
