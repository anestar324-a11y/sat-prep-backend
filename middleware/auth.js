const jwt = require("jsonwebtoken");
const User = require("../models/User");

// Token шалгах middleware
const auth = async (req, res, next) => {
  try {
    // Header-аас token авах
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ error: "Нэвтрэх шаардлагатай" });
    }

    const token = authHeader.split(" ")[1];

    // Token-ийг шалгах
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Хэрэглэгчийг олох
    const user = await User.findById(decoded.userId);
    if (!user) {
      return res.status(401).json({ error: "Хэрэглэгч олдсонгүй" });
    }

    // Request-д хэрэглэгчийн мэдээлэл нэмэх
    req.user = user;
    req.userId = user._id;
    next();
  } catch (error) {
    if (error.name === "TokenExpiredError") {
      return res.status(401).json({ error: "Token хугацаа дууссан. Дахин нэвтэрнэ үү." });
    }
    return res.status(401).json({ error: "Token буруу байна" });
  }
};

// Premium шалгах middleware
const premiumOnly = async (req, res, next) => {
  if (req.user.plan !== "premium") {
    return res.status(403).json({
      error: "Энэ функц зөвхөн Premium хэрэглэгчдэд нээлттэй",
    });
  }
  next();
};

module.exports = { auth, premiumOnly };
