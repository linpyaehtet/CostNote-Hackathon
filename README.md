# CostNote: The Note App for Personal Finance
**TR1 2026 AI Hackathon - Option 3: Real-Time Cost of Living Awareness**

## Team Details
* **Team Name:** CostNote - Team 6
* **GitHub Repository:** https://github.com/linpyaehtet/CostNote-Hackathon
* **Members:**
  * Julia Arngold - 14623648
  * Trinh Mai Thanh - 14934338
  * Lin Pyae Htet - 14629713
  * Jinhui Zhao - 15027837

## Problem Statement 
Food prices, daily expenses, and essential costs change constantly, yet most people lack visibility into real-time price trends or nearby affordable options. Students and young adults often struggle to budget effectively because pricing information is scattered across platforms and not designed for intelligent comparison. 

Without transparency, people overspend or miss better alternatives simply because they do not have timely information.

## Overview & Solution
CostNote solves the friction of financial tracking for Gen Z. By using a natural language "Notes" interface (e.g., typing "coffee 5"), our app automatically categorizes expenses, benchmarks them against typical local prices, and checks them against existing BNPL debt to provide instant, actionable financial insights. On top of that, a monthly budgeting layer helps students stay on track with their saving goals.

## Key Features
- **Natural language expense diary**: Students type like they would in a notes app (e.g. `chicken rice 8 at Clementi MRT`), and the AI parses category, amount, and intent.
- **Real-time price benchmarking**: Each expense is compared against an estimated local area average, with a clear label such as **good deal**, **about average**, or **above area average**.
- **Cheaper nearby suggestions**: When the price is high, the app can suggest a cheaper nearby alternative (simulated using data.gov.sg and OneMap for the prototype).
- **Monthly budget & saving goal onboarding**: On first open, students set how much money they have to manage this month and how much they want to save.
- **Safe-to-spend guidance**: The app calculates a “safe to spend” monthly amount after savings, shows how much is left, and warns when spending is close to or exceeding that limit.
- **Spending breakdown dashboard**: A visual breakdown (via pie chart) shows where money is going (Food, Transport, Groceries, Treats), aligned with the problem statement categories.

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
* **AI Tools Used for Assistance:** Gemini 3.1 Pro and Cursor AI (Used for architecture brainstorming, React component generation, and debugging assistance).
* All code has been reviewed, understood, and implemented by the team. Solutions are entirely original.

## Screenshots
<img width="474" height="745" alt="Screenshot 2026-04-23 at 9 53 42 AM" src="https://github.com/user-attachments/assets/9f5b2b67-e985-4505-bcb3-3612e558f670" />
<img width="500" height="509" alt="Screenshot 2026-04-23 at 9 53 51 AM" src="https://github.com/user-attachments/assets/27149aef-8a17-49b0-8e4e-5d72a67a4986" />
