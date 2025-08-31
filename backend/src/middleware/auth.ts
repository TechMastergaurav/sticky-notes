import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

const SECRET = process.env.JWT_SECRET || "mysecret";

export interface AuthRequest extends Request {
  user: {
    userId: string;
    email: string;
    name: string;
  };
}

export const authMiddleware = (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];
   
    
    if (!token) {
      return res.status(401).json({ msg: "No token provided" });
    }

    const decoded = jwt.verify(token, SECRET) as any;
   

    req.user = {
      userId: decoded.userId || decoded.id,  
      email: decoded.email,
      name: decoded.name,
    };

 
    
    next();
  } catch (error) {
    return res.status(401).json({ msg: "Invalid token" });
  }
};