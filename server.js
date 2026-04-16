const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const rateLimit = require("express-rate-limit");
require("dotenv").config();

const app = express();

// ─── Middleware ───
app.use(express.json());
const allowedOrigins = [
  "http://localhost:3000",
  "http://localhost:5173",
  process.env.FRONTEND_URL,
].filter(Boolean);

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (mobile apps, curl, etc.)
      if (!origin) return callback(null, true);
      // Allow any Vercel deployment URL or explicitly listed origins
      if (
        allowedOrigins.includes(origin) ||
        /\.vercel\.app$/.test(origin)
      ) {
        return callback(null, true);
      }
      return callback(null, true); // Allow all for now — tighten after confirming frontend URL
    },
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
app.use("/api/videos", require("./routes/videos"));

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
