const mongoose = require("mongoose");
require("dotenv").config();

const Question = require("./models/Question");
const Flashcard = require("./models/Flashcard");
const News = require("./models/News");

const seedData = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("✅ MongoDB-тэй холбогдлоо");

    // Хуучин өгөгдлүүдийг устгах
    await Question.deleteMany({});
    await Flashcard.deleteMany({});
    await News.deleteMany({});
    console.log("🗑️  Хуучин өгөгдлүүд устгагдлаа");

    // ─── ЖИШЭЭ АСУУЛТУУД ───
    const questions = [
      // Math - Heart of Algebra
      {
        section: "math", topic: "heart-of-algebra", topicName: "Heart of Algebra",
        difficulty: "easy", emoji: "📐",
        questionText: "If 3x + 7 = 22, what is the value of x?",
        options: [
          { label: "A", text: "3" }, { label: "B", text: "5" },
          { label: "C", text: "7" }, { label: "D", text: "15" },
        ],
        correctAnswer: "B",
        explanation: "3x + 7 = 22 → 3x = 15 → x = 5",
        practiceTestId: 1,
      },
      {
        section: "math", topic: "heart-of-algebra", topicName: "Heart of Algebra",
        difficulty: "medium", emoji: "📐",
        questionText: "If 2(x - 3) + 4 = 3x - 1, what is x?",
        options: [
          { label: "A", text: "-1" }, { label: "B", text: "1" },
          { label: "C", text: "-3" }, { label: "D", text: "3" },
        ],
        correctAnswer: "A",
        explanation: "2x - 6 + 4 = 3x - 1 → 2x - 2 = 3x - 1 → -1 = x",
        practiceTestId: 1,
      },
      {
        section: "math", topic: "heart-of-algebra", topicName: "Heart of Algebra",
        difficulty: "hard", emoji: "📐",
        questionText: "A system of equations: y = 2x + 3 and y = -x + 9. At what point (x, y) do the lines intersect?",
        options: [
          { label: "A", text: "(2, 7)" }, { label: "B", text: "(3, 6)" },
          { label: "C", text: "(1, 5)" }, { label: "D", text: "(4, 5)" },
        ],
        correctAnswer: "A",
        explanation: "2x + 3 = -x + 9 → 3x = 6 → x = 2, y = 2(2) + 3 = 7",
        practiceTestId: 1,
      },
      // Math - Quadratics
      {
        section: "math", topic: "passport-advanced", topicName: "Passport to Advanced Math",
        difficulty: "medium", emoji: "📈",
        questionText: "What are the solutions to x² - 5x + 6 = 0?",
        options: [
          { label: "A", text: "x = 1, x = 6" }, { label: "B", text: "x = 2, x = 3" },
          { label: "C", text: "x = -2, x = -3" }, { label: "D", text: "x = -1, x = 6" },
        ],
        correctAnswer: "B",
        explanation: "x² - 5x + 6 = (x - 2)(x - 3) = 0 → x = 2 эсвэл x = 3",
        practiceTestId: 1,
      },
      // Reading & Writing
      {
        section: "reading-writing", topic: "vocabulary-context", topicName: "Vocabulary in Context",
        difficulty: "easy", emoji: "📝",
        questionText: "The scientist's findings were so ___ that they changed the entire field of study. Which word best completes the sentence?",
        options: [
          { label: "A", text: "mundane" }, { label: "B", text: "groundbreaking" },
          { label: "C", text: "trivial" }, { label: "D", text: "ambiguous" },
        ],
        correctAnswer: "B",
        explanation: "'Groundbreaking' утга нь шинэ нээлт, том өөрчлөлт гэсэн үг. Контекстээс харахад эерэг, том нөлөөтэй нээлт байсан.",
        practiceTestId: 1,
      },
      {
        section: "reading-writing", topic: "standard-english", topicName: "Standard English Conventions",
        difficulty: "medium", emoji: "✏️",
        questionText: "Choose the grammatically correct sentence:",
        options: [
          { label: "A", text: "Neither the students nor the teacher were prepared." },
          { label: "B", text: "Neither the students nor the teacher was prepared." },
          { label: "C", text: "Neither the students or the teacher were prepared." },
          { label: "D", text: "Neither the students or the teacher was prepared." },
        ],
        correctAnswer: "B",
        explanation: "'Neither...nor' хэрэглэхэд verb нь хамгийн ойр байгаа subject-тай тохирно. 'teacher' (дан тоо) → 'was'.",
        practiceTestId: 1,
      },
      // Practice Test 2-ийн асуултууд
      {
        section: "math", topic: "problem-solving-data", topicName: "Problem Solving & Data",
        difficulty: "easy", emoji: "📊",
        questionText: "A store offers a 20% discount on a $45 item. What is the sale price?",
        options: [
          { label: "A", text: "$25" }, { label: "B", text: "$36" },
          { label: "C", text: "$40" }, { label: "D", text: "$9" },
        ],
        correctAnswer: "B",
        explanation: "20% of $45 = $9. Sale price = $45 - $9 = $36",
        practiceTestId: 2,
      },
      {
        section: "math", topic: "additional-topics", topicName: "Additional Topics",
        difficulty: "medium", emoji: "📏",
        questionText: "In a right triangle, if one leg is 3 and the hypotenuse is 5, what is the other leg?",
        options: [
          { label: "A", text: "2" }, { label: "B", text: "4" },
          { label: "C", text: "6" }, { label: "D", text: "8" },
        ],
        correctAnswer: "B",
        explanation: "Pythagorean theorem: a² + b² = c² → 3² + b² = 5² → 9 + b² = 25 → b² = 16 → b = 4",
        practiceTestId: 2,
      },
      // Сэдэвчилсэн тестийн асуултууд (practiceTestId = null)
      {
        section: "math", topic: "heart-of-algebra", topicName: "Linear Equations",
        difficulty: "easy", emoji: "📐",
        questionText: "Solve for x: 5x - 10 = 20",
        options: [
          { label: "A", text: "2" }, { label: "B", text: "4" },
          { label: "C", text: "6" }, { label: "D", text: "10" },
        ],
        correctAnswer: "C",
        explanation: "5x - 10 = 20 → 5x = 30 → x = 6",
        practiceTestId: null,
      },
      {
        section: "reading-writing", topic: "reading-comprehension", topicName: "Main Idea & Purpose",
        difficulty: "easy", emoji: "📖",
        questionText: "What is the primary purpose of a thesis statement in an essay?",
        options: [
          { label: "A", text: "To provide background information" },
          { label: "B", text: "To state the main argument or claim" },
          { label: "C", text: "To summarize the conclusion" },
          { label: "D", text: "To list supporting evidence" },
        ],
        correctAnswer: "B",
        explanation: "Thesis statement нь эссэний гол санаа, аргумент буюу claim-ийг илэрхийлнэ.",
        practiceTestId: null,
      },
    ];

    await Question.insertMany(questions);
    console.log(`✅ ${questions.length} асуулт нэмэгдлээ`);

    // ─── FLASHCARD-УУД ───
    const flashcards = [
      // English - Common SAT Words
      { deckId: "fe1", deckName: "Common SAT Words", section: "english", difficulty: "easy", emoji: "📚",
        front: "Ephemeral", back: "Lasting for a very short time", example: "The ephemeral beauty of cherry blossoms draws millions of visitors each spring.", pronunciation: "/ɪˈfɛm(ə)r(ə)l/" },
      { deckId: "fe1", deckName: "Common SAT Words", section: "english", difficulty: "easy", emoji: "📚",
        front: "Ubiquitous", back: "Present, appearing, or found everywhere", example: "Smartphones have become ubiquitous in modern society.", pronunciation: "/juːˈbɪkwɪtəs/" },
      { deckId: "fe1", deckName: "Common SAT Words", section: "english", difficulty: "easy", emoji: "📚",
        front: "Pragmatic", back: "Dealing with things sensibly and realistically", example: "She took a pragmatic approach to solving the budget crisis.", pronunciation: "/præɡˈmætɪk/" },
      { deckId: "fe1", deckName: "Common SAT Words", section: "english", difficulty: "easy", emoji: "📚",
        front: "Ambivalent", back: "Having mixed feelings or contradictory ideas", example: "He felt ambivalent about leaving his hometown for the new job.", pronunciation: "/æmˈbɪvələnt/" },
      { deckId: "fe1", deckName: "Common SAT Words", section: "english", difficulty: "easy", emoji: "📚",
        front: "Benevolent", back: "Well meaning and kindly", example: "The benevolent donor funded scholarships for underprivileged students.", pronunciation: "/bəˈnɛvələnt/" },

      // English - Academic Vocabulary
      { deckId: "fe2", deckName: "Academic Vocabulary", section: "english", difficulty: "medium", emoji: "🎓",
        front: "Empirical", back: "Based on observation or experience rather than theory", example: "The study provided empirical evidence supporting the hypothesis.", pronunciation: "/ɪmˈpɪrɪkəl/" },
      { deckId: "fe2", deckName: "Academic Vocabulary", section: "english", difficulty: "medium", emoji: "🎓",
        front: "Extrapolate", back: "Extend the application of a conclusion beyond the known", example: "We can extrapolate future trends from this data.", pronunciation: "/ɪkˈstræpəleɪt/" },
      { deckId: "fe2", deckName: "Academic Vocabulary", section: "english", difficulty: "medium", emoji: "🎓",
        front: "Synthesize", back: "Combine elements into a coherent whole", example: "The researcher synthesized findings from multiple studies.", pronunciation: "/ˈsɪnθəsaɪz/" },

      // Math - Algebra Essentials
      { deckId: "fm1", deckName: "Algebra Essentials", section: "math", difficulty: "easy", emoji: "➕",
        front: "Slope-Intercept Form", back: "y = mx + b, where m is slope and b is y-intercept", example: "y = 2x + 3 has a slope of 2 and crosses the y-axis at 3" },
      { deckId: "fm1", deckName: "Algebra Essentials", section: "math", difficulty: "easy", emoji: "➕",
        front: "Quadratic Formula", back: "x = (-b ± √(b²-4ac)) / 2a", example: "For x² + 5x + 6 = 0: a=1, b=5, c=6" },
      { deckId: "fm1", deckName: "Algebra Essentials", section: "math", difficulty: "easy", emoji: "➕",
        front: "FOIL Method", back: "First, Outer, Inner, Last — for multiplying binomials", example: "(x+2)(x+3) = x² + 3x + 2x + 6 = x² + 5x + 6" },
    ];

    await Flashcard.insertMany(flashcards);
    console.log(`✅ ${flashcards.length} flashcard нэмэгдлээ`);

    // ─── МЭДЭЭНҮҮД ───
    const news = [
      {
        category: "tips", categoryLabel: "Зөвлөгөө", emoji: "💡",
        title: "SAT шалгалтын өдөр анхаарах 10 чухал зүйл",
        summary: "Шалгалтын өдрийн бэлтгэл, авч явах зүйлс, цаг хуваарилалт зэрэг бүх зөвлөгөөг нэгтгэв.",
        readTime: "5 мин", pinned: true,
        content: [
          { type: "heading", text: "1. Шалгалтын өмнөх орой" },
          { type: "text", text: "Шалгалтын өмнөх орой эрт унтаж, хангалттай нойр авах нь маш чухал. Хамгийн багадаа 8 цаг унтах хэрэгтэй." },
          { type: "heading", text: "2. Авч явах зүйлс" },
          { type: "text", text: "Бүртгэлийн хуудас, зургийн үнэмлэх, No.2 харандаа, баллуур, тооны машин, ус болон хөнгөн зууш авч яваарай." },
          { type: "heading", text: "3. Цаг хуваарилалт" },
          { type: "text", text: "Reading & Writing 64 минут, Math 70 минут. Нэг асуулт дээр хэт удаан зогсохгүй байх нь чухал." },
        ],
      },
      {
        category: "news", categoryLabel: "Мэдээ", emoji: "📰",
        title: "2026 оны SAT шалгалтын хуваарь гарлаа",
        summary: "College Board 2026 оны SAT шалгалтын хуваарийг зарлалаа.",
        readTime: "3 мин", pinned: true,
        content: [
          { type: "heading", text: "2026 оны шалгалтын огноонууд" },
          { type: "text", text: "5-р сарын 2, 6-р сарын 6, 8-р сарын 22, 10-р сарын 3, 11-р сарын 7, 12-р сарын 5." },
          { type: "heading", text: "Бүртгэлийн хугацаа" },
          { type: "text", text: "Шалгалтаас 5 долоо хоногийн өмнө бүртгүүлэх ёстой." },
        ],
      },
      {
        category: "strategy", categoryLabel: "Стратеги", emoji: "🎯",
        title: "SAT Math-д 800 оноо авах стратеги",
        summary: "Математикийн хэсэгт дээд оноо авах стратеги.",
        readTime: "7 мин", pinned: false,
        content: [
          { type: "heading", text: "Алдаагүй ажиллах нь түлхүүр" },
          { type: "text", text: "800 оноо авахын тулд бараг бүх асуултад зөв хариулах шаардлагатай." },
          { type: "heading", text: "Хоёр удаа шалгах систем" },
          { type: "text", text: "Эхлээд бүх асуултыг бодоод, дараа нь буцаж шалгах нь маш үр дүнтэй." },
        ],
      },
    ];

    await News.insertMany(news);
    console.log(`✅ ${news.length} мэдээ нэмэгдлээ`);

    console.log("\n🎉 Бүх анхны өгөгдлүүд амжилттай нэмэгдлээ!");
    process.exit(0);
  } catch (error) {
    console.error("❌ Seed алдаа:", error);
    process.exit(1);
  }
};

seedData();
