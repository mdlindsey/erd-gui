// Notes slice for managing diagram annotations

import { createSlice, PayloadAction, nanoid } from '@reduxjs/toolkit';
import { NotesState, Note, CreateNotePayload } from '../../types';

// Initial state
const initialState: NotesState = {
  byId: {},
  allIds: [],
  byTableId: {},
  showAllNotes: true,
  defaultNoteColor: '#ffd700',
  defaultNoteSize: { width: 200, height: 100 },
};

const notesSlice = createSlice({
  name: 'notes',
  initialState,
  reducers: {
    addNote: (state, action: PayloadAction<CreateNotePayload>) => {
      const id = nanoid();
      const now = new Date();
      const note: Note = {
        id,
        content: action.payload.content,
        position: action.payload.position,
        size: action.payload.size || state.defaultNoteSize,
        collapsed: false,
        tableId: action.payload.tableId,
        color: action.payload.color || state.defaultNoteColor,
        format: action.payload.format || 'plain_text',
        createdAt: now,
        updatedAt: now,
      };
      
      state.byId[id] = note;
      state.allIds.push(id);
      
      if (note.tableId) {
        if (!state.byTableId[note.tableId]) {
          state.byTableId[note.tableId] = [];
        }
        state.byTableId[note.tableId].push(id);
      }
    },
    
    updateNote: (state, action: PayloadAction<{ 
      id: string; 
      updates: Partial<Omit<Note, 'id' | 'createdAt'>> 
    }>) => {
      const { id, updates } = action.payload;
      const note = state.byId[id];
      
      if (note) {
        // Handle table association changes
        if (updates.tableId !== undefined && updates.tableId !== note.tableId) {
          // Remove from old table
          if (note.tableId && state.byTableId[note.tableId]) {
            const index = state.byTableId[note.tableId].indexOf(id);
            if (index >= 0) {
              state.byTableId[note.tableId].splice(index, 1);
            }
          }
          
          // Add to new table
          if (updates.tableId) {
            if (!state.byTableId[updates.tableId]) {
              state.byTableId[updates.tableId] = [];
            }
            state.byTableId[updates.tableId].push(id);
          }
        }
        
        state.byId[id] = { 
          ...note, 
          ...updates, 
          updatedAt: new Date() 
        };
      }
    },
    
    deleteNote: (state, action: PayloadAction<string>) => {
      const id = action.payload;
      const note = state.byId[id];
      
      if (note) {
        // Remove from table association
        if (note.tableId && state.byTableId[note.tableId]) {
          const index = state.byTableId[note.tableId].indexOf(id);
          if (index >= 0) {
            state.byTableId[note.tableId].splice(index, 1);
          }
        }
        
        delete state.byId[id];
        state.allIds = state.allIds.filter(noteId => noteId !== id);
      }
    },
    
    toggleNoteCollapsed: (state, action: PayloadAction<string>) => {
      const id = action.payload;
      if (state.byId[id]) {
        state.byId[id].collapsed = !state.byId[id].collapsed;
        state.byId[id].updatedAt = new Date();
      }
    },
    
    moveNote: (state, action: PayloadAction<{ id: string; position: { x: number; y: number } }>) => {
      const { id, position } = action.payload;
      if (state.byId[id]) {
        state.byId[id].position = position;
        state.byId[id].updatedAt = new Date();
      }
    },
    
    resizeNote: (state, action: PayloadAction<{ id: string; size: { width: number; height: number } }>) => {
      const { id, size } = action.payload;
      if (state.byId[id]) {
        state.byId[id].size = size;
        state.byId[id].updatedAt = new Date();
      }
    },
    
    deleteNotesByTable: (state, action: PayloadAction<string>) => {
      const tableId = action.payload;
      const noteIds = state.byTableId[tableId] || [];
      
      noteIds.forEach(noteId => {
        delete state.byId[noteId];
      });
      
      state.allIds = state.allIds.filter(id => !noteIds.includes(id));
      delete state.byTableId[tableId];
    },
    
    toggleShowAllNotes: (state) => {
      state.showAllNotes = !state.showAllNotes;
    },
    
    setDefaultNoteColor: (state, action: PayloadAction<string>) => {
      state.defaultNoteColor = action.payload;
    },
    
    setDefaultNoteSize: (state, action: PayloadAction<{ width: number; height: number }>) => {
      state.defaultNoteSize = action.payload;
    },
    
    clearAllNotes: (state) => {
      return initialState;
    },
  },
});

export default notesSlice;