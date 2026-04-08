const mongoose = require("mongoose");

const progressSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    // Хичээлийн явц
    lessons: [
      {
        topicId: Number, // 1-8 (mathTopics + rwTopics)
        section: { type: String, enum: ["math", "reading-writing"] },
        topicName: String,
        progress: { type: Number, default: 0, min: 0, max: 100 },
        completedLessons: { type: Number, default: 0 },
        totalLessons: Number,
        lastAccessedAt: { type: Date, default: Date.now },
      },
    ],

    // Flashcard явц
    flashcards: [
      {
        deckId: String, // "fm1", "fe2" гэх мэт
        section: { type: String, enum: ["math", "english"] },
        deckName: String,
        totalCards: Number,
        masteredCards: { type: Number, default: 0 },
        lastPracticedAt: { type: Date, default: Date.now },
      },
    ],

    // Өдрийн суралцсан бүртгэл (streak тооцоолоход ашиглана)
    studyDays: [
      {
        date: { type: Date },
        minutesStudied: { type: Number, default: 0 },
        lessonsCompleted: { type: Number, default: 0 },
        testsCompleted: { type: Number, default: 0 },
        flashcardsReviewed: { type: Number, default: 0 },
      },
    ],

    // Нийт статистик
    totalStudyMinutes: { type: Number, default: 0 },
    totalLessonsCompleted: { type: Number, default: 0 },
    totalTestsCompleted: { type: Number, default: 0 },
    totalFlashcardsMastered: { type: Number, default: 0 },
  },
  {
    timestamps: true,
  }
);

progressSchema.index({ user: 1 }, { unique: true });

module.exports = mongoose.model("Progress", progressSchema);
