// Redux selectors for efficient state access

import { createSelector } from '@reduxjs/toolkit';
import type { RootState } from './index';

// Base selectors
export const selectCanvas = (state: RootState) => state.canvas;
export const selectTables = (state: RootState) => state.tables;
export const selectRelationships = (state: RootState) => state.relationships;
export const selectNotes = (state: RootState) => state.notes;
export const selectUsers = (state: RootState) => state.users;
export const selectPermissions = (state: RootState) => state.permissions;
export const selectSchemaBoxes = (state: RootState) => state.schemaBoxes;
export const selectUI = (state: RootState) => state.ui;

// Canvas selectors
export const selectViewport = createSelector(
  [selectCanvas],
  (canvas) => canvas.viewport
);

export const selectGridSettings = createSelector(
  [selectCanvas],
  (canvas) => ({
    visible: canvas.gridVisible,
    snapToGrid: canvas.snapToGrid,
    size: canvas.gridSize,
  })
);

// Table selectors
export const selectAllTables = createSelector(
  [selectTables],
  (tables) => tables.allIds.map(id => tables.byId[id])
);

export const selectSelectedTables = createSelector(
  [selectTables],
  (tables) => tables.selectedIds.map(id => tables.byId[id]).filter(Boolean)
);

export const selectTableById = createSelector(
  [selectTables, (_state: RootState, tableId: string) => tableId],
  (tables, tableId) => tables.byId[tableId]
);

export const selectTablesByIds = createSelector(
  [selectTables, (_state: RootState, tableIds: string[]) => tableIds],
  (tables, tableIds) => tableIds.map(id => tables.byId[id]).filter(Boolean)
);

// Relationship selectors
export const selectAllRelationships = createSelector(
  [selectRelationships],
  (relationships) => relationships.allIds.map(id => relationships.byId[id])
);

export const selectRelationshipsBySourceTable = createSelector(
  [selectRelationships, (_state: RootState, tableId: string) => tableId],
  (relationships, tableId) => 
    (relationships.bySourceTable[tableId] || [])
      .map(id => relationships.byId[id])
      .filter(Boolean)
);

export const selectRelationshipsByTargetTable = createSelector(
  [selectRelationships, (_state: RootState, tableId: string) => tableId],
  (relationships, tableId) => 
    (relationships.byTargetTable[tableId] || [])
      .map(id => relationships.byId[id])
      .filter(Boolean)
);

export const selectRelationshipsByTable = createSelector(
  [selectRelationships, (_state: RootState, tableId: string) => tableId],
  (relationships, tableId) => {
    const source = relationships.bySourceTable[tableId] || [];
    const target = relationships.byTargetTable[tableId] || [];
    const allIds = [...new Set([...source, ...target])];
    return allIds.map(id => relationships.byId[id]).filter(Boolean);
  }
);

// Note selectors
export const selectAllNotes = createSelector(
  [selectNotes],
  (notes) => notes.allIds.map(id => notes.byId[id])
);

export const selectNotesByTable = createSelector(
  [selectNotes, (_state: RootState, tableId: string) => tableId],
  (notes, tableId) => 
    (notes.byTableId[tableId] || [])
      .map(id => notes.byId[id])
      .filter(Boolean)
);

export const selectVisibleNotes = createSelector(
  [selectNotes],
  (notes) => {
    if (notes.showAllNotes) {
      return notes.allIds.map(id => notes.byId[id]);
    }
    return notes.allIds
      .map(id => notes.byId[id])
      .filter(note => !note.collapsed);
  }
);

// User selectors
export const selectAllUsers = createSelector(
  [selectUsers],
  (users) => users.allIds.map(id => users.byId[id])
);

// Permission selectors
export const selectAllPermissions = createSelector(
  [selectPermissions],
  (permissions) => permissions.allIds.map(id => permissions.byId[id])
);

export const selectPermissionsByTable = createSelector(
  [selectPermissions, (_state: RootState, tableId: string) => tableId],
  (permissions, tableId) => 
    (permissions.byTableId[tableId] || [])
      .map(id => permissions.byId[id])
      .filter(Boolean)
);

export const selectPermissionsByUser = createSelector(
  [selectPermissions, (_state: RootState, userId: string) => userId],
  (permissions, userId) => 
    (permissions.byUserId[userId] || [])
      .map(id => permissions.byId[id])
      .filter(Boolean)
);

// Schema box selectors
export const selectAllSchemaBoxes = createSelector(
  [selectSchemaBoxes],
  (schemaBoxes) => schemaBoxes.allIds.map(id => schemaBoxes.byId[id])
);

export const selectSchemaBoxesByTable = createSelector(
  [selectSchemaBoxes, (_state: RootState, tableId: string) => tableId],
  (schemaBoxes, tableId) => 
    schemaBoxes.allIds
      .map(id => schemaBoxes.byId[id])
      .filter(box => box.tableIds.includes(tableId))
);

// Combined selectors
export const selectDiagramBounds = createSelector(
  [selectAllTables, selectAllNotes, selectAllSchemaBoxes],
  (tables, notes, schemaBoxes) => {
    const allElements = [
      ...tables.map(table => ({
        x: table.position.x,
        y: table.position.y,
        width: table.size?.width || 200,
        height: table.size?.height || 100,
      })),
      ...notes.map(note => ({
        x: note.position.x,
        y: note.position.y,
        width: note.size.width,
        height: note.size.height,
      })),
      ...schemaBoxes.map(box => ({
        x: box.position.x,
        y: box.position.y,
        width: box.size.width,
        height: box.size.height,
      })),
    ];

    if (allElements.length === 0) {
      return { x: 0, y: 0, width: 0, height: 0 };
    }

    const minX = Math.min(...allElements.map(el => el.x));
    const minY = Math.min(...allElements.map(el => el.y));
    const maxX = Math.max(...allElements.map(el => el.x + el.width));
    const maxY = Math.max(...allElements.map(el => el.y + el.height));

    return {
      x: minX,
      y: minY,
      width: maxX - minX,
      height: maxY - minY,
    };
  }
);

// UI selectors
export const selectCurrentTool = createSelector(
  [selectUI],
  (ui) => ui.selectedTool
);

export const selectTheme = createSelector(
  [selectUI],
  (ui) => ui.theme
);

export const selectActivePanel = createSelector(
  [selectUI],
  (ui) => ui.activePanel
);

// Search/filter selectors
export const selectTablesByName = createSelector(
  [selectAllTables, (_state: RootState, searchTerm: string) => searchTerm],
  (tables, searchTerm) => {
    if (!searchTerm.trim()) return tables;
    const term = searchTerm.toLowerCase();
    return tables.filter(table => 
      table.name.toLowerCase().includes(term) ||
      table.schemaName?.toLowerCase().includes(term)
    );
  }
);

export const selectColumnsByName = createSelector(
  [selectAllTables, (_state: RootState, searchTerm: string) => searchTerm],
  (tables, searchTerm) => {
    if (!searchTerm.trim()) return [];
    const term = searchTerm.toLowerCase();
    const results: Array<{ table: any; column: any }> = [];
    
    tables.forEach(table => {
      table.columns.forEach(column => {
        if (column.name.toLowerCase().includes(term)) {
          results.push({ table, column });
        }
      });
    });
    
    return results;
  }
);