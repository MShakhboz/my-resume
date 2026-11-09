// Password-based encryption with the Web Crypto API, which both browsers and Node have:
// PBKDF2 (SHA-256) turns the password into an AES-256-GCM key. Only the encrypted payload is
// committed; the password lives in .env.local and in the owner's head, never in the code.
// No imports, so scripts/encrypt-logs.mts can load this file directly with Node.

export type EncryptedPayload = {
  v: 1;
  iterations: number;
  salt: string; // base64
  iv: string; // base64
  data: string; // base64 ciphertext with the GCM auth tag
};

const ITERATIONS = 600_000; // OWASP's 2023 figure for PBKDF2-SHA256

const toBase64 = (bytes: Uint8Array) => btoa(String.fromCharCode(...bytes));
const fromBase64 = (text: string) => Uint8Array.from(atob(text), (c) => c.charCodeAt(0));

async function deriveKey(password: string, salt: Uint8Array, iterations: number) {
  const material = await crypto.subtle.importKey("raw", new TextEncoder().encode(password), "PBKDF2", false, [
    "deriveKey",
  ]);
  return crypto.subtle.deriveKey(
    { name: "PBKDF2", hash: "SHA-256", salt: salt as BufferSource, iterations },
    material,
    { name: "AES-GCM", length: 256 },
    false,
    ["encrypt", "decrypt"]
  );
}

export async function encryptJson(value: unknown, password: string): Promise<EncryptedPayload> {
  const salt = crypto.getRandomValues(new Uint8Array(16));
  const iv = crypto.getRandomValues(new Uint8Array(12));
  const key = await deriveKey(password, salt, ITERATIONS);
  const plain = new TextEncoder().encode(JSON.stringify(value));
  const cipher = new Uint8Array(await crypto.subtle.encrypt({ name: "AES-GCM", iv }, key, plain));
  return { v: 1, iterations: ITERATIONS, salt: toBase64(salt), iv: toBase64(iv), data: toBase64(cipher) };
}

/** Rejects when the password is wrong: AES-GCM checks the auth tag before returning anything. */
export async function decryptJson<T>(payload: EncryptedPayload, password: string): Promise<T> {
  const key = await deriveKey(password, fromBase64(payload.salt), payload.iterations);
  const plain = await crypto.subtle.decrypt(
    { name: "AES-GCM", iv: fromBase64(payload.iv) as BufferSource },
    key,
    fromBase64(payload.data) as BufferSource
  );
  return JSON.parse(new TextDecoder().decode(plain)) as T;
}
