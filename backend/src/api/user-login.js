import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/user.js";

const login = async (req, res) => {
  const { email, password } = req.body;

  const existingUser = await User.findOne({ email });

  if (!existingUser) {
    return res.status(404).json({ message: 'User Not Found' });
  }

  const isPasswordCorrect = await bcrypt.compare(
    password,
    existingUser.password
  );

  if (!isPasswordCorrect) {
    return res.status(400).json({ message: "Invalid Password" });
  }

  const token = jwt.sign(
    {
      _id: existingUser._id,
      name: existingUser.name,
      email: existingUser.email,
      password: existingUser.password,
    },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN }
  );

  res.status(200).json({
    token,
    tokens: existingUser.tokens.toString()
  });
};

export default login;
