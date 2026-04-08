const mongoose = require("mongoose");

const flashcardSchema = new mongoose.Schema({
  deckId: {
    type: String,
    required: true, // "fm1", "fe2" гэх мэт
  },
  deckName: {
    type: String,
    required: true,
  },
  section: {
    type: String,
    enum: ["math", "english"],
    required: true,
  },
  difficulty: {
    type: String,
    enum: ["easy", "medium", "hard"],
    required: true,
  },
  emoji: {
    type: String,
    default: "📝",
  },

  // Картын агуулга
  front: {
    type: String,
    required: true, // Үг эсвэл асуулт
  },
  back: {
    type: String,
    required: true, // Тайлбар
  },
  example: {
    type: String,
    default: null, // Жишээ өгүүлбэр
  },
  pronunciation: {
    type: String,
    default: null, // Дуудлага /ɪˈfɛm(ə)r(ə)l/
  },
});

flashcardSchema.index({ deckId: 1 });
flashcardSchema.index({ section: 1, difficulty: 1 });

module.exports = mongoose.model("Flashcard", flashcardSchema);
