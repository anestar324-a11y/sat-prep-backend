const express = require("express");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const Progress = require("../models/Progress");
const { auth } = require("../middleware/auth");

const router = express.Router();

// Token үүсгэх helper
const createToken = (userId) => {
  return jwt.sign({ userId }, process.env.JWT_SECRET, { expiresIn: "30d" });
};

// ─── БҮРТГҮҮЛЭХ ───
// POST /api/auth/register
router.post("/register", async (req, res) => {
  try {
    const { name, email, phone, password } = req.body;

    // Имэйл давхцаж байгаа эсэхийг шалгах
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: "Энэ имэйл аль хэдийн бүртгэлтэй байна" });
    }

    // Хэрэглэгч үүсгэх
    const user = await User.create({
      name,
      email,
      phone,
      password,
    });

    // Хоосон progress үүсгэх
    await Progress.create({
      user: user._id,
      lessons: [],
      flashcards: [],
      studyDays: [],
    });

    // Token үүсгэх
    const token = createToken(user._id);

    res.status(201).json({
      message: "Амжилттай бүртгэгдлээ!",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        plan: user.plan,
      },
    });
  } catch (error) {
    console.error("Бүртгэлийн алдаа:", error);
    if (error.name === "ValidationError") {
      const messages = Object.values(error.errors).map((e) => e.message);
      return res.status(400).json({ error: messages.join(", ") });
    }
    res.status(500).json({ error: "Серверийн алдаа" });
  }
});

// ─── НЭВТРЭХ ───
// POST /api/auth/login
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    // Хэрэглэгч олох (password-г select хийх)
    const user = await User.findOne({ email }).select("+password");
    if (!user) {
      return res.status(401).json({ error: "Имэйл эсвэл нууц үг буруу байна" });
    }

    // Нууц үг шалгах
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ error: "Имэйл эсвэл нууц үг буруу байна" });
    }

    // Streak шинэчлэх
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const lastStudy = user.lastStudyDate ? new Date(user.lastStudyDate) : null;

    if (lastStudy) {
      lastStudy.setHours(0, 0, 0, 0);
      const diffDays = Math.floor((today - lastStudy) / (1000 * 60 * 60 * 24));
      if (diffDays > 1) {
        user.streak = 1; // Streak тасарсан
      } else if (diffDays === 1) {
        user.streak += 1; // Streak үргэлжилж байна
      }
    } else {
      user.streak = 1;
    }

    user.lastStudyDate = today;
    await user.save();

    const token = createToken(user._id);

    res.json({
      message: "Амжилттай нэвтэрлээ!",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        plan: user.plan,
        streak: user.streak,
        role: user.role,
        targetScore: user.targetScore,
        targetDate: user.targetDate,
      },
    });
  } catch (error) {
    console.error("Нэвтрэлтийн алдаа:", error);
    res.status(500).json({ error: "Серверийн алдаа" });
  }
});

// ─── ПРОФАЙЛ АВАХ ───
// GET /api/auth/me
router.get("/me", auth, async (req, res) => {
  try {
    const user = await User.findById(req.userId);
    res.json({
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        plan: user.plan,
        planExpiry: user.planExpiry,
        streak: user.streak,
        role: user.role,
        targetScore: user.targetScore,
        targetDate: user.targetDate,
        createdAt: user.createdAt,
      },
    });
  } catch (error) {
    res.status(500).json({ error: "Серверийн алдаа" });
  }
});

// ─── ПРОФАЙЛ ШИНЭЧЛЭХ ───
// PUT /api/auth/me
router.put("/me", auth, async (req, res) => {
  try {
    const { name, phone, targetScore, targetDate } = req.body;

    const user = await User.findByIdAndUpdate(
      req.userId,
      { name, phone, targetScore, targetDate },
      { new: true, runValidators: true }
    );

    res.json({
      message: "Профайл шинэчлэгдлээ!",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        plan: user.plan,
        targetScore: user.targetScore,
        targetDate: user.targetDate,
      },
    });
  } catch (error) {
    res.status(500).json({ error: "Серверийн алдаа" });
  }
});

// ─── НУУЦ ҮГ СОЛИХ ───
// PUT /api/auth/password
router.put("/password", auth, async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;

    const user = await User.findById(req.userId).select("+password");

    const isMatch = await user.comparePassword(currentPassword);
    if (!isMatch) {
      return res.status(400).json({ error: "Одоогийн нууц үг буруу байна" });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({ error: "Нууц үг хамгийн багадаа 6 тэмдэгт байх ёстой" });
    }

    user.password = newPassword;
    await user.save();

    res.json({ message: "Нууц үг амжилттай солигдлоо!" });
  } catch (error) {
    res.status(500).json({ error: "Серверийн алдаа" });
  }
});

// ─── НУУЦ ҮГ МАРТСАН - КОД ИЛГЭЭХ ───
// POST /api/auth/forgot-password
router.post("/forgot-password", async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) return res.status(400).json({ error: "Имэйл оруулна уу" });

    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ error: "Энэ имэйлтэй хэрэглэгч олдсонгүй" });

    // 6 оронтой санамсаргүй код үүсгэх
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    const expiry = new Date(Date.now() + 15 * 60 * 1000); // 15 минут

    user.resetPasswordCode = code;
    user.resetPasswordExpiry = expiry;
    await user.save();

    // Имэйл илгээх (EMAIL_USER болон EMAIL_PASS тохируулагдсан үед)
    if (process.env.EMAIL_USER && process.env.EMAIL_PASS) {
      try {
        const nodemailer = require("nodemailer");
        const transporter = nodemailer.createTransport({
          service: "gmail",
          auth: { user: process.env.EMAIL_USER, pass: process.env.EMAIL_PASS },
        });
        await transporter.sendMail({
          from: `"SATPrep" <${process.env.EMAIL_USER}>`,
          to: email,
          subject: "SATPrep - Нууц үг сэргээх код",
          html: `
            <div style="font-family:sans-serif;max-width:480px;margin:auto;padding:32px;border-radius:12px;border:1px solid #e5e7eb">
              <h2 style="color:#3B6BF5">SATPrep — Нууц үг сэргээх</h2>
              <p>Таны нууц үг сэргээх код:</p>
              <div style="font-size:32px;font-weight:700;letter-spacing:8px;text-align:center;padding:24px;background:#EBF0FF;border-radius:8px;color:#3B6BF5">${code}</div>
              <p style="color:#6B7280;font-size:13px;margin-top:16px">Код 15 минутын дотор хүчинтэй. Хэрэв та нууц үг сэргээх хүсэлт гаргаагүй бол энэ имэйлийг үл тоомсорлоно уу.</p>
            </div>
          `,
        });
        return res.json({ message: `Ресет код ${email} имэйл рүү илгээгдлээ. 15 минутын дотор ашиглана уу.` });
      } catch (emailErr) {
        console.error("Имэйл илгээхэд алдаа:", emailErr.message);
      }
    }

    // Имэйл тохируулагдаагүй үед консол дээр харуулах (хөгжүүлэлтийн горим)
    console.log(`[SATPrep] Нууц үг ресет код (${email}): ${code}`);
    res.json({ message: `Ресет код ${email} рүү илгээгдлээ. 15 минутын дотор ашиглана уу.` });
  } catch (error) {
    console.error("Forgot password алдаа:", error);
    res.status(500).json({ error: "Серверийн алдаа" });
  }
});

// ─── НУУЦ ҮГ РЕСЕТ ХИЙХ ───
// POST /api/auth/reset-password
router.post("/reset-password", async (req, res) => {
  try {
    const { email, code, newPassword } = req.body;
    if (!email || !code || !newPassword) return res.status(400).json({ error: "Бүх талбарыг бөглөнө үү" });
    if (newPassword.length < 6) return res.status(400).json({ error: "Нууц үг хамгийн багадаа 6 тэмдэгт байх ёстой" });

    const user = await User.findOne({ email }).select("+resetPasswordCode");
    if (!user) return res.status(404).json({ error: "Хэрэглэгч олдсонгүй" });

    if (!user.resetPasswordCode || user.resetPasswordCode !== code) {
      return res.status(400).json({ error: "Ресет код буруу байна" });
    }
    if (!user.resetPasswordExpiry || user.resetPasswordExpiry < new Date()) {
      return res.status(400).json({ error: "Ресет кодын хугацаа дууссан байна. Дахин авна уу." });
    }

    user.password = newPassword;
    user.resetPasswordCode = null;
    user.resetPasswordExpiry = null;
    await user.save();

    res.json({ message: "Нууц үг амжилттай солигдлоо!" });
  } catch (error) {
    console.error("Reset password алдаа:", error);
    res.status(500).json({ error: "Серверийн алдаа" });
  }
});

module.exports = router;
