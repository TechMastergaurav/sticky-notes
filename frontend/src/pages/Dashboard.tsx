import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useNotes } from '../contexts/NotesContext';
import Note from '../components/Note';
import NoteForm from '../components/NoteForm';
import { 
  Plus, 
  Search, 
  LogOut, 
  User, 
  Menu, 
  X,
  Filter,
  Grid3X3,
  List
} from 'lucide-react';
import toast from 'react-hot-toast';

const Dashboard: React.FC = () => {
  const { user, logout, loading: authLoading } = useAuth();
  const { notes, loading, searchNotes, clearSearch } = useNotes();
  const navigate = useNavigate();
  
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingNote, setEditingNote] = useState<any>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [filterColor, setFilterColor] = useState<string>('');

  // Show loading while auth is being checked
  if (authLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  // If no user after loading, return null (ProtectedRoute will handle redirect)
  if (!user) {
    return null;
  }

  const handleLogout = () => {
    logout();
    navigate('/');
    toast.success('Logged out successfully');
  };
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      searchNotes(searchQuery);
    }
  };

  const handleClearSearch = () => {
    setSearchQuery('');
    clearSearch();
  };

  const handleEditNote = (note: any) => {
    setEditingNote(note);
    setIsFormOpen(true);
  };

  const handleCloseForm = () => {
    setIsFormOpen(false);
    setEditingNote(null);
  };

  const filteredNotes = filterColor 
    ? notes.filter(note => note.color === filterColor)
    : notes;

  const pinnedNotes = filteredNotes.filter(note => note.isPinned);
  const unpinnedNotes = filteredNotes.filter(note => !note.isPinned);

  const colors = [
    '#ffffff', '#fef3c7', '#fde68a', '#fbbf24', '#f59e0b',
    '#fef2f2', '#fecaca', '#fca5a5', '#ef4444', '#dc2626',
    '#f0f9ff', '#bae6fd', '#7dd3fc', '#0ea5e9', '#0284c7',
    '#f0fdf4', '#bbf7d0', '#86efac', '#22c55e', '#16a34a',
    '#faf5ff', '#e9d5ff', '#d8b4fe', '#a855f7', '#9333ea'
  ];

  if (!user) return null;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Left side */}
            <div className="flex items-center">
              <button
                onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                className="lg:hidden p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100"
              >
                {isSidebarOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </button>
              <h1 className="text-2xl font-bold text-gray-900 ml-2 lg:ml-0">Notes App</h1>
            </div>

            {/* Search */}
            <div className="flex-1 max-w-lg mx-4">
              <form onSubmit={handleSearch} className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search notes..."
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                {searchQuery && (
                  <button
                    type="button"
                    onClick={handleClearSearch}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    <X className="h-4 w-4" />
                  </button>
                )}
              </form>
            </div>

            {/* Right side */}
            <div className="flex items-center space-x-4">
              {/* View mode toggle */}
              <div className="flex items-center bg-gray-100 rounded-lg p-1">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-2 rounded-md transition-colors ${
                    viewMode === 'grid' ? 'bg-white shadow-sm' : 'text-gray-500 hover:text-gray-700'
                  }`}
                >
                  <Grid3X3 className="h-4 w-4" />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-2 rounded-md transition-colors ${
                    viewMode === 'list' ? 'bg-white shadow-sm' : 'text-gray-500 hover:text-gray-700'
                  }`}
                >
                  <List className="h-4 w-4" />
                </button>
              </div>

              {/* User menu */}
              <div className="flex items-center space-x-3">
                <div className="hidden sm:block text-right">
                  <p className="text-sm font-medium text-gray-900">{user.name}</p>
                  <p className="text-xs text-gray-500">{user.email}</p>
                </div>
                {user.picture ? (
                  <img
                    src={user.picture}
                    alt={user.name}
                    className="h-8 w-8 rounded-full"
                  />
                ) : (
                  <div className="h-8 w-8 bg-blue-500 rounded-full flex items-center justify-center">
                    <User className="h-4 w-4 text-white" />
                  </div>
                )}
                <button
                  onClick={handleLogout}
                  className="p-2 text-gray-400 hover:text-gray-500 hover:bg-gray-100 rounded-lg transition-colors"
                  title="Logout"
                >
                  <LogOut className="h-5 w-5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Sidebar */}
        <aside className={`fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-lg transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0 ${
          isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}>
          <div className="p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Filters</h2>
            
            {/* Color filter */}
            <div className="mb-6">
              <h3 className="text-sm font-medium text-gray-700 mb-3">Filter by Color</h3>
              <div className="grid grid-cols-6 gap-2">
                <button
                  onClick={() => setFilterColor('')}
                  className={`w-8 h-8 rounded-lg border-2 transition-all duration-200 ${
                    filterColor === '' ? 'border-gray-800 scale-110' : 'border-gray-300 hover:border-gray-400'
                  }`}
                  title="All colors"
                >
                  <div className="w-full h-full rounded-lg bg-gradient-to-br from-gray-300 to-gray-400 flex items-center justify-center text-xs text-gray-600 font-bold">
                    ALL
                  </div>
                </button>
                {colors.map((color) => (
                  <button
                    key={color}
                    onClick={() => setFilterColor(color)}
                    className={`w-8 h-8 rounded-lg border-2 transition-all duration-200 ${
                      filterColor === color ? 'border-gray-800 scale-110' : 'border-gray-300 hover:border-gray-400'
                    }`}
                    style={{ backgroundColor: color }}
                    title={color}
                  />
                ))}
              </div>
            </div>

            {/* Stats */}
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Total Notes</span>
                <span className="text-sm font-medium text-gray-900">{notes.length}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Pinned</span>
                <span className="text-sm font-medium text-gray-900">{pinnedNotes.length}</span>
              </div>
            </div>
          </div>
        </aside>

        {/* Main content */}
        <main className="flex-1 p-6">
          {/* Create note button */}
          <div className="mb-6">
            <button
              onClick={() => setIsFormOpen(true)}
              className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-200"
            >
              <Plus className="h-5 w-5 mr-2" />
              Create Note
            </button>
          </div>

          {/* Notes grid/list */}
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            </div>
          ) : filteredNotes.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-gray-400 mb-4">
                <svg className="mx-auto h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">No notes found</h3>
              <p className="text-gray-500">
                {searchQuery ? 'Try adjusting your search terms.' : 'Get started by creating your first note!'}
              </p>
            </div>
          ) : (
            <div className="space-y-6">
              {/* Pinned notes */}
              {pinnedNotes.length > 0 && (
                <div>
                  <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                    <Filter className="h-5 w-5 mr-2 text-yellow-500" />
                    Pinned Notes
                  </h2>
                  <div className={viewMode === 'grid' 
                    ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4'
                    : 'space-y-3'
                  }>
                    {pinnedNotes.map((note) => (
                      <Note key={note._id} note={note} onEdit={handleEditNote} />
                    ))}
                  </div>
                </div>
              )}

              {/* Unpinned notes */}
              {unpinnedNotes.length > 0 && (
                <div>
                  <h2 className="text-lg font-semibold text-gray-900 mb-4">All Notes</h2>
                  <div className={viewMode === 'grid' 
                    ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4'
                    : 'space-y-3'
                  }>
                    {unpinnedNotes.map((note) => (
                      <Note key={note._id} note={note} onEdit={handleEditNote} />
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </main>
      </div>

      {/* Note Form Modal */}
      <NoteForm
        isOpen={isFormOpen}
        onClose={handleCloseForm}
        note={editingNote}
        mode={editingNote ? 'edit' : 'create'}
      />
    </div>
  );
};

export default Dashboard;
