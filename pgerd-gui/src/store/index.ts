// Main Redux store configuration

import { configureStore } from '@reduxjs/toolkit';
import { useDispatch, useSelector, TypedUseSelectorHook } from 'react-redux';

// Import slices
import canvasSlice from './slices/canvasSlice';
import tablesSlice from './slices/tablesSlice';
import relationshipsSlice from './slices/relationshipsSlice';
import notesSlice from './slices/notesSlice';
import usersSlice from './slices/usersSlice';
import permissionsSlice from './slices/permissionsSlice';
import schemaBoxesSlice from './slices/schemaBoxesSlice';
import uiSlice from './slices/uiSlice';

// Configure the store
export const store = configureStore({
  reducer: {
    canvas: canvasSlice.reducer,
    tables: tablesSlice.reducer,
    relationships: relationshipsSlice.reducer,
    notes: notesSlice.reducer,
    users: usersSlice.reducer,
    permissions: permissionsSlice.reducer,
    schemaBoxes: schemaBoxesSlice.reducer,
    ui: uiSlice.reducer,
  },
  middleware: getDefaultMiddleware =>
    getDefaultMiddleware({
      serializableCheck: {
        // Ignore these action types for Date objects in notes
        ignoredActions: ['notes/addNote', 'notes/updateNote'],
        // Ignore these field paths in all actions
        ignoredActionsPaths: ['payload.createdAt', 'payload.updatedAt'],
        // Ignore these paths in the state
        ignoredPaths: ['notes.byId.*.createdAt', 'notes.byId.*.updatedAt'],
      },
    }),
  devTools: process.env.NODE_ENV !== 'production',
});

// Export types for TypeScript
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

// Typed hooks for use throughout the application
export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;

// Action creators from slices
export const canvasActions = canvasSlice.actions;
export const tablesActions = tablesSlice.actions;
export const relationshipsActions = relationshipsSlice.actions;
export const notesActions = notesSlice.actions;
export const usersActions = usersSlice.actions;
export const permissionsActions = permissionsSlice.actions;
export const schemaBoxesActions = schemaBoxesSlice.actions;
export const uiActions = uiSlice.actions;

// Selectors
export * from './selectors';

// Default export
export default store;
