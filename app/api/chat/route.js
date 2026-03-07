import Anthropic from '@anthropic-ai/sdk';
import { NextResponse } from 'next/server';

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY, 
});

export async function POST(req) {
  try {
    const { userInput } = await req.json();

    const systemPrompt = `
      You are the AI for CostNote, a personal finance app for Gen Z[cite: 166, 170].
      Analyze the expense: "${userInput}".
      Return ONLY a raw JSON object (no markdown, no formatting) with:
      - "category": (Food, Transport, Groceries, or Treat)
      - "amount": (number)
      - "insight": A 1-sentence reality check comparing it to local averages [cite: 184] and warning about BNPL debt[cite: 158].
    `;

    const response = await anthropic.messages.create({
      model: "claude-3-haiku-20240307",
      max_tokens: 150,
      messages: [{ role: "user", content: systemPrompt }]
    });

    const data = JSON.parse(response.content[0].text);
    return NextResponse.json(data);

  } catch (error) {
    return NextResponse.json({ error: "Failed to parse expense" }, { status: 500 });
  }
}