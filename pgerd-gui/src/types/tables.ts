// Table-related types for Postgres ERD GUI

import { Position, Size, PostgresType } from './index';

export interface Column {
  id: string;
  name: string;
  type: PostgresType;
  nullable: boolean;
  primaryKey: boolean;
  unique: boolean;
  defaultValue?: string;
  comment?: string;
  // Constraint-related properties
  foreignKey?: {
    referencedTableId: string;
    referencedColumnId: string;
  };
  check?: string;
  // Index information
  indexed?: boolean;
  indexType?: IndexType;
}

export interface Table {
  id: string;
  name: string;
  position: Position;
  size?: Size;
  columns: Column[];
  comment?: string;
  schemaName?: string;
  // Table constraints
  constraints: TableConstraint[];
  // Display settings
  collapsed?: boolean;
  color?: string;
}

export interface TableConstraint {
  id: string;
  name: string;
  type: ConstraintType;
  columnIds: string[];
  definition?: string;
}

export enum ConstraintType {
  PRIMARY_KEY = 'primary_key',
  FOREIGN_KEY = 'foreign_key',
  UNIQUE = 'unique',
  CHECK = 'check',
  EXCLUDE = 'exclude'
}

export enum IndexType {
  BTREE = 'btree',
  HASH = 'hash',
  GIST = 'gist',
  SPGIST = 'spgist',
  GIN = 'gin',
  BRIN = 'brin'
}

export interface TablesState {
  byId: Record<string, Table>;
  allIds: string[];
  selectedIds: string[];
  // View settings
  showColumnTypes: boolean;
  showConstraints: boolean;
  showIndexes: boolean;
}

// Table operation payloads
export interface CreateTablePayload {
  name: string;
  position: Position;
  schemaName?: string;
  comment?: string;
}

export interface UpdateTablePayload {
  id: string;
  updates: Partial<Omit<Table, 'id' | 'columns'>>;
}

export interface CreateColumnPayload {
  tableId: string;
  column: Omit<Column, 'id'>;
}

export interface UpdateColumnPayload {
  tableId: string;
  columnId: string;
  updates: Partial<Omit<Column, 'id'>>;
}