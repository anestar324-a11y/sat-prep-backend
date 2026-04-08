const express = require("express");
const TestResult = require("../models/TestResult");
const Progress = require("../models/Progress");
const { auth } = require("../middleware/auth");

const router = express.Router();

// ─── ТЕСТИЙН ҮР ДҮН ХАДГАЛАХ ───
// POST /api/tests/submit
router.post("/submit", auth, async (req, res) => {
  try {
    const {
      testType,
      practiceTestNumber,
      topicId,
      answers,
      totalTime,
    } = req.body;

    // Зөв хариултын тоо
    const correctCount = answers.filter((a) => a.isCorrect).length;
    const totalQuestions = answers.length;
    const score = Math.round((correctCount / totalQuestions) * 100);

    // SAT оноо тооцоолох (practice test-д)
    let satScore = null;
    let mathScore = null;
    let rwScore = null;

    if (testType === "practice") {
      // Хялбаршуулсан SAT оноо тооцоолол
      // Бодит SAT-д adaptive scoring ашигладаг, энэ нь ойролцоо тооцоо
      const percentage = correctCount / totalQuestions;
      satScore = Math.round(400 + percentage * 1200); // 400-1600
      mathScore = Math.round(200 + percentage * 600); // 200-800
      rwScore = Math.round(200 + percentage * 600); // 200-800
    }

    const testResult = await TestResult.create({
      user: req.userId,
      testType,
      practiceTestNumber,
      topicId,
      answers,
      score,
      totalQuestions,
      correctCount,
      satScore,
      mathScore,
      rwScore,
      totalTime,
      completedAt: new Date(),
    });

    // Progress шинэчлэх
    const progress = await Progress.findOne({ user: req.userId });
    if (progress) {
      progress.totalTestsCompleted += 1;

      // Өнөөдрийн study day шинэчлэх
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const todayEntry = progress.studyDays.find(
        (d) => new Date(d.date).toDateString() === today.toDateString()
      );

      if (todayEntry) {
        todayEntry.testsCompleted += 1;
        todayEntry.minutesStudied += Math.round(totalTime / 60);
      } else {
        progress.studyDays.push({
          date: today,
          minutesStudied: Math.round(totalTime / 60),
          testsCompleted: 1,
        });
      }

      progress.totalStudyMinutes += Math.round(totalTime / 60);
      await progress.save();
    }

    res.status(201).json({
      message: "Тестийн үр дүн хадгалагдлаа!",
      result: {
        id: testResult._id,
        score,
        correctCount,
        totalQuestions,
        satScore,
        mathScore,
        rwScore,
        totalTime,
      },
    });
  } catch (error) {
    console.error("Тест хадгалах алдаа:", error);
    res.status(500).json({ error: "Серверийн алдаа" });
  }
});

// ─── МИНИЙ ТЕСТИЙН ТҮҮХ ───
// GET /api/tests/history
router.get("/history", auth, async (req, res) => {
  try {
    const { testType, limit = 20 } = req.query;

    const filter = { user: req.userId };
    if (testType) filter.testType = testType;

    const results = await TestResult.find(filter)
      .sort({ createdAt: -1 })
      .limit(parseInt(limit))
      .select("-answers"); // Хариултын дэлгэрэнгүйг оруулахгүй

    res.json({ results });
  } catch (error) {
    res.status(500).json({ error: "Серверийн алдаа" });
  }
});

// ─── НЭГ ТЕСТИЙН ДЭЛГЭРЭНГҮЙ ───
// GET /api/tests/:id
router.get("/:id", auth, async (req, res) => {
  try {
    const result = await TestResult.findOne({
      _id: req.params.id,
      user: req.userId,
    }).populate("answers.question");

    if (!result) {
      return res.status(404).json({ error: "Тестийн үр дүн олдсонгүй" });
    }

    res.json({ result });
  } catch (error) {
    res.status(500).json({ error: "Серверийн алдаа" });
  }
});

// ─── ШИЛДЭГ ОНОО (сэдэв тус бүрээр) ───
// GET /api/tests/best-scores
router.get("/best/scores", auth, async (req, res) => {
  try {
    const bestScores = await TestResult.aggregate([
      { $match: { user: req.userId } },
      {
        $group: {
          _id: {
            testType: "$testType",
            topicId: "$topicId",
            practiceTestNumber: "$practiceTestNumber",
          },
          bestScore: { $max: "$score" },
          bestSatScore: { $max: "$satScore" },
          attempts: { $sum: 1 },
          lastAttempt: { $max: "$createdAt" },
        },
      },
    ]);

    res.json({ bestScores });
  } catch (error) {
    res.status(500).json({ error: "Серверийн алдаа" });
  }
});

module.exports = router;
