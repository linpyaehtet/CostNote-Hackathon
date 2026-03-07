import Anthropic from '@anthropic-ai/sdk';
import { NextResponse } from 'next/server';

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY, 
});

export async function POST(req) {
  try {
    const { userInput } = await req.json();

    const systemPrompt = `
      You are the AI for CostNote, a personal finance app for Gen Z.
      Analyze the expense: "${userInput}".
      Return ONLY a raw JSON object (no markdown, no formatting) with:
      - "category": (Food, Transport, Groceries, or Treat)
      - "amount": (number)
      - "insight": A 1-sentence reality check comparing it to local averages and warning about BNPL debt.
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