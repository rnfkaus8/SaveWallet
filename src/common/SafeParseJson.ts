export const safeParseJSON = <T>(input: string): T | null => {
  try {
    return JSON.parse(input);
  } catch (e) {
    console.error(e);
    return null;
  }
};
