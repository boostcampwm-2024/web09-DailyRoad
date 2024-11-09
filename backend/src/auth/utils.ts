const BEARER = 'Bearer';
const BEARER_REGEX = new RegExp(`^${BEARER}\\s+([A-Za-z0-9\\-._~+\\/=]*)$`);

export function extractBearerToken(header: string): string | null {
  if (!header) {
    return null;
  }
  const match = header.match(BEARER_REGEX);
  return match ? match[1] : null;
}

export function addBearerToken(token: string): string {
  return `${BEARER} ${token}`;
}
