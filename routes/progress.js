const express = require("express");
const Progress = require("../models/Progress");
const User = require("../models/User");
const { auth } = require("../middleware/auth");

const router = express.Router();

// ─── МИНИЙ PROGRESS АВАХ ───
// GET /api/progress
router.get("/", auth, async (req, res) => {
  try {
    let progress = await Progress.findOne({ user: req.userId });

    if (!progress) {
      progress = await Progress.create({
        user: req.userId,
        lessons: [],
        flashcards: [],
        studyDays: [],
      });
    }

    res.json({ progress });
  } catch (error) {
    res.status(500).json({ error: "Серверийн алдаа" });
  }
});

// ─── ХИЧЭЭЛИЙН ЯВЦ ШИНЭЧЛЭХ ───
// PUT /api/progress/lesson
router.put("/lesson", auth, async (req, res) => {
  try {
    const { topicId, section, topicName, progress: lessonProgress, totalLessons } = req.body;

    const userProgress = await Progress.findOne({ user: req.userId });

    const existingLesson = userProgress.lessons.find((l) => l.topicId === topicId);

    if (existingLesson) {
      existingLesson.progress = lessonProgress;
      existingLesson.completedLessons = Math.round((lessonProgress / 100) * totalLessons);
      existingLesson.lastAccessedAt = new Date();
    } else {
      userProgress.lessons.push({
        topicId,
        section,
        topicName,
        progress: lessonProgress,
        completedLessons: Math.round((lessonProgress / 100) * totalLessons),
        totalLessons,
      });
    }

    // Өнөөдрийн study day
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const todayEntry = userProgress.studyDays.find(
      (d) => new Date(d.date).toDateString() === today.toDateString()
    );

    if (todayEntry) {
      todayEntry.lessonsCompleted += 1;
      todayEntry.minutesStudied += 5; // Дундаж 5 минут/хичээл
    } else {
      userProgress.studyDays.push({
        date: today,
        minutesStudied: 5,
        lessonsCompleted: 1,
      });
    }

    userProgress.totalStudyMinutes += 5;
    userProgress.totalLessonsCompleted += 1;
    await userProgress.save();

    // User streak шинэчлэх
    const user = await User.findById(req.userId);
    const lastStudy = user.lastStudyDate ? new Date(user.lastStudyDate) : null;
    if (lastStudy) {
      lastStudy.setHours(0, 0, 0, 0);
      const diffDays = Math.floor((today - lastStudy) / (1000 * 60 * 60 * 24));
      if (diffDays === 1) user.streak += 1;
      else if (diffDays > 1) user.streak = 1;
    } else {
      user.streak = 1;
    }
    user.lastStudyDate = today;
    await user.save();

    res.json({ message: "Хичээлийн явц шинэчлэгдлээ!", progress: userProgress });
  } catch (error) {
    console.error("Progress алдаа:", error);
    res.status(500).json({ error: "Серверийн алдаа" });
  }
});

// ─── FLASHCARD ЯВЦ ШИНЭЧЛЭХ ───
// PUT /api/progress/flashcard
router.put("/flashcard", auth, async (req, res) => {
  try {
    const { deckId, section, deckName, totalCards, masteredCards } = req.body;

    const userProgress = await Progress.findOne({ user: req.userId });

    const existingDeck = userProgress.flashcards.find((f) => f.deckId === deckId);

    if (existingDeck) {
      existingDeck.masteredCards = masteredCards;
      existingDeck.lastPracticedAt = new Date();
    } else {
      userProgress.flashcards.push({
        deckId,
        section,
        deckName,
        totalCards,
        masteredCards,
      });
    }

    userProgress.totalFlashcardsMastered = userProgress.flashcards.reduce(
      (sum, f) => sum + f.masteredCards,
      0
    );

    await userProgress.save();

    res.json({ message: "Flashcard явц шинэчлэгдлээ!", progress: userProgress });
  } catch (error) {
    res.status(500).json({ error: "Серверийн алдаа" });
  }
});

// ─── DASHBOARD СТАТИСТИК ───
// GET /api/progress/stats
router.get("/stats", auth, async (req, res) => {
  try {
    const progress = await Progress.findOne({ user: req.userId });
    const user = await User.findById(req.userId);

    if (!progress) {
      return res.json({
        streak: 0,
        totalStudyMinutes: 0,
        totalLessonsCompleted: 0,
        totalTestsCompleted: 0,
        totalFlashcardsMastered: 0,
        lessonsProgress: [],
      });
    }

    // Сүүлийн 7 хоногийн суралцсан байдал
    const lastWeek = new Date();
    lastWeek.setDate(lastWeek.getDate() - 7);
    const weeklyStudy = progress.studyDays.filter(
      (d) => new Date(d.date) >= lastWeek
    );

    res.json({
      streak: user.streak,
      totalStudyMinutes: progress.totalStudyMinutes,
      totalStudyHours: Math.round(progress.totalStudyMinutes / 60),
      totalLessonsCompleted: progress.totalLessonsCompleted,
      totalTestsCompleted: progress.totalTestsCompleted,
      totalFlashcardsMastered: progress.totalFlashcardsMastered,
      lessonsProgress: progress.lessons,
      flashcardsProgress: progress.flashcards,
      weeklyStudy,
    });
  } catch (error) {
    res.status(500).json({ error: "Серверийн алдаа" });
  }
});

module.exports = router;
