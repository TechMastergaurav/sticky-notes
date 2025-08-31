import React, { useState, useEffect } from 'react';
import { useNotes } from '../contexts/NotesContext';
import { X, Palette, Tag as TagIcon } from 'lucide-react';
import toast from 'react-hot-toast';

interface NoteFormProps {
  isOpen: boolean;
  onClose: () => void;
  note?: any;
  mode: 'create' | 'edit';
}

const NoteForm: React.FC<NoteFormProps> = ({ isOpen, onClose, note, mode }) => {
  const { createNote, updateNote } = useNotes();
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [color, setColor] = useState('#ffffff');
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState('');
  const [loading, setLoading] = useState(false);

  const colors = [
    '#ffffff', '#fef3c7', '#fde68a', '#fbbf24', '#f59e0b',
    '#fef2f2', '#fecaca', '#fca5a5', '#ef4444', '#dc2626',
    '#f0f9ff', '#bae6fd', '#7dd3fc', '#0ea5e9', '#0284c7',
    '#f0fdf4', '#bbf7d0', '#86efac', '#22c55e', '#16a34a',
    '#faf5ff', '#e9d5ff', '#d8b4fe', '#a855f7', '#9333ea'
  ];

  useEffect(() => {
    if (note && mode === 'edit') {
      setTitle(note.title);
      setContent(note.content);
      setColor(note.color);
      setTags(note.tags || []);
    } else {
      resetForm();
    }
  }, [note, mode]);

  const resetForm = () => {
    setTitle('');
    setContent('');
    setColor('#ffffff');
    setTags([]);
    setTagInput('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title.trim() || !content.trim()) {
      toast.error('Please fill in title and content');
      return;
    }

    try {
      setLoading(true);
      const noteData = { title: title.trim(), content: content.trim(), color, tags };
      
      if (mode === 'create') {
        await createNote(noteData);
        toast.success('Note created successfully!');
      } else {
        await updateNote(note._id, noteData);
        toast.success('Note updated successfully!');
      }
      
      onClose();
      resetForm();
    } catch (error) {
      toast.error(mode === 'create' ? 'Failed to create note' : 'Failed to update note');
    } finally {
      setLoading(false);
    }
  };

  const addTag = () => {
    const tag = tagInput.trim();
    if (tag && !tags.includes(tag)) {
      setTags([...tags, tag]);
      setTagInput('');
    }
  };

  const removeTag = (tagToRemove: string) => {
    setTags(tags.filter(tag => tag !== tagToRemove));
  };

  // Handle Enter key for title field - prevent form submission
  const handleTitleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      // Focus on the content textarea
      const contentTextarea = document.querySelector('textarea') as HTMLTextAreaElement;
      if (contentTextarea) {
        contentTextarea.focus();
      }
    }
  };

  // Handle Enter key for content field - allow new lines (default behavior)
  const handleContentKeyPress = (e: React.KeyboardEvent) => {
    // Allow Enter to create new lines in textarea (default behavior)
    // No preventDefault needed here
  };

  // Handle Enter key for tag input - add tag
  const handleTagKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      addTag();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 flex-shrink-0">
          <h2 className="text-2xl font-bold text-gray-900">
            {mode === 'create' ? 'Create New Note' : 'Edit Note'}
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="h-6 w-6 text-gray-500" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="flex flex-col flex-1 overflow-hidden">
          <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Title */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Title
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              onKeyPress={handleTitleKeyPress}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
              placeholder="Enter note title"
              required
            />
          </div>

          {/* Content */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Content
            </label>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              onKeyPress={handleContentKeyPress}
              rows={6}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 resize-none"
              placeholder="Write your note content here..."
              required
            />
          </div>

          {/* Color Picker */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
              <Palette className="h-4 w-4 mr-2" />
              Note Color
            </label>
            <div className="grid grid-cols-12 gap-2">
              {colors.map((colorOption) => (
                <button
                  key={colorOption}
                  type="button"
                  onClick={() => setColor(colorOption)}
                  className={`w-8 h-8 rounded-lg border-2 transition-all duration-200 ${
                    color === colorOption ? 'border-gray-800 scale-110' : 'border-gray-300 hover:border-gray-400'
                  }`}
                  style={{ backgroundColor: colorOption }}
                  title={colorOption}
                />
              ))}
            </div>
          </div>

          {/* Tags */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
              <TagIcon className="h-4 w-4 mr-2" />
              Tags
            </label>
            <div className="space-y-3">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  onKeyPress={handleTagKeyPress}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  placeholder="Add a tag and press Enter"
                />
                <button
                  type="button"
                  onClick={addTag}
                  className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                >
                  Add
                </button>
              </div>
              
              {tags.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {tags.map((tag, index) => (
                    <span
                      key={index}
                      className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800"
                    >
                      {tag}
                      <button
                        type="button"
                        onClick={() => removeTag(tag)}
                        className="ml-2 text-blue-600 hover:text-blue-800"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>

          </div>

          {/* Actions */}
          <div className="flex justify-end gap-3 p-6 border-t border-gray-200 flex-shrink-0 bg-white">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Saving...' : (mode === 'create' ? 'Create Note' : 'Update Note')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default NoteForm;