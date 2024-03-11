type Transcript = {
  text: string | string[];
};

const isTranscript = (transcript: unknown): transcript is Transcript => {
  return !!transcript && typeof transcript === 'object' && 'text' in transcript;
};

const extractTextFromTranscript = (transcript: string) => {
  try {
    const parsedTranscript = JSON.parse(transcript);
    if (isTranscript(parsedTranscript)) {
      return parsedTranscript.text;
    }
  } catch (e) {
    return transcript;
  }
};

export const extractTranscriptComponents = (text: string) => {
  const transformationText = extractTextFromTranscript(text);

  if (!transformationText) {
    return [];
  }

  return Array.isArray(transformationText)
    ? transformationText
    : transformationText.split('\n');
};

export const extractRawTextFromTranscript = (text: string) => {
  const elements = extractTranscriptComponents(text);

  return elements.join('\n');
};
