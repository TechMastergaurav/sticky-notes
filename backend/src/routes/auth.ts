import { Router, Request, Response } from "express";
import User from "../models/User";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const router = Router();
const SECRET = process.env.JWT_SECRET || "mysecret";


// Signup
router.post("/signup", async (req: Request, res: Response) => {
  try {
    const { email, password, name } = req.body;
    
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ msg: "User already exists" });
    }

    const hashed = await bcrypt.hash(password, 10);
    const user = new User({ 
      email, 
      password: hashed, 
      name,
      isGoogleUser: false 
    });
    
    await user.save();
    
    const token = jwt.sign(
      { userId: user._id, email: user.email, name: user.name }, 
      SECRET, 
      { expiresIn: "7d" }
    );
    
    res.json({ 
      token, 
      user: { id: user._id, email: user.email, name: user.name } 
    });
  } catch (error) {
    res.status(500).json({ msg: "Server error" });
  }
});

// Signin
router.post("/signin", async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    
    if (!user) {
      return res.status(400).json({ msg: "User not found" });
    }

    if (user.isGoogleUser) {
      return res.status(400).json({ msg: "Please use Google sign-in for this account" });
    }

    const valid = await bcrypt.compare(password, user.password || "");
    if (!valid) {
      return res.status(400).json({ msg: "Invalid password" });
    }

    const token = jwt.sign(
      { userId: user._id, email: user.email, name: user.name }, 
      SECRET, 
      { expiresIn: "7d" }
    );
    
    res.json({ 
      token, 
      user: { id: user._id, email: user.email, name: user.name } 
    });
  } catch (error) {
    res.status(500).json({ msg: "Server error" });
  }
});



// Get user profile
router.get("/profile", async (req, res) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    console.log("🔹 Incoming token:", token);

    if (!token) {
      return res.status(401).json({ msg: "No token provided" });
    }

    const decoded = jwt.verify(token, SECRET) as any;
    console.log("Decoded token:", decoded);

    const user = await User.findById(decoded.userId).select("-password");
    if (!user) {
      return res.status(404).json({ msg: "User not found" });
    }

    res.json({ user });
  } catch (error) {
    console.error(" Profile error:", error);
    res.status(401).json({ msg: "Invalid token" });
  }
});


export default router;
