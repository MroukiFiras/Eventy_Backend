import User from "../models/userModel";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const createUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const user = await User.findOne({
      email: email.req.body,
    });
    if (user !== null) {
      return res.json({
        message: "This email user already exists.",
        state: false,
      });
    } else {
      const hashedPass = await bcrypt.hash(password);
      const user = new User({
        name: name,
        email: email,
        password: hashedPass,
      });
      const newUser = await user.save();
      const authtoken = createToken(user._id);
      res.header("auth-token", authToken).json({
        message: "User has been created.",
        user: user,
        state: true,
      });
    }
  } catch (err) {
    console.log(`user creation failed : ${err}`);
    res.json({ message: err.message, state: false });
  }
};

export default {
  createUser,
};
