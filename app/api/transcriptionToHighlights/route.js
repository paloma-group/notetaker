import OpenAI from "openai";
import { NextResponse } from "next/server";

// Initialize OpenAI API client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

export async function POST(request) {
  if (!process.env.OPENAI_API_KEY) {
    return NextResponse.json({ error: 'OpenAI API key not configured, please follow instructions in README.md' }, { status:500 });
  }

  try {
    const { transcription } = await request.json();

    const model = 'gpt-3.5-turbo';
    const prompt = `generate a max of 3 bullet points from the following text, and make it ready to copy and paste: "${transcription}"`;

    const response = await openai.chat.completions.create({
      messages: [{ role: 'user', content: prompt }],
      model,
    });

    // Extract bullet points from the response
    const bulletPoints = response.choices[0].message.content.replaceAll('- ', '');

    // Return the bullet points
    return NextResponse.json({result: bulletPoints}, { status:200 });
  } catch (error) {
    console.error('Error generating bullet points:', error);
    return NextResponse.json({ error: 'Failed to generate bullet points' }, { status: 500 });
  }
}
