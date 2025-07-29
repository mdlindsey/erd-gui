// Concrete Redux implementation of StateService

import { Store } from '@reduxjs/toolkit';
import { 
  StateService, 
  AppState, 
  Viewport, 
  Position, 
  Tool, 
  Panel, 
  Theme 
} from '../types';
import {
  RootState,
  canvasActions,
  tablesActions,
  relationshipsActions,
  notesActions,
  usersActions,
  permissionsActions,
  schemaBoxesActions,
  uiActions,
} from '../store';
import type { Table, Column } from '../types/tables';
import type { Relationship } from '../types/relationships';
import type { Note } from '../types/notes';

export class ReduxStateService extends StateService {
  private store: Store<RootState>;
  private listeners: Set<(state: AppState) => void> = new Set();

  constructor(store: Store<RootState>) {
    super();
    this.store = store;
    
    // Subscribe to store changes and notify our listeners
    this.store.subscribe(() => {
      const state = this.getState();
      this.listeners.forEach(listener => listener(state));
    });
  }

  // Canvas operations
  updateViewport(viewport: Partial<Viewport>): void {
    this.store.dispatch(canvasActions.updateViewport(viewport));
  }

  toggleGrid(): void {
    this.store.dispatch(canvasActions.toggleGrid());
  }

  toggleSnapToGrid(): void {
    this.store.dispatch(canvasActions.toggleSnapToGrid());
  }

  // Table operations
  addTable(table: Omit<Table, 'id'>): string {
    this.store.dispatch(tablesActions.addTable({
      name: table.name,
      position: table.position,
      schemaName: table.schemaName,
      comment: table.comment,
    }));
    
    // Get the generated ID from the state
    const state = this.store.getState();
    return state.tables.allIds[state.tables.allIds.length - 1];
  }

  updateTable(id: string, updates: Partial<Table>): void {
    this.store.dispatch(tablesActions.updateTable({ id, updates }));
  }

  deleteTable(id: string): void {
    // Clean up related data first
    this.store.dispatch(relationshipsActions.deleteRelationshipsByTable(id));
    this.store.dispatch(notesActions.deleteNotesByTable(id));
    this.store.dispatch(permissionsActions.deletePermissionsByTable(id));
    this.store.dispatch(schemaBoxesActions.removeTableFromAllSchemaBoxes(id));
    
    // Then delete the table
    this.store.dispatch(tablesActions.deleteTable(id));
  }

  selectTables(ids: string[]): void {
    this.store.dispatch(tablesActions.selectTables(ids));
  }

  moveTable(id: string, position: Position): void {
    this.store.dispatch(tablesActions.moveTable({ id, position }));
  }

  // Column operations
  addColumn(tableId: string, column: Omit<Column, 'id'>): string {
    this.store.dispatch(tablesActions.addColumn({ tableId, column }));
    
    // Get the generated ID from the state
    const state = this.store.getState();
    const table = state.tables.byId[tableId];
    if (table && table.columns.length > 0) {
      return table.columns[table.columns.length - 1].id;
    }
    throw new Error(`Failed to add column to table ${tableId}`);
  }

  updateColumn(tableId: string, columnId: string, updates: Partial<Column>): void {
    this.store.dispatch(tablesActions.updateColumn({ tableId, columnId, updates }));
  }

  deleteColumn(tableId: string, columnId: string): void {
    // Clean up relationships that use this column
    const state = this.store.getState();
    const relationshipsToDelete = state.relationships.allIds.filter(relId => {
      const rel = state.relationships.byId[relId];
      return (rel.sourceTableId === tableId && rel.sourceColumnId === columnId) ||
             (rel.targetTableId === tableId && rel.targetColumnId === columnId);
    });
    
    relationshipsToDelete.forEach(relId => {
      this.store.dispatch(relationshipsActions.deleteRelationship(relId));
    });
    
    this.store.dispatch(tablesActions.deleteColumn({ tableId, columnId }));
  }

  // Relationship operations
  addRelationship(relationship: Omit<Relationship, 'id'>): string {
    this.store.dispatch(relationshipsActions.addRelationship({
      sourceTableId: relationship.sourceTableId,
      targetTableId: relationship.targetTableId,
      sourceColumnId: relationship.sourceColumnId,
      targetColumnId: relationship.targetColumnId,
      type: relationship.type,
      onDelete: relationship.onDelete,
      onUpdate: relationship.onUpdate,
      name: relationship.name,
    }));
    
    // Get the generated ID from the state
    const state = this.store.getState();
    return state.relationships.allIds[state.relationships.allIds.length - 1];
  }

  updateRelationship(id: string, updates: Partial<Relationship>): void {
    this.store.dispatch(relationshipsActions.updateRelationship({ id, updates }));
  }

  deleteRelationship(id: string): void {
    this.store.dispatch(relationshipsActions.deleteRelationship(id));
  }

  // Note operations
  addNote(note: Omit<Note, 'id'>): string {
    this.store.dispatch(notesActions.addNote({
      content: note.content,
      position: note.position,
      size: note.size,
      tableId: note.tableId,
      color: note.color,
      format: note.format,
    }));
    
    // Get the generated ID from the state
    const state = this.store.getState();
    return state.notes.allIds[state.notes.allIds.length - 1];
  }

  updateNote(id: string, updates: Partial<Note>): void {
    this.store.dispatch(notesActions.updateNote({ id, updates }));
  }

  deleteNote(id: string): void {
    this.store.dispatch(notesActions.deleteNote(id));
  }

  // User operations
  addUser(user: Omit<import('../types').User, 'id'>): string {
    this.store.dispatch(usersActions.addUser(user));
    
    // Get the generated ID from the state
    const state = this.store.getState();
    return state.users.allIds[state.users.allIds.length - 1];
  }

  updateUser(id: string, updates: Partial<import('../types').User>): void {
    this.store.dispatch(usersActions.updateUser({ id, updates }));
  }

  deleteUser(id: string): void {
    // Clean up user permissions first
    this.store.dispatch(permissionsActions.deletePermissionsByUser(id));
    this.store.dispatch(usersActions.deleteUser(id));
  }

  // Permission operations
  addPermission(permission: Omit<import('../types').Permission, 'id'>): string {
    this.store.dispatch(permissionsActions.addPermission(permission));
    
    // Get the generated ID from the state
    const state = this.store.getState();
    return state.permissions.allIds[state.permissions.allIds.length - 1];
  }

  updatePermission(id: string, updates: Partial<import('../types').Permission>): void {
    this.store.dispatch(permissionsActions.updatePermission({ id, updates }));
  }

  deletePermission(id: string): void {
    this.store.dispatch(permissionsActions.deletePermission(id));
  }

  // Schema box operations
  addSchemaBox(schemaBox: Omit<import('../types').SchemaBox, 'id'>): string {
    this.store.dispatch(schemaBoxesActions.addSchemaBox(schemaBox));
    
    // Get the generated ID from the state
    const state = this.store.getState();
    return state.schemaBoxes.allIds[state.schemaBoxes.allIds.length - 1];
  }

  updateSchemaBox(id: string, updates: Partial<import('../types').SchemaBox>): void {
    this.store.dispatch(schemaBoxesActions.updateSchemaBox({ id, updates }));
  }

  deleteSchemaBox(id: string): void {
    this.store.dispatch(schemaBoxesActions.deleteSchemaBox(id));
  }

  // UI operations
  setSelectedTool(tool: Tool): void {
    this.store.dispatch(uiActions.setSelectedTool(tool));
  }

  toggleColumnTypes(): void {
    this.store.dispatch(uiActions.toggleColumnTypes());
  }

  toggleSidebar(): void {
    this.store.dispatch(uiActions.toggleSidebar());
  }

  setActivePanel(panel: Panel | null): void {
    this.store.dispatch(uiActions.setActivePanel(panel));
  }

  setTheme(theme: Theme): void {
    this.store.dispatch(uiActions.setTheme(theme));
  }

  // State access
  getState(): AppState {
    const state = this.store.getState();
    
    // Transform Redux state to match AppState interface
    return {
      canvas: state.canvas,
      tables: state.tables,
      relationships: state.relationships,
      notes: state.notes,
      users: state.users,
      permissions: state.permissions,
      schemaBoxes: state.schemaBoxes,
      ui: state.ui,
    };
  }

  subscribe(listener: (state: AppState) => void): () => void {
    this.listeners.add(listener);
    
    // Return unsubscribe function
    return () => {
      this.listeners.delete(listener);
    };
  }

  // Additional utility methods for complex operations
  duplicateTable(id: string, position: Position, nameSuffix?: string): string {
    this.store.dispatch(tablesActions.duplicateTable({ id, position, nameSuffix }));
    
    const state = this.store.getState();
    return state.tables.allIds[state.tables.allIds.length - 1];
  }

  moveMultipleTables(updates: Array<{ id: string; position: Position }>): void {
    this.store.dispatch(tablesActions.moveMultipleTables({ updates }));
  }

  fitToView(viewportSize: { width: number; height: number }, padding = 50): void {
    const state = this.store.getState();
    const tables = state.tables.allIds.map(id => state.tables.byId[id]);
    const notes = state.notes.allIds.map(id => state.notes.byId[id]);
    
    if (tables.length === 0 && notes.length === 0) {
      return;
    }

    // Calculate bounds
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
    ];

    const minX = Math.min(...allElements.map(el => el.x));
    const minY = Math.min(...allElements.map(el => el.y));
    const maxX = Math.max(...allElements.map(el => el.x + el.width));
    const maxY = Math.max(...allElements.map(el => el.y + el.height));

    const bounds = {
      x: minX,
      y: minY,
      width: maxX - minX,
      height: maxY - minY,
    };

    this.store.dispatch(canvasActions.fitToView({ bounds, viewportSize, padding }));
  }

  // Bulk operations
  clearAll(): void {
    this.store.dispatch(permissionsActions.clearAllPermissions());
    this.store.dispatch(relationshipsActions.clearAllRelationships());
    this.store.dispatch(notesActions.clearAllNotes());
    this.store.dispatch(tablesActions.clearAllTables());
    this.store.dispatch(usersActions.clearAllUsers());
    this.store.dispatch(schemaBoxesActions.clearAllSchemaBoxes());
    this.store.dispatch(canvasActions.resetCanvas());
    this.store.dispatch(uiActions.resetUI());
  }
}