function decodePayload(token: string): Record<string, unknown> | null {
  const segment = token.split(".")[1];
  if (!segment) return null;

  try {
    const base64 = segment.replace(/-/g, "+").replace(/_/g, "/");
    const padded = base64.padEnd(Math.ceil(base64.length / 4) * 4, "=");
    const binary = atob(padded);
    const bytes = Uint8Array.from(binary, (char) => char.charCodeAt(0));
    const payload: unknown = JSON.parse(new TextDecoder().decode(bytes));
    return typeof payload === "object" && payload !== null
      ? (payload as Record<string, unknown>)
      : null;
  } catch {
    return null;
  }
}

// Si el token no se puede decodificar o no tiene exp, devuelve false:
// el request sale igual y, si da 401, lo cubre el refresh reactivo.
export function isTokenExpired(token: string): boolean {
  const exp = decodePayload(token)?.exp;
  if (typeof exp !== "number") return false;
  return exp * 1000 <= Date.now();
}
