import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import axios from 'axios';
import { useAuth } from './AuthContext';

// ---------- Types ----------
interface Note {
  _id: string;
  title: string;
  content: string;
  color: string;
  isPinned: boolean;
  tags: string[];
  createdAt: string;
  updatedAt: string;
}

interface NotesContextType {
  notes: Note[];
  loading: boolean;
  createNote: (noteData: Partial<Note>) => Promise<void>;
  updateNote: (id: string, noteData: Partial<Note>) => Promise<void>;
  deleteNote: (id: string) => Promise<void>;
  togglePin: (id: string) => Promise<void>;
  searchNotes: (query: string) => Promise<void>;
  clearSearch: () => void;
}

const NotesContext = createContext<NotesContextType | undefined>(undefined);

// ---------- Custom Hook ----------
export const useNotes = () => {
  const context = useContext(NotesContext);
  if (context === undefined) {
    throw new Error('useNotes must be used within a NotesProvider');
  }
  return context;
};

// ---------- Provider ----------
interface NotesProviderProps {
  children: ReactNode;
}

export const NotesProvider: React.FC<NotesProviderProps> = ({ children }) => {
  const [notes, setNotes] = useState<Note[]>([]);
  const [loading, setLoading] = useState(false);
  const { token } = useAuth();

  // Use axios directly with current token
  const apiCall = (method: string, url: string, data?: any) => {
    return axios({
      method,
      url: `http://localhost:5000/api${url}`,
      data,
      headers: {
        Authorization: token ? `Bearer ${token}` : '',
        'Content-Type': 'application/json'
      }
    });
  };
   useEffect(() => {
    if (token) {
      fetchNotes();
    }
  }, [token]);
  const fetchNotes = async () => {
    if (!token) return;

    try {
      setLoading(true);
      const response = await apiCall('get','/notes');
      setNotes(response.data);
    } catch (error) {
      console.error('Failed to fetch notes:', error);
    } finally {
      setLoading(false);
    }
  };

  const createNote = async (noteData: Partial<Note>) => {
    try {
      const response = await apiCall('post','/notes', noteData);
      setNotes((prev) => [response.data, ...prev]);
    } catch (error) {
      console.error('Failed to create note:', error);
      throw error;
    }
  };

  const updateNote = async (id: string, noteData: Partial<Note>) => {
    try {
      const response = await apiCall('put',`/notes/${id}`, noteData);
      setNotes((prev) => prev.map((note) => (note._id === id ? response.data : note)));
    } catch (error) {
      console.error('Failed to update note:', error);
      throw error;
    }
  };

  const deleteNote = async (id: string) => {
    try {
      await apiCall('delete',`/notes/${id}`);
      setNotes((prev) => prev.filter((note) => note._id !== id));
    } catch (error) {
      console.error('Failed to delete note:', error);
      throw error;
    }
  };

  const togglePin = async (id: string) => {
    try {
      const response = await apiCall('patch',`/notes/${id}/pin`);
      setNotes((prev) => prev.map((note) => (note._id === id ? response.data : note)));
    } catch (error) {
      console.error('Failed to toggle pin:', error);
      throw error;
    }
  };

  const searchNotes = async (query: string) => {
    if (!query.trim()) {
      await fetchNotes();
      return;
    }

    try {
      setLoading(true);
      const response = await apiCall('get',`/notes/search/${encodeURIComponent(query)}`);
      setNotes(response.data);
    } catch (error) {
      console.error('Failed to search notes:', error);
    } finally {
      setLoading(false);
    }
  };

  const clearSearch = () => {
    fetchNotes();
  };

  // ---------- Provider Value ----------
  const value: NotesContextType = {
    notes,
    loading,
    createNote,
    updateNote,
    deleteNote,
    togglePin,
    searchNotes,
    clearSearch,
  };

  return <NotesContext.Provider value={value}>{children}</NotesContext.Provider>;
};
