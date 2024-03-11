export function parseTransformedText(transformed_text: string) {
  try {
    return JSON.parse(transformed_text).text;
  } catch {
    return null;
  }
}
