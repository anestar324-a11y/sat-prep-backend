const mongoose = require("mongoose");

const newsSchema = new mongoose.Schema(
  {
    category: {
      type: String,
      required: true,
    },
    categoryLabel: {
      type: String,
      required: true,
    },
    emoji: {
      type: String,
      default: "📰",
    },
    title: {
      type: String,
      required: true,
    },
    summary: {
      type: String,
      required: true,
    },
    readTime: {
      type: String,
      default: "3 мин",
    },
    pinned: {
      type: Boolean,
      default: false,
    },
    published: {
      type: Boolean,
      default: false,
    },
    content: [
      {
        type: { type: String, enum: ["heading", "text"], required: true },
        text: { type: String, required: true },
      },
    ],
  },
  {
    timestamps: true,
  }
);

newsSchema.index({ category: 1 });
newsSchema.index({ pinned: 1 });

module.exports = mongoose.model("News", newsSchema);
