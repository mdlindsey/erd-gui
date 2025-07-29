// Service layer tests

import { createStateService, ServiceFactory, ReduxStateService } from '../index';
import { store } from '../../store';
import { PostgresType } from '../../types';

describe('Service Layer', () => {
  beforeEach(() => {
    // Clear services before each test
    ServiceFactory.getInstance().clearServices();
  });

  describe('ServiceFactory', () => {
    it('should create Redux service with store', () => {
      const service = createStateService({
        type: 'redux',
        store,
      });

      expect(service).toBeInstanceOf(ReduxStateService);
      expect(ServiceFactory.getInstance().getCurrentService()).toBe(service);
    });

    it('should throw error for missing store in Redux service', () => {
      expect(() => {
        createStateService({
          type: 'redux',
          // Missing store
        });
      }).toThrow('Redux store is required for Redux service');
    });

    it('should maintain singleton pattern', () => {
      const factory1 = ServiceFactory.getInstance();
      const factory2 = ServiceFactory.getInstance();
      expect(factory1).toBe(factory2);
    });
  });

  describe('ReduxStateService', () => {
    let service: ReduxStateService;

    beforeEach(() => {
      service = createStateService({
        type: 'redux',
        store,
      }) as ReduxStateService;
    });

    it('should provide initial state', () => {
      const state = service.getState();
      
      expect(state).toBeDefined();
      expect(state.canvas).toBeDefined();
      expect(state.tables).toBeDefined();
      expect(state.relationships).toBeDefined();
      expect(state.notes).toBeDefined();
      expect(state.ui).toBeDefined();
    });

    it('should manage tables', () => {
      // Add a table
      const tableId = service.addTable({
        name: 'Test Table',
        position: { x: 100, y: 200 },
        columns: [],
        constraints: [],
      });

      expect(tableId).toBeDefined();

      const state = service.getState();
      expect(state.tables.allIds).toContain(tableId);
      expect(state.tables.byId[tableId]).toEqual({
        id: tableId,
        name: 'Test Table',
        position: { x: 100, y: 200 },
        columns: [],
        constraints: [],
        schemaName: undefined,
        comment: undefined,
      });

      // Update table
      service.updateTable(tableId, { name: 'Updated Table' });
      const updatedState = service.getState();
      expect(updatedState.tables.byId[tableId].name).toBe('Updated Table');

      // Delete table
      service.deleteTable(tableId);
      const finalState = service.getState();
      expect(finalState.tables.allIds).not.toContain(tableId);
      expect(finalState.tables.byId[tableId]).toBeUndefined();
    });

    it('should manage columns', () => {
      // First add a table
      const tableId = service.addTable({
        name: 'Test Table',
        position: { x: 100, y: 200 },
        columns: [],
        constraints: [],
      });

      // Add a column
      const columnId = service.addColumn(tableId, {
        name: 'id',
        type: PostgresType.INTEGER,
        nullable: false,
        primaryKey: true,
        unique: true,
      });

      expect(columnId).toBeDefined();

      const state = service.getState();
      const table = state.tables.byId[tableId];
      expect(table.columns).toHaveLength(1);
      expect(table.columns[0]).toEqual({
        id: columnId,
        name: 'id',
        type: PostgresType.INTEGER,
        nullable: false,
        primaryKey: true,
        unique: true,
      });

      // Update column
      service.updateColumn(tableId, columnId, { name: 'user_id' });
      const updatedState = service.getState();
      const updatedTable = updatedState.tables.byId[tableId];
      expect(updatedTable.columns[0].name).toBe('user_id');

      // Delete column
      service.deleteColumn(tableId, columnId);
      const finalState = service.getState();
      const finalTable = finalState.tables.byId[tableId];
      expect(finalTable.columns).toHaveLength(0);
    });

    it('should manage canvas state', () => {
      // Test viewport updates
      service.updateViewport({ x: 50, y: 100, zoom: 1.5 });
      
      const state = service.getState();
      expect(state.canvas.viewport).toEqual({
        x: 50,
        y: 100,
        zoom: 1.5,
      });

      // Test grid toggle
      const initialGridVisible = state.canvas.gridVisible;
      service.toggleGrid();
      
      const updatedState = service.getState();
      expect(updatedState.canvas.gridVisible).toBe(!initialGridVisible);
    });

    it('should manage UI state', () => {
      // Test tool selection
      service.setSelectedTool('table' as any);
      
      const state = service.getState();
      expect(state.ui.selectedTool).toBe('table');

      // Test sidebar toggle
      const initialSidebarOpen = state.ui.sidebarOpen;
      service.toggleSidebar();
      
      const updatedState = service.getState();
      expect(updatedState.ui.sidebarOpen).toBe(!initialSidebarOpen);
    });

    it('should handle subscriptions', () => {
      let callCount = 0;
      let lastState: any;

      const unsubscribe = service.subscribe((state) => {
        callCount++;
        lastState = state;
      });

      // Trigger a state change
      service.toggleGrid();
      
      expect(callCount).toBeGreaterThan(0);
      expect(lastState).toBeDefined();
      expect(lastState.canvas).toBeDefined();

      // Unsubscribe should stop notifications
      unsubscribe();
      const previousCallCount = callCount;
      
      service.toggleGrid();
      expect(callCount).toBe(previousCallCount);
    });

    it('should handle complex operations with cleanup', () => {
      // Add a table with columns
      const tableId = service.addTable({
        name: 'Users',
        position: { x: 0, y: 0 },
        columns: [],
        constraints: [],
      });

      const columnId = service.addColumn(tableId, {
        name: 'id',
        type: PostgresType.INTEGER,
        nullable: false,
        primaryKey: true,
        unique: true,
      });

      // Add a note associated with the table
      const noteId = service.addNote({
        content: 'Table note',
        position: { x: 100, y: 100 },
        size: { width: 200, height: 100 },
        collapsed: false,
        tableId,
        format: 'plain_text' as any,
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      // Verify everything was created
      let state = service.getState();
      expect(state.tables.allIds).toContain(tableId);
      expect(state.notes.allIds).toContain(noteId);
      expect(state.notes.byId[noteId].tableId).toBe(tableId);

      // Delete the table - should clean up related data
      service.deleteTable(tableId);

      state = service.getState();
      expect(state.tables.allIds).not.toContain(tableId);
      expect(state.notes.allIds).not.toContain(noteId);
    });
  });

  describe('Error Handling', () => {
    let service: ReduxStateService;

    beforeEach(() => {
      service = createStateService({
        type: 'redux',
        store,
      }) as ReduxStateService;
    });

    it('should throw error when adding column to non-existent table', () => {
      expect(() => {
        service.addColumn('non-existent-table', {
          name: 'test',
          type: PostgresType.TEXT,
          nullable: true,
          primaryKey: false,
          unique: false,
        });
      }).toThrow('Failed to add column to table non-existent-table');
    });
  });
});

// Integration test for service patterns
describe('Service Integration', () => {
  it('should demonstrate service abstraction benefits', () => {
    // Create first service instance
    const service1 = createStateService({
      type: 'redux',
      store,
    });

    service1.addTable({
      name: 'Table 1',
      position: { x: 0, y: 0 },
      columns: [],
      constraints: [],
    });

    const state1 = service1.getState();
    expect(state1.tables.allIds).toHaveLength(1);

    // The abstraction allows for easy testing and swapping of implementations
    // Future implementations could include:
    // - Mock service for testing
    // - In-memory service for performance
    // - API-based service for server sync
    // - Local storage service for persistence

    console.log('Service abstraction successfully demonstrated');
    console.log('Current implementation: Redux-based');
    console.log('Tables in state:', state1.tables.allIds.length);
  });
});