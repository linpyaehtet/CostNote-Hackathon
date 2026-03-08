# CostNote: The Note App for Personal Finance
**TR1 2026 AI Hackathon - Option 3: Real-Time Cost of Living Awareness**

## Team Details
* **Team Name:** [Insert Team Name Here]
* **GitHub Repository:** [Insert your GitHub Link Here]
* **Members:**
  * Julia Arngold - 14623648
  * Trinh Mai Thanh - 14934338
  * Lin Pyae Htet - 14629713
  * Jinhui Zhao - 15027837

## Problem Statement 
Food prices, daily expenses, and essential costs change constantly, yet most people lack visibility into real-time price trends or nearby affordable options. Students and young adults often struggle to budget effectively because pricing information is scattered across platforms and not designed for intelligent comparison. 

Without transparency, people overspend or miss better alternatives simply because they do not have timely information.

## Overview & Solution
CostNote solves the friction of financial tracking for Gen Z. By using a natural language "Notes" interface (e.g., typing "coffee 5"), our app automatically categorizes expenses, cross-references them with live local averages, and checks them against existing BNPL debt to provide instant, actionable financial insights.

## Tech Stack & Architecture
* **Frontend:** Next.js 16.1 (React) with Tailwind CSS for a highly responsive mobile-first UI.
* **Data Visualization:** Recharts for dynamic, animated spending breakdown analytics.
* **Backend:** Next.js API Routes (Serverless) to ensure cloud-native scalability.
* **AI Processing:** Claude 4.6 Sonnet API (Anthropic) - Used for high-speed natural language parsing and intent generation.
* **Data Sources (Simulated for Prototype):** data.gov.sg (pricing averages) and OneMap (location services).
* **Storage:** Browser `localStorage` utilized for persistent user session data in the MVP prototype.

## Scalability Considerations
To handle high volumes of concurrent "micro-transactions" typical of budgeting apps, CostNote utilizes Next.js Serverless API routes. This ensures the application can horizontally scale to process natural language inputs instantly, whether 100 or 100,000 users log an expense simultaneously.

## How to Run Locally
1. Clone the repository.
2. Run `npm install` to install dependencies.
3. Create a `.env.local` file in the root directory.
4. Add your API key: `ANTHROPIC_API_KEY=your_key_here`
5. Run `npm run dev` in your IDE terminal and open `http://localhost:3000`.

## Academic Integrity & AI Usage Declaration
* **AI Tools Used for Assistance:** Gemini 3.1 Pro (Used for architecture brainstorming, React component generation, and debugging assistance).
* All code has been reviewed, understood, and implemented by the team. Solutions are entirely original.
