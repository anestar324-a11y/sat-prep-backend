const express = require("express");
const News = require("../models/News");
const { auth } = require("../middleware/auth");

const router = express.Router();

// ─── БҮХ МЭДЭЭ ───
// GET /api/news
router.get("/", auth, async (req, res) => {
  try {
    const { category } = req.query;

    const filter = {};
    if (category && category !== "all") filter.category = category;

    const articles = await News.find(filter)
      .sort({ pinned: -1, createdAt: -1 })
      .select("-content"); // Жагсаалтад content шаардлагагүй

    res.json({ articles });
  } catch (error) {
    res.status(500).json({ error: "Серверийн алдаа" });
  }
});

// ─── ОНЦЛОХ МЭДЭЭНҮҮД ───
// GET /api/news/pinned
router.get("/pinned", auth, async (req, res) => {
  try {
    const pinned = await News.find({ pinned: true })
      .sort({ createdAt: -1 })
      .select("-content");

    res.json({ articles: pinned });
  } catch (error) {
    res.status(500).json({ error: "Серверийн алдаа" });
  }
});

// ─── НЭГ МЭДЭЭНИЙ ДЭЛГЭРЭНГҮЙ ───
// GET /api/news/:id
router.get("/:id", auth, async (req, res) => {
  try {
    const article = await News.findById(req.params.id);

    if (!article) {
      return res.status(404).json({ error: "Мэдээ олдсонгүй" });
    }

    res.json({ article });
  } catch (error) {
    res.status(500).json({ error: "Серверийн алдаа" });
  }
});

// ─── МЭДЭЭ НЭМЭХ (Admin) ───
// POST /api/news
router.post("/", auth, async (req, res) => {
  try {
    const { category, categoryLabel, emoji, title, summary, readTime, pinned, published, content } = req.body;

    const article = await News.create({
      category,
      categoryLabel: categoryLabel || category,
      emoji: emoji || "📰",
      title,
      summary: summary || "",
      readTime: readTime || "3 мин",
      pinned: pinned || false,
      published: published || false,
      content: content || [],
    });

    res.status(201).json({ message: "Мэдээ нэмэгдлээ!", article });
  } catch (error) {
    console.error("Мэдээ нэмэх алдаа:", error);
    res.status(500).json({ error: "Серверийн алдаа" });
  }
});

// ─── МЭДЭЭ ЗАСАХ ───
// PUT /api/news/:id
router.put("/:id", auth, async (req, res) => {
  try {
    const article = await News.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!article) return res.status(404).json({ error: "Мэдээ олдсонгүй" });
    res.json({ message: "Мэдээ шинэчлэгдлээ!", article });
  } catch (error) {
    res.status(500).json({ error: "Серверийн алдаа" });
  }
});

// ─── МЭДЭЭ УСТГАХ ───
// DELETE /api/news/:id
router.delete("/:id", auth, async (req, res) => {
  try {
    const article = await News.findByIdAndDelete(req.params.id);
    if (!article) return res.status(404).json({ error: "Мэдээ олдсонгүй" });
    res.json({ message: "Мэдээ устгагдлаа!" });
  } catch (error) {
    res.status(500).json({ error: "Серверийн алдаа" });
  }
});

module.exports = router;
