export const transform = async (
  transcription: string | null,
  prompt: string
): Promise<string | null> => {
  try {
    const response = await fetch('/api/transformText', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        transcription,
        prompt,
      }),
    });
    const data = await response.json();

    if (response.status !== 200) {
      console.error(`Request failed with status ${response.status}`);
      return null; // Return null directly
    }
    return data.result;
  } catch (error) {
    console.error(error);
    return null;
  }
};
