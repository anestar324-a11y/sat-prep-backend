const mongoose = require("mongoose");

const videoLessonSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Хичээлийн нэр оруулна уу"],
    },
    description: {
      type: String,
      default: "",
    },
    // YouTube video ID (жнь: "dQw4w9WgXcQ")
    youtubeId: {
      type: String,
      required: [true, "YouTube video ID оруулна уу"],
    },
    // Хичээлийн ангилал
    section: {
      type: String,
      enum: ["math", "reading-writing", "general"],
      required: true,
    },
    topic: {
      type: String,
      required: true,
    },
    topicName: {
      type: String,
      default: "",
    },
    // Хичээлийн дугаар (эрэмбэлэхэд)
    order: {
      type: Number,
      default: 0,
    },
    // Хичээлийн урт (минутаар)
    duration: {
      type: Number,
      default: 0,
    },
    // Хичээлийн түвшин
    difficulty: {
      type: String,
      enum: ["beginner", "intermediate", "advanced"],
      default: "beginner",
    },
    // Үнэгүй эсэх
    isFree: {
      type: Boolean,
      default: true,
    },
    // Нийтлэгдсэн эсэх
    published: {
      type: Boolean,
      default: true,
    },
    // Үзсэн тоо
    viewCount: {
      type: Number,
      default: 0,
    },
    // Thumbnail (YouTube-аас автомат авна)
    thumbnail: {
      type: String,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

videoLessonSchema.index({ section: 1, topic: 1, order: 1 });

module.exports = mongoose.model("VideoLesson", videoLessonSchema);
