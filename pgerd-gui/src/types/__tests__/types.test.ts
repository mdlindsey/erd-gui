// Test file to verify type compatibility and compilation

import { describe, it, expect } from 'vitest';
import type {
  AppState,
  CanvasState,
  Position,
  Size,
  Viewport,
  PostgresType,
  Tool,
  Theme,
  StateService
} from '../index';
import type { Table, Column, TablesState } from '../tables';
import type { Relationship, RelationshipType, CascadeAction } from '../relationships';
import type { Note, NoteFormat } from '../notes';

describe('Type Definitions', () => {
  it('should compile Position interface', () => {
    const position: Position = { x: 100, y: 200 };
    expect(position.x).toBe(100);
    expect(position.y).toBe(200);
  });

  it('should compile Size interface', () => {
    const size: Size = { width: 300, height: 400 };
    expect(size.width).toBe(300);
    expect(size.height).toBe(400);
  });

  it('should compile Viewport interface', () => {
    const viewport: Viewport = { x: 0, y: 0, zoom: 1 };
    expect(viewport.zoom).toBe(1);
  });

  it('should compile CanvasState interface', () => {
    const canvasState: CanvasState = {
      viewport: { x: 0, y: 0, zoom: 1 },
      gridVisible: true,
      snapToGrid: false,
      gridSize: 15,
      zoomRange: { min: 0.25, max: 4 }
    };
    expect(canvasState.gridSize).toBe(15);
  });

  it('should compile Column interface', () => {
    const column: Column = {
      id: 'col1',
      name: 'user_id',
      type: PostgresType.INTEGER,
      nullable: false,
      primaryKey: true,
      unique: true,
      constraints: []
    };
    expect(column.type).toBe(PostgresType.INTEGER);
  });

  it('should compile Table interface', () => {
    const table: Table = {
      id: 'table1',
      name: 'users',
      position: { x: 100, y: 100 },
      columns: [],
      constraints: []
    };
    expect(table.name).toBe('users');
  });

  it('should compile Relationship interface', () => {
    const relationship: Relationship = {
      id: 'rel1',
      sourceTableId: 'table1',
      targetTableId: 'table2',
      sourceColumnId: 'col1',
      targetColumnId: 'col2',
      type: RelationshipType.ONE_TO_MANY,
      onDelete: CascadeAction.CASCADE,
      onUpdate: CascadeAction.CASCADE,
      enforced: true
    };
    expect(relationship.type).toBe(RelationshipType.ONE_TO_MANY);
  });

  it('should compile Note interface', () => {
    const note: Note = {
      id: 'note1',
      content: 'Test note',
      position: { x: 50, y: 50 },
      size: { width: 200, height: 100 },
      collapsed: false,
      format: NoteFormat.PLAIN_TEXT,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    expect(note.content).toBe('Test note');
  });

  it('should compile AppState interface', () => {
    const appState: Partial<AppState> = {
      canvas: {
        viewport: { x: 0, y: 0, zoom: 1 },
        gridVisible: true,
        snapToGrid: false,
        gridSize: 15,
        zoomRange: { min: 0.25, max: 4 }
      },
      tables: {
        byId: {},
        allIds: [],
        selectedIds: [],
        showColumnTypes: true,
        showConstraints: false,
        showIndexes: false
      }
    };
    expect(appState.canvas?.gridSize).toBe(15);
  });

  it('should validate enum values', () => {
    expect(PostgresType.INTEGER).toBe('integer');
    expect(RelationshipType.ONE_TO_MANY).toBe('one-to-many');
    expect(CascadeAction.CASCADE).toBe('CASCADE');
    expect(NoteFormat.MARKDOWN).toBe('markdown');
    expect(Tool.TABLE).toBe('table');
    expect(Theme.DARK).toBe('dark');
  });
});

// Mock implementation to test StateService abstract class
class TestStateService extends StateService {
  private state: AppState = {} as AppState;
  private listeners: ((state: AppState) => void)[] = [];

  updateViewport(viewport: Partial<Viewport>): void {
    // Mock implementation
  }

  toggleGrid(): void {
    // Mock implementation
  }

  toggleSnapToGrid(): void {
    // Mock implementation
  }

  addTable(table: Omit<Table, 'id'>): string {
    return 'new-table-id';
  }

  updateTable(id: string, updates: Partial<Table>): void {
    // Mock implementation
  }

  deleteTable(id: string): void {
    // Mock implementation
  }

  selectTables(ids: string[]): void {
    // Mock implementation
  }

  moveTable(id: string, position: Position): void {
    // Mock implementation
  }

  addColumn(tableId: string, column: Omit<Column, 'id'>): string {
    return 'new-column-id';
  }

  updateColumn(tableId: string, columnId: string, updates: Partial<Column>): void {
    // Mock implementation
  }

  deleteColumn(tableId: string, columnId: string): void {
    // Mock implementation
  }

  addRelationship(relationship: Omit<Relationship, 'id'>): string {
    return 'new-relationship-id';
  }

  updateRelationship(id: string, updates: Partial<Relationship>): void {
    // Mock implementation
  }

  deleteRelationship(id: string): void {
    // Mock implementation
  }

  addNote(note: Omit<Note, 'id'>): string {
    return 'new-note-id';
  }

  updateNote(id: string, updates: Partial<Note>): void {
    // Mock implementation
  }

  deleteNote(id: string): void {
    // Mock implementation
  }

  addUser(user: any): string {
    return 'new-user-id';
  }

  updateUser(id: string, updates: any): void {
    // Mock implementation
  }

  deleteUser(id: string): void {
    // Mock implementation
  }

  addPermission(permission: any): string {
    return 'new-permission-id';
  }

  updatePermission(id: string, updates: any): void {
    // Mock implementation
  }

  deletePermission(id: string): void {
    // Mock implementation
  }

  addSchemaBox(schemaBox: any): string {
    return 'new-schema-box-id';
  }

  updateSchemaBox(id: string, updates: any): void {
    // Mock implementation
  }

  deleteSchemaBox(id: string): void {
    // Mock implementation
  }

  setSelectedTool(tool: Tool): void {
    // Mock implementation
  }

  toggleColumnTypes(): void {
    // Mock implementation
  }

  toggleSidebar(): void {
    // Mock implementation
  }

  setActivePanel(panel: any): void {
    // Mock implementation
  }

  setTheme(theme: Theme): void {
    // Mock implementation
  }

  getState(): AppState {
    return this.state;
  }

  subscribe(listener: (state: AppState) => void): () => void {
    this.listeners.push(listener);
    return () => {
      const index = this.listeners.indexOf(listener);
      if (index > -1) {
        this.listeners.splice(index, 1);
      }
    };
  }
}

describe('StateService Abstract Class', () => {
  it('should be implementable', () => {
    const service = new TestStateService();
    expect(service).toBeInstanceOf(TestStateService);
    expect(service.getState()).toBeDefined();
  });
});