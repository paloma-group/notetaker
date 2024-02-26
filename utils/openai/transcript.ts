export const transcript = async (audioBlob: Blob): Promise<string | null> => {
  try {
    const reader = new FileReader();
    reader.readAsDataURL(audioBlob);
    return await new Promise<string | null>(async (resolve, reject) => {
      reader.onloadend = async () => {
        const base64Audio = reader.result as string;
        const audio = base64Audio.split(',')[1]; // Remove the data URL prefix
        const response = await fetch("/api/speechToText", {
          method: "POST",
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ audio }),
        });
        const data = await response.json();
        if (response.status !== 200) {
          reject(data.error || new Error(`Request failed with status ${response.status}`));
          return;
        }
        resolve(data.result as string); // Resolve the Promise with the transcription
      };
    });
  } catch (error) {
    console.error(error);
    return null;
  }
}
