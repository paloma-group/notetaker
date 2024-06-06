import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export const transform = async (transcription: string, prompt: string) => {
  if (!process.env.OPENAI_API_KEY) {
    throw Error(
      'OpenAI API key not configured, please follow instructions in README.md'
    );
  }

  const model = 'gpt-4o';
  const content = `${prompt}\n\n[TRANSCRIPT]\n${transcription}`;

  const response = await openai.chat.completions.create({
    messages: [{ role: 'user', content }],
    model,
  });

  return response.choices[0].message.content;
};
