import crypto from "crypto";
import { KEYCODE_TTL_SECONDS } from "../config.js";
import { hashKeycode } from "../crypto.js";

const accessCodesByHash = new Map();

/**
 * record:
 * { id, partner_id, external_id, code_hash, expires_at, status, used_at, created_at }
 */
export function createAccessCodeWithPlainCode({
  plainCode,
  partner_id,
  external_id = null,
  ttlSeconds = KEYCODE_TTL_SECONDS,
}) {
  const now = Date.now();
  const code_hash = hashKeycode(plainCode);

  if (accessCodesByHash.has(code_hash)) {
    throw new Error("DUPLICATE_CODE");
  }

  const record = {
    id: crypto.randomUUID(),
    partner_id,
    external_id,
    code_hash,
    expires_at: now + ttlSeconds * 1000,
    status: "active",
    used_at: null,
    created_at: now,
  };

  accessCodesByHash.set(code_hash, record);
  return record;
}

export function getAccessCodeByPlainCode(plainCode) {
  const code_hash = hashKeycode(plainCode);
  return accessCodesByHash.get(code_hash) || null;
}

// 给 Member2 用：校验 + 标记 used（一次性）
export function consumeAccessCodeIfValid(plainCode) {
  const rec = getAccessCodeByPlainCode(plainCode);
  if (!rec) return null;

  const now = Date.now();
  if (rec.status !== "active") return null;
  if (rec.expires_at <= now) return null;

  rec.status = "used";
  rec.used_at = now;
  accessCodesByHash.set(rec.code_hash, rec);
  return rec;
}

// 仅 demo/debug
export function _debugList() {
  return Array.from(accessCodesByHash.values()).map((r) => ({
    ...r,
    code_hash: r.code_hash.slice(0, 8) + "...", // 避免把 hash 全暴露
  }));
}
