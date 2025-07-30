import React, { ReactElement } from 'react';
import { render, RenderOptions } from '@testing-library/react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import canvasSlice from '../store/slices/canvasSlice';
import tablesSlice from '../store/slices/tablesSlice';
import relationshipsSlice from '../store/slices/relationshipsSlice';
import notesSlice from '../store/slices/notesSlice';
import uiSlice from '../store/slices/uiSlice';

const createTestStore = () => {
  return configureStore({
    reducer: {
      canvas: canvasSlice.reducer,
      tables: tablesSlice.reducer,
      relationships: relationshipsSlice.reducer,
      notes: notesSlice.reducer,
      ui: uiSlice.reducer,
    },
  });
};

interface CustomRenderOptions extends Omit<RenderOptions, 'wrapper'> {
  store?: ReturnType<typeof createTestStore>;
}

export function renderWithProviders(
  ui: ReactElement,
  { store = createTestStore(), ...renderOptions }: CustomRenderOptions = {}
) {
  function Wrapper({ children }: { children: React.ReactNode }) {
    return <Provider store={store}>{children}</Provider>;
  }

  return { store, ...render(ui, { wrapper: Wrapper, ...renderOptions }) };
}

// Re-export specific testing utilities
export { render, screen, fireEvent, waitFor } from '@testing-library/react';
