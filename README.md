# CostNote: The Note App for Personal Finance
**TR1 2026 AI Hackathon - Option 3: Real-Time Cost of Living Awareness**

## Team Details
* **Team Name:** [Team Name]
* **Members:**
* * Julia Arngold - 14623648
  * Trinh Mai Thanh - 14934338
  * Lin Pyae Htet - 14629713
  * Jinhui Zhao - 15027837

## Problem Statement 
Food prices, daily expenses, and essential costs change constantly, yet most people lack visibility into real time price trends or nearby affordable options.

Students and young adults often struggle to budget effectively because pricing information is scattered across platforms and not designed for intelligent comparison.

Without transparency, people overspend or miss better alternatives simply because they do not have timely information.

## Overview
CostNote solves the friction of financial tracking for Gen Z. By using natural language input (e.g., "coffee 5"), our app automatically categorizes expenses, cross-references them with live local averages, and checks them against existing BNPL debt to provide instant, actionable financial insights.

## Tech Stack & APIs Used
* **Frontend:** Next.js (React), Tailwind CSS
* **Backend:** Next.js API Routes (Serverless)
* **AI Processing:** Claude 3 Haiku API (Anthropic) - Used for natural language parsing and insight generation.
* **Data Sources (Simulated for Prototype):** data.gov.sg (pricing averages), OneMap (location services).

## How to Run Locally
1. Clone the repository.
2. Run `npm install` to install dependencies.
3. Create a `.env.local` file in the root directory.
4. Add your API key: `ANTHROPIC_API_KEY=your_key_here`
5. Run `npm run dev` and open `http://localhost:3000`.

## Academic Integrity & AI Usage Declaration
* AI Tools Used for Assistance: Gemini 3.1 Pro (Used for architecture brainstorming, React component generation, and debugging assistance).
* All code has been reviewed, understood, and implemented by the team.
