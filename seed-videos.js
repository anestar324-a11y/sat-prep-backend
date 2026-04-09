// ─── ВИДЕО ХИЧЭЭЛИЙН ЖИШЭЭ ӨГӨГДӨЛ ───
// Terminal дээр: node seed-videos.js

const mongoose = require("mongoose");
require("dotenv").config();
const VideoLesson = require("./models/VideoLesson");

const seedVideos = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("✅ MongoDB-тэй холбогдлоо");

    await VideoLesson.deleteMany({});
    console.log("🗑️  Хуучин видеонууд устгагдлаа");

    // ─── ЖИШЭЭ ВИДЕОНУУД ───
    // youtubeId-г өөрийн YouTube видеоны ID-гаар солино
    // YouTube URL: https://www.youtube.com/watch?v=VIDEO_ID
    // VIDEO_ID гэсэн хэсэг нь youtubeId юм

    const videos = [
      // Math - Heart of Algebra
      {
        title: "Linear Equations - Шугаман тэгшитгэл",
        description: "Шугаман тэгшитгэлийн үндсэн ойлголт, бодох арга барил",
        youtubeId: "MHhKSHSAJWE",
        section: "math",
        topic: "Heart of Algebra",
        order: 1,
        duration: 15,
        difficulty: "beginner",
        isFree: true,
      },
      {
        title: "Systems of Equations - Тэгшитгэлийн систем",
        description: "Хоёр үл мэдэгдэгчтэй тэгшитгэлийн системийг бодох",
        youtubeId: "nok99JOhcjo",
        section: "math",
        topic: "Heart of Algebra",
        order: 2,
        duration: 20,
        difficulty: "intermediate",
        isFree: true,
      },
      {
        title: "Inequalities - Тэнцэтгэл бус",
        description: "Тэнцэтгэл бусыг бодох, график дээр дүрслэх",
        youtubeId: "xOxvyeSl0uA",
        section: "math",
        topic: "Heart of Algebra",
        order: 3,
        duration: 18,
        difficulty: "intermediate",
        isFree: true,
      },

      // Math - Problem Solving & Data
      {
        title: "Ratios & Proportions - Харьцаа ба пропорц",
        description: "Харьцаа, пропорцын бодлогууд",
        youtubeId: "RQ2nYUBVvqI",
        section: "math",
        topic: "Problem Solving & Data",
        order: 1,
        duration: 12,
        difficulty: "beginner",
        isFree: true,
      },
      {
        title: "Percentages - Хувь тооцоо",
        description: "Хувийн бодлого, өсөлт/бууралт тооцоолох",
        youtubeId: "JeVSmq1Nrpw",
        section: "math",
        topic: "Problem Solving & Data",
        order: 2,
        duration: 14,
        difficulty: "beginner",
        isFree: true,
      },

      // Math - Advanced
      {
        title: "Quadratic Equations - Квадрат тэгшитгэл",
        description: "Квадрат тэгшитгэлийг бодох бүх аргууд",
        youtubeId: "IlNAJl36-10",
        section: "math",
        topic: "Passport to Advanced Math",
        order: 1,
        duration: 22,
        difficulty: "intermediate",
        isFree: true,
      },

      // Reading & Writing
      {
        title: "Main Idea - Гол санааг олох",
        description: "Passage-ийн гол санааг хэрхэн олох вэ",
        youtubeId: "dCHRbfPjNYE",
        section: "reading-writing",
        topic: "Reading Comprehension",
        order: 1,
        duration: 16,
        difficulty: "beginner",
        isFree: true,
      },
      {
        title: "Vocabulary in Context - Контекст дэх үгийн утга",
        description: "Эргэн тойрны өгүүлбэрээс үгийн утгыг тааварлах",
        youtubeId: "lOBw1BN3IFQ",
        section: "reading-writing",
        topic: "Vocabulary in Context",
        order: 1,
        duration: 14,
        difficulty: "beginner",
        isFree: true,
      },
      {
        title: "Grammar Rules - Дүрмийн дүрэм",
        description: "SAT-д хамгийн их гардаг дүрмийн дүрэмүүд",
        youtubeId: "sRGEfoBL11s",
        section: "reading-writing",
        topic: "Standard English Conventions",
        order: 1,
        duration: 20,
        difficulty: "intermediate",
        isFree: true,
      },

      // General
      {
        title: "SAT Шалгалтын бүтэц - Бүрэн тайлбар",
        description: "SAT шалгалт хэрхэн бүтэцлэгдсэн, цаг хуваарилалт, зөвлөгөө",
        youtubeId: "RKZiHj5YiQA",
        section: "general",
        topic: "Ерөнхий мэдээлэл",
        order: 1,
        duration: 25,
        difficulty: "beginner",
        isFree: true,
      },
    ];

    await VideoLesson.insertMany(videos);
    console.log(`✅ ${videos.length} видео хичээл нэмэгдлээ`);
    console.log("\n🎉 Видео хичээлүүд амжилттай нэмэгдлээ!");
    console.log("\n💡 YouTube ID-г өөрийн видеоны ID-гаар солихдоо:");
    console.log("   YouTube URL: https://www.youtube.com/watch?v=VIDEO_ID");
    console.log("   VIDEO_ID хэсгийг youtubeId талбарт тавина\n");

    process.exit(0);
  } catch (error) {
    console.error("❌ Алдаа:", error);
    process.exit(1);
  }
};

seedVideos();
