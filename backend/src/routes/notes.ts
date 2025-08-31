
import { Router, Response } from "express";
import { AuthRequest, authMiddleware } from "../middleware/auth";
import Note from "../models/Note";


const router = Router();



//@ts-ignore
router.post("/notes", authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const { title, content, color, tags } = req.body;
    
    // Better validation with specific error messages
    if (!title || title.trim() === '') {
      return res.status(400).json({ msg: "Note title is required" });
    }
    
    if (!content || content.trim() === '') {
      return res.status(400).json({ msg: "Note content is required" });
    }

    const note = new Note({ 
      userId: req.user.userId, 
      title: title.trim(), 
      content: content.trim(), 
      color: color || "#ffffff",
      tags: tags || [],
      isPinned: false
    });
    
    await note.save();
    res.json(note);
  } catch (error: any) {
    console.error("Create note error:", error);
    
    if (error.name === 'ValidationError') {
      return res.status(400).json({ 
        msg: "Validation error", 
        errors: error.errors 
      });
    }
    
    res.status(500).json({ msg: "Failed to create note", error: error.message });
  }
});

// Get My Notes
//@ts-ignore
router.get("/notes", authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const notes = await Note.find({ userId: req.user.userId })
      .sort({ isPinned: -1, updatedAt: -1 });
    res.json(notes);
  } catch (error) {
    res.status(500).json({ msg: "Failed to fetch notes" });
  }
});

// Get Single Note
//@ts-ignore
router.get("/notes/:id", authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const note = await Note.findOne({ 
      _id: req.params.id, 
      userId: req.user.userId 
    });
    
    if (!note) {
      return res.status(404).json({ msg: "Note not found" });
    }
    
    res.json(note);
  } catch (error) {
    res.status(500).json({ msg: "Failed to fetch note" });
  }
});

// Update Note
//@ts-ignore
router.put("/notes/:id", authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const { title, content, color, tags, isPinned } = req.body;
    
    const note = await Note.findOneAndUpdate(
      { _id: req.params.id, userId: req.user.userId },
      { title, content, color, tags, isPinned },
      { new: true }
    );
    
    if (!note) {
      return res.status(404).json({ msg: "Note not found" });
    }
    
    res.json(note);
  } catch (error) {
    res.status(500).json({ msg: "Failed to update note" });
  }
});

// Delete Note
//@ts-ignore
router.delete("/notes/:id", authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const note = await Note.findOneAndDelete({ 
      _id: req.params.id, 
      userId: req.user.userId 
    });
    
    if (!note) {
      return res.status(404).json({ msg: "Note not found" });
    }
    
    res.json({ msg: "Note deleted successfully" });
  } catch (error) {
    res.status(500).json({ msg: "Failed to delete note" });
  }
});

// Toggle Pin Note
//@ts-ignore
router.patch("/notes/:id/pin", authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const note = await Note.findOne({ 
      _id: req.params.id, 
      userId: req.user.userId 
    });
    
    if (!note) {
      return res.status(404).json({ msg: "Note not found" });
    }
    
    note.isPinned = !note.isPinned;
    await note.save();
    
    res.json(note);
  } catch (error) {
    res.status(500).json({ msg: "Failed to toggle pin" });
  }
});

// Search Notes
//@ts-ignore
router.get("/notes/search/:query", authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const query = req.params.query;
    const notes = await Note.find({
      userId: req.user.userId,
      $or: [
        { title: { $regex: query, $options: 'i' } },
        { content: { $regex: query, $options: 'i' } },
        { tags: { $in: [new RegExp(query, 'i')] } }
      ]
    }).sort({ updatedAt: -1 });
    
    res.json(notes);
  } catch (error) {
    res.status(500).json({ msg: "Failed to search notes" });
  }
});

export default router;
