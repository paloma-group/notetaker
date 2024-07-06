export const cleanTranscript = async (
  rawTranscript: string
): Promise<string | null> => {
  const response = await fetch('/api/cleanUpTranscript', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ rawTranscript }),
  });
  const data = await response.json();
  if (response.status !== 200) {
    console.error(
      `Request failed with status ${response.status}. Error: ${data.error}; Message: ${data.message}`
    );
    return null;
  }
  return data.result as string;
};
