// src/config.js
export const KEYCODE_TTL_SECONDS = 5 * 60;     // 5 minutes
export const JWT_TTL_SECONDS = 45 * 60;        // 45 minutes (给 member3 用)
export const KEYCODE_HMAC_SECRET = process.env.KEYCODE_HMAC_SECRET || "dev-secret-change-me";
