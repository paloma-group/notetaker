import OpenAI from 'openai';
import { NextResponse } from 'next/server';

// Initialize OpenAI API client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

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
    const { transcription } = await request.json();

    const model = 'gpt-4o';
    const prompt =
      'The following is a transcript of a voice message. Extract a title, a max of 3 bullet points or highlights, a max of 3 tags or keywords. Return response in JSON format: { title: string, highlights: [string, string, ...], keywords: [string, string, ...]}';

    const response = await openai.chat.completions.create({
      messages: [
        { role: 'system', content: prompt },
        { role: 'user', content: transcription },
      ],
      model,
    });

    // Return the bullet points
    return NextResponse.json(
      { result: JSON.parse(response.choices[0].message.content) },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error generating bullet points:', error);
    return NextResponse.json(
      { error: 'Failed to generate bullet points' },
      { status: 500 }
    );
  }
}
