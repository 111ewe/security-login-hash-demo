import express from "express";
import { generateKeycode } from "../crypto.js";
import { createAccessCodeWithPlainCode, _debugList } from "../repos/accessCodeRepo.js";

export const accessCodesRouter = express.Router();

/**
 * POST /access-codes
 * body: { partner_id, external_id?, ttl_seconds? }
 * response: { access_code_id, code, expires_at, partner_id }
 *
 * 注意：MVP demo 才返回明文 code；生产不要返回
 */
accessCodesRouter.post("/", (req, res) => {
  const { partner_id, external_id = null, ttl_seconds } = req.body || {};

  if (!partner_id) {
    return res.status(400).json({ error: "partner_id is required" });
  }

  const code = generateKeycode(8);

  try {
    const rec = createAccessCodeWithPlainCode({
      plainCode: code,
      partner_id,
      external_id,
      ttlSeconds: typeof ttl_seconds === "number" ? ttl_seconds : undefined,
    });

    return res.status(201).json({
      access_code_id: rec.id,
      code, // demo only
      expires_at: new Date(rec.expires_at).toISOString(),
      partner_id: rec.partner_id,
    });
  } catch (e) {
    if (e?.message === "DUPLICATE_CODE") {
      return res.status(409).json({ error: "duplicate code, retry" });
    }
    return res.status(500).json({ error: "internal error" });
  }
});

// 可选 debug：GET /access-codes/_debug
accessCodesRouter.get("/_debug", (_req, res) => {
  res.json(_debugList());
});
