import { config } from "../../../config";

const ALLOWED = config.allowedDomains;

function isDomainAllowed(): boolean {
  const host = window.location.hostname;
  return ALLOWED.some((d) => host === d || host.endsWith("." + d));
}

async function deriveKey(password: string): Promise<CryptoKey> {
  const buf = new TextEncoder().encode(password);
  const hash = await crypto.subtle.digest("SHA-256", buf);
  return crypto.subtle.importKey(
    "raw",
    hash.slice(0, 32),
    { name: "AES-CBC" },
    false,
    ["decrypt"]
  );
}

export const decryptFile = async (
  url: string,
  password: string
): Promise<ArrayBuffer> => {
  if (!isDomainAllowed()) {
    throw new Error("Unauthorized domain: " + window.location.hostname);
  }
  const response = await fetch(url);
  console.log("[decrypt] fetch status:", response.status, url);
  if (!response.ok) throw new Error("Fetch failed: " + response.status + " " + url);
  const encryptedData = await response.arrayBuffer();
  console.log("[decrypt] file size bytes:", encryptedData.byteLength);
  if (encryptedData.byteLength < 17) throw new Error("File too small, probably 404 HTML");
  const iv = new Uint8Array(encryptedData.slice(0, 16));
  const data = encryptedData.slice(16);
  console.log("[decrypt] key password length:", password.length, "| data bytes:", data.byteLength);
  const key = await deriveKey(password);
  return crypto.subtle.decrypt({ name: "AES-CBC", iv }, key, data);
};
