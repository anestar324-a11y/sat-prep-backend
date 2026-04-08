const mongoose = require("mongoose");

const questionSchema = new mongoose.Schema({
  // Асуултын үндсэн мэдээлэл
  section: {
    type: String,
    enum: ["math", "reading-writing"],
    required: true,
  },
  topic: {
    type: String,
    required: true,
    // Math: "heart-of-algebra", "problem-solving-data", "passport-advanced", "additional-topics"
    // RW: "reading-comprehension", "vocabulary-context", "standard-english", "expression-ideas"
  },
  topicName: {
    type: String,
    required: true,
  },
  difficulty: {
    type: String,
    enum: ["easy", "medium", "hard"],
    required: true,
  },

  // Асуултын агуулга
  questionText: {
    type: String,
    required: true,
  },
  // Хэрэв passage/зураг хэрэгтэй бол
  passage: {
    type: String,
    default: null,
  },
  imageUrl: {
    type: String,
    default: null,
  },

  // Хариултын сонголтууд
  options: [
    {
      label: { type: String, required: true }, // "A", "B", "C", "D"
      text: { type: String, required: true },
    },
  ],
  correctAnswer: {
    type: String,
    required: true, // "A", "B", "C", "D"
  },

  // Тайлбар
  explanation: {
    type: String,
    required: true,
  },

  // Practice test-д хамаарах эсэх
  practiceTestId: {
    type: Number,
    default: null, // null бол сэдэвчилсэн тестийн асуулт
  },

  // Emoji (сэдэвчилсэн тестийн icon)
  emoji: {
    type: String,
    default: "📝",
  },
});

// Index-үүд (хайлтыг хурдасгах)
questionSchema.index({ section: 1, topic: 1 });
questionSchema.index({ difficulty: 1 });
questionSchema.index({ practiceTestId: 1 });

module.exports = mongoose.model("Question", questionSchema);
