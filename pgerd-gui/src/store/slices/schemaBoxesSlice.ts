// Schema boxes slice for managing visual grouping containers

import { createSlice, PayloadAction, nanoid } from '@reduxjs/toolkit';
import { SchemaBoxesState, SchemaBox } from '../../types';

const initialState: SchemaBoxesState = {
  byId: {},
  allIds: [],
};

const schemaBoxesSlice = createSlice({
  name: 'schemaBoxes',
  initialState,
  reducers: {
    addSchemaBox: (state, action: PayloadAction<Omit<SchemaBox, 'id'>>) => {
      const id = nanoid();
      const schemaBox: SchemaBox = {
        id,
        ...action.payload,
      };

      state.byId[id] = schemaBox;
      state.allIds.push(id);
    },

    updateSchemaBox: (
      state,
      action: PayloadAction<{
        id: string;
        updates: Partial<Omit<SchemaBox, 'id'>>;
      }>
    ) => {
      const { id, updates } = action.payload;
      if (state.byId[id]) {
        state.byId[id] = { ...state.byId[id], ...updates };
      }
    },

    deleteSchemaBox: (state, action: PayloadAction<string>) => {
      const id = action.payload;
      if (state.byId[id]) {
        delete state.byId[id];
        state.allIds = state.allIds.filter(boxId => boxId !== id);
      }
    },

    moveSchemaBox: (
      state,
      action: PayloadAction<{
        id: string;
        position: { x: number; y: number };
      }>
    ) => {
      const { id, position } = action.payload;
      if (state.byId[id]) {
        state.byId[id].position = position;
      }
    },

    resizeSchemaBox: (
      state,
      action: PayloadAction<{
        id: string;
        size: { width: number; height: number };
      }>
    ) => {
      const { id, size } = action.payload;
      if (state.byId[id]) {
        state.byId[id].size = size;
      }
    },

    addTableToSchemaBox: (
      state,
      action: PayloadAction<{
        schemaBoxId: string;
        tableId: string;
      }>
    ) => {
      const { schemaBoxId, tableId } = action.payload;
      const schemaBox = state.byId[schemaBoxId];
      if (schemaBox && !schemaBox.tableIds.includes(tableId)) {
        schemaBox.tableIds.push(tableId);
      }
    },

    removeTableFromSchemaBox: (
      state,
      action: PayloadAction<{
        schemaBoxId: string;
        tableId: string;
      }>
    ) => {
      const { schemaBoxId, tableId } = action.payload;
      const schemaBox = state.byId[schemaBoxId];
      if (schemaBox) {
        schemaBox.tableIds = schemaBox.tableIds.filter(id => id !== tableId);
      }
    },

    removeTableFromAllSchemaBoxes: (state, action: PayloadAction<string>) => {
      const tableId = action.payload;
      Object.values(state.byId).forEach(schemaBox => {
        schemaBox.tableIds = schemaBox.tableIds.filter(id => id !== tableId);
      });
    },

    clearAllSchemaBoxes: () => {
      return initialState;
    },
  },
});

export default schemaBoxesSlice;
