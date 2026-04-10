const express = require("express");
const Question = require("../models/Question");
const { auth } = require("../middleware/auth");

const router = express.Router();

// ─── БҮХ АСУУЛТЫН СЭДВҮҮД АВАХ ───
// GET /api/questions/topics
router.get("/topics", auth, async (req, res) => {
  try {
    const { section } = req.query; // "math" эсвэл "reading-writing"

    const filter = section ? { section } : {};
    const topics = await Question.aggregate([
      { $match: filter },
      {
        $group: {
          _id: { topic: "$topic", section: "$section" },
          topicName: { $first: "$topicName" },
          count: { $sum: 1 },
          emoji: { $first: "$emoji" },
          difficulties: { $addToSet: "$difficulty" },
        },
      },
      { $sort: { "_id.section": 1, "_id.topic": 1 } },
    ]);

    res.json({ topics });
  } catch (error) {
    res.status(500).json({ error: "Серверийн алдаа" });
  }
});

// ─── СЭДВИЙН АСУУЛТУУД АВАХ ───
// GET /api/questions/topic/:topicId
router.get("/topic/:topicId", auth, async (req, res) => {
  try {
    const { difficulty, limit = 15 } = req.query;

    const filter = { topic: req.params.topicId };
    if (difficulty && difficulty !== "all") {
      filter.difficulty = difficulty;
    }

    const questions = await Question.find(filter)
      .limit(parseInt(limit))
      .select("-correctAnswer -explanation"); // Хариултыг эхлээд нуух

    res.json({ questions, total: questions.length });
  } catch (error) {
    res.status(500).json({ error: "Серверийн алдаа" });
  }
});

// ─── PRACTICE TEST-ИЙН АСУУЛТУУД ───
// GET /api/questions/practice-test/:testNumber
router.get("/practice-test/:testNumber", auth, async (req, res) => {
  try {
    const testNumber = parseInt(req.params.testNumber);

    const questions = await Question.find({ practiceTestId: testNumber }).select(
      "-correctAnswer -explanation"
    );

    // Math болон RW-гаар ялгах
    const math = questions.filter((q) => q.section === "math");
    const rw = questions.filter((q) => q.section === "reading-writing");

    res.json({
      testNumber,
      math: { questions: math, count: math.length },
      readingWriting: { questions: rw, count: rw.length },
      totalQuestions: questions.length,
    });
  } catch (error) {
    res.status(500).json({ error: "Серверийн алдаа" });
  }
});

// ─── ХАРИУЛТ ШАЛГАХ ───
// POST /api/questions/check
router.post("/check", auth, async (req, res) => {
  try {
    const { questionId, selectedAnswer } = req.body;

    const question = await Question.findById(questionId);
    if (!question) {
      return res.status(404).json({ error: "Асуулт олдсонгүй" });
    }

    const isCorrect = question.correctAnswer === selectedAnswer;

    res.json({
      isCorrect,
      correctAnswer: question.correctAnswer,
      explanation: question.explanation,
    });
  } catch (error) {
    res.status(500).json({ error: "Серверийн алдаа" });
  }
});

// ─── АСУУЛТ НЭМЭХ (Admin) ───
// POST /api/questions
router.post("/", auth, async (req, res) => {
  try {
    const { section, topic, topicName, difficulty, questionText, passage, imageUrl, options, correctAnswer, explanation, practiceTestId, emoji } = req.body;
    const question = await Question.create({
      section, topic, topicName, difficulty, questionText,
      passage: passage || null,
      imageUrl: imageUrl || null,
      options,
      correctAnswer,
      explanation,
      practiceTestId: practiceTestId || null,
      emoji: emoji || "📝",
    });
    res.status(201).json({ message: "Асуулт нэмэгдлээ!", question });
  } catch (error) {
    console.error("Асуулт нэмэх алдаа:", error);
    res.status(500).json({ error: "Серверийн алдаа" });
  }
});

// ─── БҮХ АСУУЛТУУД (Admin жагсаалт) ───
// GET /api/questions/admin/all
router.get("/admin/all", auth, async (req, res) => {
  try {
    const { section, topic, difficulty, limit = 50 } = req.query;
    const filter = {};
    if (section) filter.section = section;
    if (topic) filter.topic = topic;
    if (difficulty) filter.difficulty = difficulty;
    const questions = await Question.find(filter).sort({ section: 1, topic: 1 }).limit(parseInt(limit));
    res.json({ questions });
  } catch (error) {
    res.status(500).json({ error: "Серверийн алдаа" });
  }
});

// ─── АСУУЛТ ЗАСАХ ───
// PUT /api/questions/:id
router.put("/:id", auth, async (req, res) => {
  try {
    const question = await Question.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!question) return res.status(404).json({ error: "Асуулт олдсонгүй" });
    res.json({ message: "Асуулт шинэчлэгдлээ!", question });
  } catch (error) {
    res.status(500).json({ error: "Серверийн алдаа" });
  }
});

// ─── АСУУЛТ УСТГАХ ───
// DELETE /api/questions/:id
router.delete("/:id", auth, async (req, res) => {
  try {
    const question = await Question.findByIdAndDelete(req.params.id);
    if (!question) return res.status(404).json({ error: "Асуулт олдсонгүй" });
    res.json({ message: "Асуулт устгагдлаа!" });
  } catch (error) {
    res.status(500).json({ error: "Серверийн алдаа" });
  }
});

module.exports = router;
