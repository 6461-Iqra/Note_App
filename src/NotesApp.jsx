import React, { useState, useEffect } from 'react';
import { Plus, Trash, Edit, NotebookText, X, Sun, Moon } from 'lucide-react';
import { db } from './firebase';
import { collection, addDoc, updateDoc, doc, deleteDoc, getDocs } from 'firebase/firestore';
import "./App.css"


export default function NotesApp() {
  const [notes, setNotes] = useState([]);
  const [search, setSearch] = useState('');
  const [newNote, setNewNote] = useState({ title: '', content: '' });
  const [editing, setEditing] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [darkMode, setDarkMode] = useState(false);

  // Fetch notes from Firestore
  const fetchNotes = async () => {
    try {
      const notesCollection = collection(db, "notes");
      const querySnapshot = await getDocs(notesCollection);
      const fetchedNotes = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      // Filter notes based on search input
      const filteredNotes = fetchedNotes.filter(note =>
        note.title.toLowerCase().includes(search.toLowerCase()) ||
        note.content.toLowerCase().includes(search.toLowerCase())
      );

      setNotes(filteredNotes);
    } catch (error) {
      console.error("Error fetching notes:", error);
    }
  };

  useEffect(() => {
    fetchNotes();
  }, [search]);

  // Add or Update a Note
  const addOrUpdateNote = async () => {
    if (newNote.title.trim() === "" || newNote.content.trim() === "") {
      alert("Title and Content cannot be empty!");
      return;
    }

    try {
      if (editing) {
        // Updating an existing note
        const noteRef = doc(db, 'notes', editing.id);
        await updateDoc(noteRef, {
          title: newNote.title,
          content: newNote.content,
          updatedAt: new Date(), // Keep track of updates in Firestore
        });

        setNotes(notes.map(note => note.id === editing.id ? { ...note, ...newNote } : note));
        setEditing(null);
      } else {
        // Adding a new note
        await addDoc(collection(db, 'notes'), {
          title: newNote.title,
          content: newNote.content,
          createdAt: new Date(), // Store date in Firebase only
        });

        setNotes(prevNotes => [...prevNotes, { ...newNote }]);
      }
    } catch (error) {
      console.error("Error adding/updating note:", error);
    }

    setNewNote({ title: '', content: '' });
    setShowModal(false);
  };

  // Delete a Note
  const deleteNote = async (id) => {
    try {
      await deleteDoc(doc(db, 'notes', id));
      setNotes(notes.filter(note => note.id !== id));
    } catch (error) {
      console.error("Error deleting note:", error);
    }
  };

  // Toggle Theme
  const toggleTheme = () => setDarkMode(!darkMode);

  return (
    <div className={`app-container ${darkMode ? 'dark' : 'light'}`}>
      {/* Navbar */}
      <header className="header">
        <h1>
          <NotebookText size={24} /> Notes App
        </h1>
        <input
          type="text"
          placeholder="Search notes..."
          className="search-bar"
          onChange={(e) => setSearch(e.target.value)}
        />
        <button onClick={() => setShowModal(true)} className="add-btn">
          <Plus size={18} /> New Note
        </button>
        <button onClick={toggleTheme} className="theme-toggle-btn">
          {darkMode ? <Sun size={20} /> : <Moon size={20} />}
        </button>
      </header>

      {/* Notes Grid */}
      {notes.length === 0 ? (
        <p className="empty-msg">No notes yet. Click "New Note" to add one!</p>
      ) : (
        <div className="notes-grid">
          {notes.map(note => (
            <div key={note.id} className="note-card">
              <h2>{note.title}</h2>
              <p>{note.content}</p>

              <div className="note-actions">
                <button onClick={() => { setEditing(note); setNewNote(note); setShowModal(true); }} className="edit-btn">
                  <Edit size={16} />
                </button>
                <button onClick={() => deleteNote(note.id)} className="delete-btn">
                  <Trash size={16} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal for Adding/Editing Notes */}
      {showModal && (
        <div className="modal-overlay">
          <div className="modal">
            <div className="modal-header">
              <h2>{editing ? 'Edit Note' : 'New Note'}</h2>
              <button onClick={() => setShowModal(false)} className="close-btn">
                <X size={18} />
              </button>
            </div>
            <input
              type="text"
              placeholder="Title"
              value={newNote.title}
              onChange={(e) => setNewNote({ ...newNote, title: e.target.value })}
            />
            <textarea
              placeholder="Content"
              value={newNote.content}
              onChange={(e) => setNewNote({ ...newNote, content: e.target.value })}
            ></textarea>
            <button onClick={addOrUpdateNote} className="save-btn">
              {editing ? 'Update' : 'Save'} Note
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
