import Anthropic from '@anthropic-ai/sdk';
import { NextResponse } from 'next/server';

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY, 
});

export async function POST(req) {
  try {
    const { userInput } = await req.json();

    const systemPrompt = `
You are the AI for CostNote, a personal finance app for Gen Z in Singapore.

USER EXPENSE TEXT:
"${userInput}"

Your job is to:
- Parse the expense text.
- Estimate whether the user overpaid or got a good deal compared to typical local prices.
- Provide one short, actionable insight.

Return ONLY a raw JSON object (no markdown, no code fences, no explanation) with the following keys:
- "category": one of ["Food", "Transport", "Groceries", "Treat"]
- "amount": number – the price paid by the user (e.g. 8.5)
- "area_average": number – your best estimate of the typical price for this item in the user's area (e.g. 5.0)
- "price_difference": number – amount - area_average (can be negative if the user got a cheaper-than-average deal)
- "deal_quality": one of ["good_deal", "about_average", "above_average"]
- "cheaper_alternative": short string suggesting a cheaper nearby option (e.g. "Try the hawker centre at the Community Centre ~ $4.50"), or "" if not relevant
- "insight": one short English sentence (max 25 words) summarising whether this was a good deal and how it affects their budget/BNPL risk.

Example (illustrative only, DO NOT include comments in your answer):
{
  "category": "Food",
  "amount": 8.0,
  "area_average": 5.0,
  "price_difference": 3.0,
  "deal_quality": "above_average",
  "cheaper_alternative": "Stall B at nearby community centre is around $4.50 for similar chicken rice.",
  "insight": "You paid about $3 above the usual price for chicken rice in this area – consider switching to the nearby community centre stall to save weekly."
}
    `;

    const response = await anthropic.messages.create({
        model: "claude-sonnet-4-6",
      max_tokens: 150,
      messages: [{ role: "user", content: systemPrompt }]
    });

    let rawText = response.content[0].text.trim();
    if (rawText.startsWith('```json')) {
      rawText = rawText.replace(/```json\n?/, '').replace(/```\n?$/, '');
    } else if (rawText.startsWith('```')) {
        rawText = rawText.replace(/```\n?/, '').replace(/```\n?$/, '');
    }

    const data = JSON.parse(rawText);
    return NextResponse.json(data);

  } catch (error) {
    // This will tell us EXACTLY what Anthropic is mad about if it fails again
    console.error("ANTHROPIC API ERROR:", error.message || error);
    return NextResponse.json({ error: "Failed to parse expense" }, { status: 500 });
  }
}