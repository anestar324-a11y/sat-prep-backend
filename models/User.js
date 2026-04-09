const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Нэр оруулна уу"],
      trim: true,
      maxlength: 50,
    },
    email: {
      type: String,
      required: [true, "Имэйл оруулна уу"],
      unique: true,
      lowercase: true,
      trim: true,
    },
    phone: {
      type: String,
      trim: true,
    },
    password: {
      type: String,
      required: [true, "Нууц үг оруулна уу"],
      minlength: 6,
      select: false, // Query хийхэд нууц үг буцаахгүй
    },
    plan: {
      type: String,
      enum: ["free", "premium"],
      default: "free",
    },
    planExpiry: {
      type: Date,
      default: null,
    },
    targetScore: {
      type: Number,
      default: 1400,
    },
    targetDate: {
      type: Date,
      default: null,
    },
    streak: {
      type: Number,
      default: 0,
    },
    lastStudyDate: {
      type: Date,
      default: null,
    },
    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
    },
    avatar: {
      type: String,
      default: null,
    },
  },
  {
    timestamps: true, // createdAt, updatedAt автоматаар нэмнэ
  }
);

// Нууц үгийг хадгалахын өмнө hash хийх
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

// Нууц үг шалгах method
userSchema.methods.comparePassword = async function (candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

module.exports = mongoose.model("User", userSchema);
