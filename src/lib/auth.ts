/**
 * COSMO AI Secure Scientific Gateway Authentication
 * Provides cryptographic session token generation, verification,
 * and authorized researcher credential checking.
 */

export interface CosmoUser {
  id: string;
  name: string;
  email: string;
  role: string;
  avatarText: string;
  authMethod: "credentials" | "access_key";
}

export interface SessionPayload {
  user: CosmoUser;
  exp: number; // Expiration timestamp in ms
  iat: number; // Issued at timestamp in ms
}

const DEFAULT_SECRET = "cosmo_astrophysics_secure_session_gateway_secret_2026";
export const AUTH_COOKIE_NAME = "cosmo_session";

function getAuthSecret(): string {
  return process.env.COSMO_AUTH_SECRET || DEFAULT_SECRET;
}

// Configurable authorized credentials
export function getAuthorizedUsers(): { email: string; passwordHashOrPlain: string; user: CosmoUser }[] {
  const customEmail = process.env.COSMO_RESEARCHER_EMAIL?.trim().toLowerCase();
  const customPass = process.env.COSMO_RESEARCHER_PASSWORD || "CosmoDeepSpace2026!";

  const users = [
    {
      email: customEmail || "shruti@cosmo.ai",
      passwordHashOrPlain: customPass,
      user: {
        id: "shruti-singh",
        name: "Dr. Shruti Singh",
        email: customEmail || "shruti@cosmo.ai",
        role: "Lead Astrophysicist & Investigator",
        avatarText: "SS",
        authMethod: "credentials" as const,
      },
    },
    {
      email: "researcher@cosmology.org",
      passwordHashOrPlain: customPass,
      user: {
        id: "cosmo-researcher",
        name: "COSMO Observatory Researcher",
        email: "researcher@cosmology.org",
        role: "Astrophysics Data Specialist",
        avatarText: "CR",
        authMethod: "credentials" as const,
      },
    },
    {
      email: "admin@cosmo.ai",
      passwordHashOrPlain: customPass,
      user: {
        id: "admin-cosmo",
        name: "System Administrator",
        email: "admin@cosmo.ai",
        role: "Observatory Mission Director",
        avatarText: "AD",
        authMethod: "credentials" as const,
      },
    },
  ];

  return users;
}

// Authorized Passkeys (e.g. for mission telemetry and fast pass)
export function getAuthorizedPasskeys(): { key: string; user: CosmoUser }[] {
  const customKey = process.env.COSMO_RESEARCH_ACCESS_KEY?.trim() || "ISRO-COSMO-XSPECT-2026";

  return [
    {
      key: customKey,
      user: {
        id: "isro-telemetry-researcher",
        name: "ISRO Mission Telemetry Partner",
        email: "telemetry@isro.gov.in",
        role: "Orbital Spacecraft Analyst",
        avatarText: "IS",
        authMethod: "access_key",
      },
    },
    {
      key: "COSMO-DEEP-SPACE-KEY",
      user: {
        id: "deep-space-analyst",
        name: "Deep Space Field Researcher",
        email: "deepspace@cosmo.ai",
        role: "Spectroscopic Analyst",
        avatarText: "DS",
        authMethod: "access_key",
      },
    },
  ];
}

// Base64Url helpers compatible with Edge & Node
const encoder = new TextEncoder();
const decoder = new TextDecoder();

function toBase64Url(bytes: Uint8Array): string {
  let binary = "";
  for (let i = 0; i < bytes.length; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary)
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/, "");
}

function fromBase64Url(str: string): Uint8Array {
  let base64 = str.replace(/-/g, "+").replace(/_/g, "/");
  while (base64.length % 4) {
    base64 += "=";
  }
  const binary = atob(base64);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) {
    bytes[i] = binary.charCodeAt(i);
  }
  return bytes;
}

async function getHmacKey(secret: string): Promise<CryptoKey> {
  return await crypto.subtle.importKey(
    "raw",
    encoder.encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign", "verify"]
  );
}

/**
 * Creates a cryptographically signed session token for a validated user.
 * Valid for 7 days by default.
 */
export async function createSessionToken(
  user: CosmoUser,
  expiresInMs: number = 7 * 24 * 60 * 60 * 1000
): Promise<string> {
  const secret = getAuthSecret();
  const key = await getHmacKey(secret);

  const payload: SessionPayload = {
    user,
    iat: Date.now(),
    exp: Date.now() + expiresInMs,
  };

  const payloadString = JSON.stringify(payload);
  const payloadBase64 = toBase64Url(encoder.encode(payloadString));

  const signature = await crypto.subtle.sign(
    "HMAC",
    key,
    encoder.encode(payloadBase64)
  );

  const signatureBase64 = toBase64Url(new Uint8Array(signature));
  return `${payloadBase64}.${signatureBase64}`;
}

/**
 * Verifies the cryptographic signature and expiration of a session token.
 */
export async function verifySessionToken(token: string | undefined | null): Promise<SessionPayload | null> {
  if (!token || typeof token !== "string") return null;

  const parts = token.split(".");
  if (parts.length !== 2) return null;

  const [payloadBase64, signatureBase64] = parts;
  if (!payloadBase64 || !signatureBase64) return null;

  try {
    const secret = getAuthSecret();
    const key = await getHmacKey(secret);

    const isValidSig = await crypto.subtle.verify(
      "HMAC",
      key,
      fromBase64Url(signatureBase64) as unknown as BufferSource,
      encoder.encode(payloadBase64)
    );

    if (!isValidSig) return null;

    const payloadJson = decoder.decode(fromBase64Url(payloadBase64));
    const payload: SessionPayload = JSON.parse(payloadJson);

    // Verify expiration
    if (!payload.exp || Date.now() > payload.exp) {
      return null;
    }

    return payload;
  } catch {
    return null;
  }
}

/**
 * Validates email and password against authorized registry.
 */
export function authenticateWithCredentials(
  emailInput: string,
  passwordInput: string
): CosmoUser | null {
  const cleanEmail = emailInput?.trim().toLowerCase();
  const cleanPassword = passwordInput?.trim();

  if (!cleanEmail || !cleanPassword) return null;

  const accounts = getAuthorizedUsers();
  const matched = accounts.find(
    (acc) =>
      acc.email.toLowerCase() === cleanEmail &&
      acc.passwordHashOrPlain === cleanPassword
  );

  return matched ? matched.user : null;
}

/**
 * Validates scientific passkey / mission access token.
 */
export function authenticateWithPasskey(passkeyInput: string): CosmoUser | null {
  const cleanKey = passkeyInput?.trim();
  if (!cleanKey) return null;

  const passkeys = getAuthorizedPasskeys();
  const matched = passkeys.find(
    (p) => p.key.toLowerCase() === cleanKey.toLowerCase()
  );

  return matched ? matched.user : null;
}
