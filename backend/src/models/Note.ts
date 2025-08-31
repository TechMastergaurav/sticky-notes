import mongoose, { Schema, Document } from "mongoose";

export interface INote extends Document {
  userId: mongoose.Types.ObjectId;
  title: string;
  content: string;
  color?: string;
  isPinned: boolean;
  tags: string[];
}

const noteSchema = new Schema<INote>({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  title: { type: String, required: true },
  content: { type: String, required: true },
  color: { type: String, default: '#ffffff' },
  isPinned: { type: Boolean, default: false },
  tags: [{ type: String }]
}, {
  timestamps: true
});

export default mongoose.model<INote>("Note", noteSchema);
