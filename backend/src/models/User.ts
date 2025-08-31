import mongoose, { Schema, Document } from "mongoose";

export interface IUser extends Document {
  email: string;
  password?: string;
  name: string;
  picture?: string;
  googleId?: string;
  isGoogleUser: boolean;
}

const userSchema = new Schema<IUser>({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: false },
  name: { type: String, required: true },
  picture: { type: String, required: false },
  googleId: { type: String, required: false, unique: true, sparse: true },
  isGoogleUser: { type: Boolean, default: false }
}, {
  timestamps: true
});

export default mongoose.model<IUser>("User", userSchema);
