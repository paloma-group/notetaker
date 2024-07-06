'use server';

import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export const highlights = async (
  transcription: string | null
): Promise<{
  title: string;
  highlights: string[];
  keywords: string[];
} | null> => {
  if (!transcription) {
    return null;
  }

  const model = 'gpt-3.5-turbo';
  const prompt =
    'The following is a transcript of a voice message. Extract a title, a max of 3 bullet points or highlights, a max of 3 tags or keywords. Return response in JSON format: { title: string, highlights: [string, string, ...], keywords: [string, string, ...]}';

    console.log(`Transcript in highlights: ${JSON.stringify(transcription)}`)
  const response = await openai.chat.completions.create({
    messages: [
      { role: 'system', content: prompt },
      { role: 'user', content: transcription },
    ],
    model,
  });

  const content = response.choices[0].message.content;

  if (content) {
    return JSON.parse(content);
  }
  return null;
};
