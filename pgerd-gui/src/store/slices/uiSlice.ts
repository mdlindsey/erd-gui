// UI slice for managing application interface state

import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { UIState, Tool, Panel, Theme } from '../../types';

const initialState: UIState = {
  selectedTool: Tool.SELECT,
  showColumnTypes: true,
  sidebarOpen: true,
  activePanel: null,
  theme: Theme.LIGHT,
};

const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    // Tool selection
    setSelectedTool: (state, action: PayloadAction<Tool>) => {
      state.selectedTool = action.payload;
    },

    // Column display settings
    toggleColumnTypes: state => {
      state.showColumnTypes = !state.showColumnTypes;
    },

    setShowColumnTypes: (state, action: PayloadAction<boolean>) => {
      state.showColumnTypes = action.payload;
    },

    // Sidebar management
    toggleSidebar: state => {
      state.sidebarOpen = !state.sidebarOpen;
    },

    setSidebarOpen: (state, action: PayloadAction<boolean>) => {
      state.sidebarOpen = action.payload;
    },

    // Panel management
    setActivePanel: (state, action: PayloadAction<Panel | null>) => {
      state.activePanel = action.payload;
    },

    togglePanel: (state, action: PayloadAction<Panel>) => {
      const panel = action.payload;
      state.activePanel = state.activePanel === panel ? null : panel;
    },

    closePanel: state => {
      state.activePanel = null;
    },

    // Theme management
    setTheme: (state, action: PayloadAction<Theme>) => {
      state.theme = action.payload;
    },

    toggleTheme: state => {
      switch (state.theme) {
        case Theme.LIGHT:
          state.theme = Theme.DARK;
          break;
        case Theme.DARK:
          state.theme = Theme.LIGHT;
          break;
        case Theme.AUTO:
          // For auto theme, we might want to detect system preference
          // For now, just cycle to light
          state.theme = Theme.LIGHT;
          break;
      }
    },

    // Bulk UI settings
    setUIPreferences: (state, action: PayloadAction<Partial<UIState>>) => {
      return { ...state, ...action.payload };
    },

    // Reset UI to defaults
    resetUI: () => {
      return initialState;
    },
  },
});

export default uiSlice;
