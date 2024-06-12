import crypto from "node:crypto";

export const generateId = () => {
  // Convert UUIDv4 to a binary buffer
  const buffer = Buffer.from(crypto.randomUUID().replace(/-/g, ""), "hex");

  // Encode the buffer using Base64 URL encoding
  const base64Url = buffer
    .toString("base64")
    .replace(/\+/g, "-") // Convert '+' to '-'
    .replace(/\//g, "_") // Convert '/' to '_'
    .replace(/=+$/, ""); // Remove padding '='

  return base64Url;
};
