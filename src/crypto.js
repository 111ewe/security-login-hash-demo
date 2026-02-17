import crypto from "crypto";
import { KEYCODE_HMAC_SECRET } from "./config.js";

export function normalizeCode(code) {
  return String(code || "").trim().toUpperCase();
}

export function hashKeycode(code) {
  const normalized = normalizeCode(code);
  return crypto
    .createHmac("sha256", KEYCODE_HMAC_SECRET)
    .update(normalized)
    .digest("hex");
}

// Demo: 8 chars, avoid O/0/I/1
export function generateKeycode(length = 8) {
  const alphabet = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let out = "";
  for (let i = 0; i < length; i++) {
    out += alphabet[Math.floor(Math.random() * alphabet.length)];
  }
  return out;
}
