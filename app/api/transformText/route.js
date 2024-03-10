import OpenAI from 'openai';
import { NextResponse } from 'next/server';

// Initialize OpenAI API client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Function to process text and get transformation based on the prompt
export async function POST(request) {
  if (!process.env.OPENAI_API_KEY) {
    return NextResponse.json(
      {
        error:
          'OpenAI API key not configured, please follow instructions in README.md',
      },
      { status: 500 }
    );
  }

  try {
    const { prompt, transcription } = await request.json();
    const model = 'gpt-3.5-turbo';
    const content = `${prompt}\n\n[TRANSCRIPT]\n${transcription}`;

    const response = await openai.chat.completions.create({
      messages: [{ role: 'user', content }],
      model,
    });

    const transformedText = response.choices[0].message.content;

    return NextResponse.json({ result: transformedText }, { status: 200 });
  } catch (error) {
    console.error('Error processing text:', error);
    return NextResponse.json(
      { error: 'An error occurred during your request.' },
      { status: 500 }
    );
  }
}
