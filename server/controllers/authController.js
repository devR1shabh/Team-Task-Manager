const User = require("../models/User");
const asyncHandler = require("../utils/asyncHandler");
const generateToken = require("../utils/generateToken");
const { isNonEmptyString, isValidEmail } = require("../utils/validators");

const userResponse = (user) => ({
  _id: user._id,
  name: user.name,
  email: user.email,
  role: user.role
});

const register = asyncHandler(async (req, res) => {
  const { name, email, password, role } = req.body;

  if (!isNonEmptyString(name) || !isValidEmail(email) || !isNonEmptyString(password)) {
    return res.status(400).json({
      success: false,
      message: "Name, valid email, and password are required",
      data: {}
    });
  }

  if (password.length < 6) {
    return res.status(400).json({
      success: false,
      message: "Password must be at least 6 characters",
      data: {}
    });
  }

  if (role && !["admin", "member"].includes(role)) {
    return res.status(400).json({
      success: false,
      message: "Role must be admin or member",
      data: {}
    });
  }

  const existingUser = await User.findOne({ email: email.toLowerCase() });
  if (existingUser) {
    return res.status(400).json({
      success: false,
      message: "Email is already registered",
      data: {}
    });
  }

  const user = await User.create({ name, email, password, role });
  const token = generateToken(user._id);

  return res.status(201).json({
    success: true,
    message: "Registration successful",
    data: { user: userResponse(user), token }
  });
});

const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  if (!isValidEmail(email) || !isNonEmptyString(password)) {
    return res.status(400).json({
      success: false,
      message: "Valid email and password are required",
      data: {}
    });
  }

  const user = await User.findOne({ email: email.toLowerCase() });
  if (!user || !(await user.matchPassword(password))) {
    return res.status(401).json({
      success: false,
      message: "Invalid email or password",
      data: {}
    });
  }

  const token = generateToken(user._id);

  return res.status(200).json({
    success: true,
    message: "Login successful",
    data: { user: userResponse(user), token }
  });
});

module.exports = { register, login };
