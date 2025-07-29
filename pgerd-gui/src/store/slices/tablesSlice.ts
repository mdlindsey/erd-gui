// Tables slice for managing database tables and columns

import { createSlice, PayloadAction, nanoid } from '@reduxjs/toolkit';
import {
  TablesState,
  Table,
  Column,
  Position,
  CreateTablePayload,
  CreateColumnPayload,
} from '../../types';

// Initial state
const initialState: TablesState = {
  byId: {},
  allIds: [],
  selectedIds: [],
  showColumnTypes: true,
  showConstraints: false,
  showIndexes: false,
};

const tablesSlice = createSlice({
  name: 'tables',
  initialState,
  reducers: {
    // Table CRUD operations
    addTable: (state, action: PayloadAction<CreateTablePayload>) => {
      const id = nanoid();
      const table: Table = {
        id,
        name: action.payload.name,
        position: action.payload.position,
        columns: [],
        constraints: [],
        schemaName: action.payload.schemaName,
        comment: action.payload.comment,
      };

      state.byId[id] = table;
      state.allIds.push(id);
    },

    updateTable: (
      state,
      action: PayloadAction<{
        id: string;
        updates: Partial<Omit<Table, 'id' | 'columns'>>;
      }>
    ) => {
      const { id, updates } = action.payload;
      if (state.byId[id]) {
        state.byId[id] = { ...state.byId[id], ...updates };
      }
    },

    deleteTable: (state, action: PayloadAction<string>) => {
      const id = action.payload;
      if (state.byId[id]) {
        delete state.byId[id];
        state.allIds = state.allIds.filter(tableId => tableId !== id);
        state.selectedIds = state.selectedIds.filter(tableId => tableId !== id);
      }
    },

    // Table positioning
    moveTable: (
      state,
      action: PayloadAction<{ id: string; position: Position }>
    ) => {
      const { id, position } = action.payload;
      if (state.byId[id]) {
        state.byId[id].position = position;
      }
    },

    moveMultipleTables: (
      state,
      action: PayloadAction<{
        updates: Array<{ id: string; position: Position }>;
      }>
    ) => {
      action.payload.updates.forEach(({ id, position }) => {
        if (state.byId[id]) {
          state.byId[id].position = position;
        }
      });
    },

    // Table selection
    selectTable: (state, action: PayloadAction<string>) => {
      const id = action.payload;
      if (!state.selectedIds.includes(id)) {
        state.selectedIds.push(id);
      }
    },

    selectTables: (state, action: PayloadAction<string[]>) => {
      state.selectedIds = action.payload;
    },

    deselectTable: (state, action: PayloadAction<string>) => {
      const id = action.payload;
      state.selectedIds = state.selectedIds.filter(tableId => tableId !== id);
    },

    clearSelection: state => {
      state.selectedIds = [];
    },

    toggleTableSelection: (state, action: PayloadAction<string>) => {
      const id = action.payload;
      const index = state.selectedIds.indexOf(id);
      if (index >= 0) {
        state.selectedIds.splice(index, 1);
      } else {
        state.selectedIds.push(id);
      }
    },

    // Column CRUD operations
    addColumn: (state, action: PayloadAction<CreateColumnPayload>) => {
      const { tableId, column } = action.payload;
      const table = state.byId[tableId];
      if (table) {
        const newColumn: Column = {
          id: nanoid(),
          ...column,
        };
        table.columns.push(newColumn);
      }
    },

    updateColumn: (
      state,
      action: PayloadAction<{
        tableId: string;
        columnId: string;
        updates: Partial<Omit<Column, 'id'>>;
      }>
    ) => {
      const { tableId, columnId, updates } = action.payload;
      const table = state.byId[tableId];
      if (table) {
        const columnIndex = table.columns.findIndex(col => col.id === columnId);
        if (columnIndex >= 0) {
          table.columns[columnIndex] = {
            ...table.columns[columnIndex],
            ...updates,
          };
        }
      }
    },

    deleteColumn: (
      state,
      action: PayloadAction<{ tableId: string; columnId: string }>
    ) => {
      const { tableId, columnId } = action.payload;
      const table = state.byId[tableId];
      if (table) {
        table.columns = table.columns.filter(col => col.id !== columnId);
      }
    },

    reorderColumns: (
      state,
      action: PayloadAction<{
        tableId: string;
        startIndex: number;
        endIndex: number;
      }>
    ) => {
      const { tableId, startIndex, endIndex } = action.payload;
      const table = state.byId[tableId];
      if (table) {
        const [removed] = table.columns.splice(startIndex, 1);
        table.columns.splice(endIndex, 0, removed);
      }
    },

    // Bulk operations
    duplicateTable: (
      state,
      action: PayloadAction<{
        id: string;
        position: Position;
        nameSuffix?: string;
      }>
    ) => {
      const { id, position, nameSuffix = '_copy' } = action.payload;
      const originalTable = state.byId[id];
      if (originalTable) {
        const newId = nanoid();
        const newTable: Table = {
          ...originalTable,
          id: newId,
          name: originalTable.name + nameSuffix,
          position,
          columns: originalTable.columns.map(col => ({
            ...col,
            id: nanoid(),
          })),
          constraints: originalTable.constraints.map(constraint => ({
            ...constraint,
            id: nanoid(),
          })),
        };

        state.byId[newId] = newTable;
        state.allIds.push(newId);
      }
    },

    // View settings
    toggleColumnTypes: state => {
      state.showColumnTypes = !state.showColumnTypes;
    },

    setShowColumnTypes: (state, action: PayloadAction<boolean>) => {
      state.showColumnTypes = action.payload;
    },

    toggleConstraints: state => {
      state.showConstraints = !state.showConstraints;
    },

    setShowConstraints: (state, action: PayloadAction<boolean>) => {
      state.showConstraints = action.payload;
    },

    toggleIndexes: state => {
      state.showIndexes = !state.showIndexes;
    },

    setShowIndexes: (state, action: PayloadAction<boolean>) => {
      state.showIndexes = action.payload;
    },

    // Bulk import/export operations
    importTables: (state, action: PayloadAction<Table[]>) => {
      action.payload.forEach(table => {
        // Generate new IDs for imported tables
        const newId = nanoid();
        const newTable: Table = {
          ...table,
          id: newId,
          columns: table.columns.map(col => ({ ...col, id: nanoid() })),
          constraints: table.constraints.map(constraint => ({
            ...constraint,
            id: nanoid(),
          })),
        };

        state.byId[newId] = newTable;
        state.allIds.push(newId);
      });
    },

    // Reset state
    clearAllTables: () => {
      return initialState;
    },
  },
});

export default tablesSlice;
