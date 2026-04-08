const mongoose = require("mongoose");

const testResultSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    // Тестийн төрөл
    testType: {
      type: String,
      enum: ["practice", "topic"],
      required: true,
    },

    // Practice test бол тестийн дугаар (1-6)
    practiceTestNumber: {
      type: Number,
      default: null,
    },

    // Topic test бол сэдэв
    topicId: {
      type: String,
      default: null, // "m1", "e3" гэх мэт
    },

    // Хариултууд
    answers: [
      {
        question: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Question",
        },
        selectedAnswer: String, // "A", "B", "C", "D"
        isCorrect: Boolean,
        timeSpent: Number, // секундээр
      },
    ],

    // Оноо
    score: {
      type: Number,
      required: true,
    },
    totalQuestions: {
      type: Number,
      required: true,
    },
    correctCount: {
      type: Number,
      required: true,
    },

    // SAT оноо (practice test-д)
    satScore: {
      type: Number,
      default: null, // 400-1600
    },
    mathScore: {
      type: Number,
      default: null, // 200-800
    },
    rwScore: {
      type: Number,
      default: null, // 200-800
    },

    // Хугацаа
    totalTime: {
      type: Number, // секундээр
      default: 0,
    },
    startedAt: {
      type: Date,
      default: Date.now,
    },
    completedAt: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

testResultSchema.index({ user: 1, testType: 1 });
testResultSchema.index({ user: 1, createdAt: -1 });

module.exports = mongoose.model("TestResult", testResultSchema);
