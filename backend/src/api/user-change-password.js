import bcrypt from "bcryptjs";
import User from "../models/user.js";
import { omit } from 'lodash-es';

const changePassword = async (req, res) => {
  const { email, oldPassword, newPassword } = req.body;

  const existingUser = await User.findOne({ email });

  if (!existingUser) {
    return res.status(404).json({ message: "User Does Not Exist" });
  }

  const isPasswordCorrect = await bcrypt.compare(
    oldPassword,
    existingUser.password
  );

  if (!isPasswordCorrect) {
    return res.status(400).json({ message: "Invalid Password" });
  }

  const hashedPassword = await bcrypt.hash(newPassword, 12);

  const updatePassword = await User.findByIdAndUpdate(
    existingUser._id,
    { password: hashedPassword },
    { new: true }
  );

  res.status(200).json(omit(updatePassword, '_id'));
};

export default changePassword;
