const express = require("express");
const VideoLesson = require("../models/VideoLesson");
const { auth } = require("../middleware/auth");

const router = express.Router();

// ─── БҮХ ВИДЕО ХИЧЭЭЛҮҮД ───
// GET /api/videos
router.get("/", auth, async (req, res) => {
  try {
    const { section, topic, difficulty } = req.query;

    const filter = { published: true };
    if (section) filter.section = section;
    if (topic) filter.topic = topic;
    if (difficulty) filter.difficulty = difficulty;

    const videos = await VideoLesson.find(filter).sort({ section: 1, topic: 1, order: 1 });

    res.json({ videos });
  } catch (error) {
    res.status(500).json({ error: "Серверийн алдаа" });
  }
});

// ─── СЭДВЭЭР БҮЛЭГЛЭСЭН ВИДЕОНУУД ───
// GET /api/videos/grouped
router.get("/grouped", auth, async (req, res) => {
  try {
    const { section } = req.query;

    const filter = { published: true };
    if (section) filter.section = section;

    const videos = await VideoLesson.find(filter).sort({ order: 1 });

    // Сэдвээр бүлэглэх
    const grouped = {};
    videos.forEach((v) => {
      if (!grouped[v.topic]) {
        grouped[v.topic] = {
          topic: v.topic,
          section: v.section,
          videos: [],
        };
      }
      grouped[v.topic].videos.push(v);
    });

    res.json({ topics: Object.values(grouped) });
  } catch (error) {
    res.status(500).json({ error: "Серверийн алдаа" });
  }
});

// ─── БҮГД ВИДЕО (Admin - published эсэхийг харгалзахгүй) ───
// GET /api/videos/admin/all
router.get("/admin/all", auth, async (req, res) => {
  try {
    const { section } = req.query;
    const filter = {};
    if (section) filter.section = section;
    const videos = await VideoLesson.find(filter).sort({ section: 1, topic: 1, order: 1 });
    res.json({ videos });
  } catch (error) {
    res.status(500).json({ error: "Серверийн алдаа" });
  }
});

// ─── НЭГ ВИДЕО ───
// GET /api/videos/:id
router.get("/:id", auth, async (req, res) => {
  try {
    const video = await VideoLesson.findById(req.params.id);
    if (!video) {
      return res.status(404).json({ error: "Видео олдсонгүй" });
    }

    // Үзсэн тоо нэмэх
    video.viewCount += 1;
    await video.save();

    res.json({ video });
  } catch (error) {
    res.status(500).json({ error: "Серверийн алдаа" });
  }
});

// ─── ВИДЕО НЭМЭХ (Admin) ───
// POST /api/videos
router.post("/", auth, async (req, res) => {
  try {
    const { title, description, youtubeId, section, topic, topicName, order, duration, difficulty, isFree, published } = req.body;

    // YouTube thumbnail автоматаар авах
    const thumbnail = `https://img.youtube.com/vi/${youtubeId}/mqdefault.jpg`;

    const video = await VideoLesson.create({
      title,
      description,
      youtubeId,
      section,
      topic,
      topicName: topicName || topic,
      order,
      duration,
      difficulty,
      isFree,
      published: published !== false,
      thumbnail,
    });

    res.status(201).json({ message: "Видео нэмэгдлээ!", video });
  } catch (error) {
    console.error("Видео нэмэх алдаа:", error);
    res.status(500).json({ error: "Серверийн алдаа" });
  }
});

// ─── ВИДЕО ЗАСАХ ───
// PUT /api/videos/:id
router.put("/:id", auth, async (req, res) => {
  try {
    const video = await VideoLesson.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!video) return res.status(404).json({ error: "Видео олдсонгүй" });
    res.json({ message: "Видео шинэчлэгдлээ!", video });
  } catch (error) {
    res.status(500).json({ error: "Серверийн алдаа" });
  }
});

// ─── ВИДЕО УСТГАХ ───
// DELETE /api/videos/:id
router.delete("/:id", auth, async (req, res) => {
  try {
    const video = await VideoLesson.findByIdAndDelete(req.params.id);
    if (!video) return res.status(404).json({ error: "Видео олдсонгүй" });
    res.json({ message: "Видео устгагдлаа!" });
  } catch (error) {
    res.status(500).json({ error: "Серверийн алдаа" });
  }
});

module.exports = router;
