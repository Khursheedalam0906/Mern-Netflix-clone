import { User } from "../models/userSchema.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

export const Register = async (req, res) => {
  const { name, email, password } = req.body;

  try {
    if (!name || !email || !password) {
      return res.status(401).json({ message: "Invalid data", success: false });
    }
    const userExist = await User.findOne({ email });
    if (userExist) {
      return res
        .status(401)
        .json({ message: "Email already exist", success: false });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    await User.create({ name, email, password: hashedPassword });
    return res
      .status(201)
      .json({ message: "Account created successfully", success: true });
  } catch (error) {
    return res.status(500).json({ error: error.message, success: false });
  }
};

export const Login = async (req, res) => {
  const { email, password } = req.body;

  try {
    if (!email || !password) {
      return res.status(401).json({ message: "Invalid data", success: false });
    }
    const userExist = await User.findOne({ email });
    if (!userExist) {
      return res.status(401).json({
        message: "Invalid email or password",
        success: false,
      });
    }
    const matchPassword = await bcrypt.compare(password, userExist.password);
    if (!matchPassword) {
      return res
        .status(401)
        .json({ message: "Invalid email or password", success: false });
    }
    const tokenData = {
      id: userExist._id,
    };
    const token = await jwt.sign(tokenData, "rhjfhhfhfhff", {
      expiresIn: "1d",
    });
    return res
      .status(200)
      .cookie("token", token, { httpOnly: true })
      .json({
        message: `Welcome back ${userExist.name}`,
        success: true,
        user: userExist,
      });
  } catch (error) {
    return res.status(500).json({ error: error.message, success: false });
  }
};

export const Logout = async (req, res) => {
  try {
    return res
      .status(200)
      .cookie("token", "", { expiresIn: new Date(Date.now()), httpOnly: true })
      .json({ message: "User logged out successfully", success: true });
  } catch (error) {
    return res.status(500).json({ message: error.message, success: false });
  }
};
