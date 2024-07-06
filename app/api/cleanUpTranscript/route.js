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
    const { rawTranscript } = await request.json();

    const model = 'gpt-4o';
    const prompt =
      'The following is a transcript of a voice note or a meeting. Clean up the transcript by removing repetition where necessary. Return response in JSON format: { transcript: string }';

      console.log(`Cleaning up transcript: ${JSON.stringify(rawTranscript)}`)
    const response = await openai.chat.completions.create({
      messages: [
        { role: 'system', content: prompt },
        { role: 'user', content: rawTranscript },
      ],
      model,
      response_format:{ "type": "json_object" },
    });

    // Return the cleaned up transcript
    return NextResponse.json(
      { result: JSON.parse(response.choices[0].message.content)['transcript'] },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error cleaning up transcript:', error);
    return NextResponse.json(
      { error: 'Failed to clean up transcript' },
      { status: 500 }
    );
  }
}
