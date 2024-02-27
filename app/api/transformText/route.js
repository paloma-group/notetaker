import OpenAI from "openai";
import { NextResponse } from "next/server";

// Initialize OpenAI API client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

// Function to process text and get transformation based on input
export async function POST(request) {
  if (!process.env.OPENAI_API_KEY) {
    return NextResponse.json({ error: "OpenAI API key not configured, please follow instructions in README.md" }, { status:500 });
  }

  try {
    const { input, transcription } = await request.json()
    const model = 'gpt-3.5-turbo';
    const prompt = `${input}, and make it ready to copy and paste: "${transcription}"`;

    const response = await openai.chat.completions.create({
      messages: [{ role: 'user', content: prompt }],
      model,
    });

    const transformedText = response.choices[0].message.content

    return NextResponse.json({result: transformedText}, { status:200 });
  } catch (error) {
    console.error('Error processing text:', error);
    return NextResponse.json({ error: "An error occurred during your request." }, { status: 500 });
  }
};
