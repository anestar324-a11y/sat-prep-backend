const express = require("express");
const Flashcard = require("../models/Flashcard");
const { auth } = require("../middleware/auth");

const router = express.Router();

// ─── БҮХ DECK ЖАГСААЛТ ───
// GET /api/flashcards/decks
router.get("/decks", auth, async (req, res) => {
  try {
    const { section, difficulty } = req.query;

    const filter = {};
    if (section) filter.section = section;
    if (difficulty && difficulty !== "all") filter.difficulty = difficulty;

    const decks = await Flashcard.aggregate([
      { $match: filter },
      {
        $group: {
          _id: "$deckId",
          deckName: { $first: "$deckName" },
          section: { $first: "$section" },
          difficulty: { $first: "$difficulty" },
          emoji: { $first: "$emoji" },
          totalCards: { $sum: 1 },
        },
      },
      { $sort: { section: 1, difficulty: 1 } },
    ]);

    res.json({ decks });
  } catch (error) {
    res.status(500).json({ error: "Серверийн алдаа" });
  }
});

// ─── НЭГ DECK-ИЙН КАРТУУД ───
// GET /api/flashcards/deck/:deckId
router.get("/deck/:deckId", auth, async (req, res) => {
  try {
    const cards = await Flashcard.find({ deckId: req.params.deckId });

    if (cards.length === 0) {
      return res.status(404).json({ error: "Deck олдсонгүй" });
    }

    // Картуудыг санамсаргүй эрэмбэлэх
    const shuffled = cards.sort(() => Math.random() - 0.5);

    res.json({
      deckId: req.params.deckId,
      deckName: cards[0].deckName,
      section: cards[0].section,
      difficulty: cards[0].difficulty,
      cards: shuffled,
      totalCards: cards.length,
    });
  } catch (error) {
    res.status(500).json({ error: "Серверийн алдаа" });
  }
});

// ─── САНАМСАРГҮЙ КАРТ (Нүүр хуудасны "Үгсийн сан") ───
// GET /api/flashcards/random
router.get("/random", auth, async (req, res) => {
  try {
    const count = await Flashcard.countDocuments({ section: "english" });
    const random = Math.floor(Math.random() * count);
    const card = await Flashcard.findOne({ section: "english" }).skip(random);

    res.json({ card });
  } catch (error) {
    res.status(500).json({ error: "Серверийн алдаа" });
  }
});

// ─── КАРТ НЭМЭХ (Admin) ───
// POST /api/flashcards
router.post("/", auth, async (req, res) => {
  try {
    const { deckId, deckName, section, difficulty, emoji, front, back, example, pronunciation } = req.body;
    const card = await Flashcard.create({
      deckId, deckName, section, difficulty,
      emoji: emoji || "📝",
      front, back,
      example: example || null,
      pronunciation: pronunciation || null,
    });
    res.status(201).json({ message: "Карт нэмэгдлээ!", card });
  } catch (error) {
    console.error("Карт нэмэх алдаа:", error);
    res.status(500).json({ error: "Серверийн алдаа" });
  }
});

// ─── DECK-ИЙН БҮХ КАРТУУДЫГ УСТГАХ ───
// DELETE /api/flashcards/deck/:deckId
router.delete("/deck/:deckId", auth, async (req, res) => {
  try {
    await Flashcard.deleteMany({ deckId: req.params.deckId });
    res.json({ message: "Deck устгагдлаа!" });
  } catch (error) {
    res.status(500).json({ error: "Серверийн алдаа" });
  }
});

// ─── НЭГ КАРТ ЗАСАХ ───
// PUT /api/flashcards/:id
router.put("/:id", auth, async (req, res) => {
  try {
    const card = await Flashcard.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!card) return res.status(404).json({ error: "Карт олдсонгүй" });
    res.json({ message: "Карт шинэчлэгдлээ!", card });
  } catch (error) {
    res.status(500).json({ error: "Серверийн алдаа" });
  }
});

// ─── НЭГ КАРТ УСТГАХ ───
// DELETE /api/flashcards/:id
router.delete("/:id", auth, async (req, res) => {
  try {
    const card = await Flashcard.findByIdAndDelete(req.params.id);
    if (!card) return res.status(404).json({ error: "Карт олдсонгүй" });
    res.json({ message: "Карт устгагдлаа!" });
  } catch (error) {
    res.status(500).json({ error: "Серверийн алдаа" });
  }
});

module.exports = router;
