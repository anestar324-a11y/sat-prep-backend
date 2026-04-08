const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const rateLimit = require("express-rate-limit");
require("dotenv").config();

const app = express();

// ─── Middleware ───
app.use(express.json());
app.use(
  cors({
    origin: process.env.FRONTEND_URL || "http://localhost:3000",
    credentials: true,
  })
);

// ─── Rate Limiting (хэт олон хүсэлтээс хамгаалах) ───
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 минут
  max: 100, // IP бүрээс 100 хүсэлт
  message: { error: "Хэт олон хүсэлт илгээлээ. Түр хүлээнэ үү." },
});
app.use("/api/", limiter);

// ─── MongoDB холболт ───
mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => console.log("✅ MongoDB-тэй холбогдлоо!"))
  .catch((err) => console.error("❌ MongoDB холболтын алдаа:", err));

// ─── Routes ───
app.use("/api/auth", require("./routes/auth"));
app.use("/api/questions", require("./routes/questions"));
app.use("/api/tests", require("./routes/tests"));
app.use("/api/progress", require("./routes/progress"));
app.use("/api/flashcards", require("./routes/flashcards"));
app.use("/api/news", require("./routes/news"));

// ─── Эрүүл мэнд шалгах endpoint ───
app.get("/api/health", (req, res) => {
  res.json({ status: "ok", message: "SAT Prep API ажиллаж байна! 🚀" });
});

// ─── Алдааны handler ───
app.use((err, req, res, next) => {
  console.error("Алдаа:", err.stack);
  res.status(500).json({ error: "Серверийн алдаа гарлаа" });
});

// ─── Сервер эхлүүлэх ───
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 SAT Prep сервер ${PORT} порт дээр ажиллаж байна`);
});
