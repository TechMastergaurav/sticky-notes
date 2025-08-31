import React, { useState } from 'react';
import { useNotes } from '../contexts/NotesContext';
import { Pin, Edit3, Trash2, Tag, Calendar } from 'lucide-react';
import toast from 'react-hot-toast';

interface NoteProps {
  note: {
    _id: string;
    title: string;
    content: string;
    color: string;
    isPinned: boolean;
    tags: string[];
    createdAt: string;
    updatedAt: string;
  };
  onEdit: (note: any) => void;
}

const Note: React.FC<NoteProps> = ({ note, onEdit }) => {
  const { deleteNote, togglePin } = useNotes();
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this note?')) {
      try {
        setIsDeleting(true);
        await deleteNote(note._id);
        toast.success('Note deleted successfully');
      } catch (error) {
        toast.error('Failed to delete note');
      } finally {
        setIsDeleting(false);
      }
    }
  };

  const handleTogglePin = async () => {
    try {
      await togglePin(note._id);
      toast.success(note.isPinned ? 'Note unpinned' : 'Note pinned');
    } catch (error) {
      toast.error('Failed to toggle pin');
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  return (
    <div 
      className={`relative group rounded-xl p-4 shadow-sm hover:shadow-md transition-all duration-200 border-l-4 ${
        note.isPinned ? 'ring-2 ring-yellow-400' : ''
      }`}
      style={{ backgroundColor: note.color }}
    >
      {/* Pin indicator */}
      {note.isPinned && (
        <div className="absolute -top-2 -right-2 bg-yellow-400 text-yellow-900 p-1 rounded-full">
          <Pin className="h-3 w-3" />
        </div>
      )}

      {/* Actions */}
      <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex gap-1">
        <button
          onClick={handleTogglePin}
          className={`p-1 rounded hover:bg-black/10 transition-colors ${
            note.isPinned ? 'text-yellow-600' : 'text-gray-600'
          }`}
          title={note.isPinned ? 'Unpin note' : 'Pin note'}
        >
          <Pin className="h-4 w-4" />
        </button>
        <button
          onClick={() => onEdit(note)}
          className="p-1 rounded hover:bg-black/10 transition-colors text-gray-600"
          title="Edit note"
        >
          <Edit3 className="h-4 w-4" />
        </button>
        <button
          onClick={handleDelete}
          disabled={isDeleting}
          className="p-1 rounded hover:bg-black/10 transition-colors text-red-600 disabled:opacity-50"
          title="Delete note"
        >
          <Trash2 className="h-4 w-4" />
        </button>
      </div>

      {/* Content */}
      <div className="space-y-3">
        <h3 className="font-semibold text-gray-900 text-lg line-clamp-2">
          {note.title}
        </h3>
        
        <p className="text-gray-700 text-sm line-clamp-4 leading-relaxed">
          {note.content}
        </p>

        {/* Tags */}
        {note.tags && note.tags.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {note.tags.map((tag, index) => (
              <span
                key={index}
                className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-black/10 text-gray-700"
              >
                <Tag className="h-3 w-3 mr-1" />
                {tag}
              </span>
            ))}
          </div>
        )}

        {/* Date */}
        <div className="flex items-center text-xs text-gray-500">
          <Calendar className="h-3 w-3 mr-1" />
          {formatDate(note.updatedAt)}
        </div>
      </div>
    </div>
  );
};

export default Note;
