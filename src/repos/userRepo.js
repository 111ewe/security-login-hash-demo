import crypto from "crypto";
const usersByKey = new Map();

export function getOrCreateUser({ partner_id, external_id }) {
  const key = `${partner_id}:${external_id}`;
  const existing = usersByKey.get(key);
  if (existing) return existing;

  const user = {
    id: crypto.randomUUID(),
    partner_id,
    external_id,
    created_at: Date.now(),
  };
  usersByKey.set(key, user);
  return user;
}
