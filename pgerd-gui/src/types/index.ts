// Core application types for Postgres ERD GUI

// Re-export domain types
export * from './tables';
export * from './relationships';
export * from './notes';

export interface Position {
  x: number;
  y: number;
}

export interface Size {
  width: number;
  height: number;
}

export interface Viewport {
  x: number;
  y: number;
  zoom: number;
}

// Canvas State
export interface CanvasState {
  viewport: Viewport;
  gridVisible: boolean;
  snapToGrid: boolean;
  gridSize: number;
  zoomRange: {
    min: number;
    max: number;
  };
}

// User and Permission Types
export interface User {
  id: string;
  name: string;
  position: Position;
  color?: string;
}

export interface Permission {
  id: string;
  userId: string;
  tableId: string;
  type: PermissionType;
}

export enum PermissionType {
  READ = 'read',
  WRITE = 'write',
  READ_WRITE = 'read_write'
}

// Schema Box Types
export interface SchemaBox {
  id: string;
  name: string;
  position: Position;
  size: Size;
  color: string;
  tableIds: string[];
}

// Postgres Data Types
export enum PostgresType {
  // Numeric Types
  SMALLINT = 'smallint',
  INTEGER = 'integer',
  BIGINT = 'bigint',
  DECIMAL = 'decimal',
  NUMERIC = 'numeric',
  REAL = 'real',
  DOUBLE_PRECISION = 'double precision',
  SMALLSERIAL = 'smallserial',
  SERIAL = 'serial',
  BIGSERIAL = 'bigserial',
  
  // Character Types
  CHARACTER = 'character',
  CHARACTER_VARYING = 'character varying',
  TEXT = 'text',
  
  // Binary Types
  BYTEA = 'bytea',
  
  // Date/Time Types
  TIMESTAMP = 'timestamp',
  TIMESTAMP_WITH_TIMEZONE = 'timestamp with time zone',
  DATE = 'date',
  TIME = 'time',
  TIME_WITH_TIMEZONE = 'time with time zone',
  INTERVAL = 'interval',
  
  // Boolean Type
  BOOLEAN = 'boolean',
  
  // Enumerated Types
  ENUM = 'enum',
  
  // Geometric Types
  POINT = 'point',
  LINE = 'line',
  LSEG = 'lseg',
  BOX = 'box',
  PATH = 'path',
  POLYGON = 'polygon',
  CIRCLE = 'circle',
  
  // Network Address Types
  CIDR = 'cidr',
  INET = 'inet',
  MACADDR = 'macaddr',
  MACADDR8 = 'macaddr8',
  
  // Bit String Types
  BIT = 'bit',
  BIT_VARYING = 'bit varying',
  
  // Text Search Types
  TSVECTOR = 'tsvector',
  TSQUERY = 'tsquery',
  
  // UUID Type
  UUID = 'uuid',
  
  // XML Type
  XML = 'xml',
  
  // JSON Types
  JSON = 'json',
  JSONB = 'jsonb',
  
  // Arrays
  ARRAY = 'array',
  
  // Range Types
  INT4RANGE = 'int4range',
  INT8RANGE = 'int8range',
  NUMRANGE = 'numrange',
  TSRANGE = 'tsrange',
  TSTZRANGE = 'tstzrange',
  DATERANGE = 'daterange'
}

export interface UsersState {
  byId: Record<string, User>;
  allIds: string[];
}

export interface PermissionsState {
  byId: Record<string, Permission>;
  allIds: string[];
  byTableId: Record<string, string[]>;
  byUserId: Record<string, string[]>;
}

export interface SchemaBoxesState {
  byId: Record<string, SchemaBox>;
  allIds: string[];
}

export interface UIState {
  selectedTool: Tool;
  showColumnTypes: boolean;
  sidebarOpen: boolean;
  activePanel: Panel | null;
  theme: Theme;
}

export enum Tool {
  SELECT = 'select',
  TABLE = 'table',
  RELATIONSHIP = 'relationship',
  NOTE = 'note',
  USER = 'user',
  SCHEMA_BOX = 'schema_box'
}

export enum Panel {
  PROPERTIES = 'properties',
  LAYERS = 'layers',
  EXPORT = 'export'
}

export enum Theme {
  LIGHT = 'light',
  DARK = 'dark',
  AUTO = 'auto'
}

// Application State - importing types from domain files
export interface AppState {
  canvas: CanvasState;
  tables: import('./tables').TablesState;
  relationships: import('./relationships').RelationshipsState;
  notes: import('./notes').NotesState;
  users: UsersState;
  permissions: PermissionsState;
  schemaBoxes: SchemaBoxesState;
  ui: UIState;
}

// Abstract Service Interface
export abstract class StateService {
  // Canvas operations
  abstract updateViewport(viewport: Partial<Viewport>): void;
  abstract toggleGrid(): void;
  abstract toggleSnapToGrid(): void;
  
  // Table operations
  abstract addTable(table: Omit<import('./tables').Table, 'id'>): string;
  abstract updateTable(id: string, updates: Partial<import('./tables').Table>): void;
  abstract deleteTable(id: string): void;
  abstract selectTables(ids: string[]): void;
  abstract moveTable(id: string, position: Position): void;
  
  // Column operations
  abstract addColumn(tableId: string, column: Omit<import('./tables').Column, 'id'>): string;
  abstract updateColumn(tableId: string, columnId: string, updates: Partial<import('./tables').Column>): void;
  abstract deleteColumn(tableId: string, columnId: string): void;
  
  // Relationship operations
  abstract addRelationship(relationship: Omit<import('./relationships').Relationship, 'id'>): string;
  abstract updateRelationship(id: string, updates: Partial<import('./relationships').Relationship>): void;
  abstract deleteRelationship(id: string): void;
  
  // Note operations
  abstract addNote(note: Omit<import('./notes').Note, 'id'>): string;
  abstract updateNote(id: string, updates: Partial<import('./notes').Note>): void;
  abstract deleteNote(id: string): void;
  
  // User operations
  abstract addUser(user: Omit<User, 'id'>): string;
  abstract updateUser(id: string, updates: Partial<User>): void;
  abstract deleteUser(id: string): void;
  
  // Permission operations
  abstract addPermission(permission: Omit<Permission, 'id'>): string;
  abstract updatePermission(id: string, updates: Partial<Permission>): void;
  abstract deletePermission(id: string): void;
  
  // Schema box operations
  abstract addSchemaBox(schemaBox: Omit<SchemaBox, 'id'>): string;
  abstract updateSchemaBox(id: string, updates: Partial<SchemaBox>): void;
  abstract deleteSchemaBox(id: string): void;
  
  // UI operations
  abstract setSelectedTool(tool: Tool): void;
  abstract toggleColumnTypes(): void;
  abstract toggleSidebar(): void;
  abstract setActivePanel(panel: Panel | null): void;
  abstract setTheme(theme: Theme): void;
  
  // State access
  abstract getState(): AppState;
  abstract subscribe(listener: (state: AppState) => void): () => void;
}