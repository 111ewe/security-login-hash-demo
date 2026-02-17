import express from "express";
import { accessCodesRouter } from "./routes/accessCodes.js";

const app = express();
app.use(express.json());

app.get("/health", (_req, res) => res.json({ ok: true }));

// 你负责的 demo keycode 注册/创建
app.use("/access-codes", accessCodesRouter);

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
