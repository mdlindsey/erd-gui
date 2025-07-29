// Relationship-related types for Postgres ERD GUI

export interface Relationship {
  id: string;
  sourceTableId: string;
  targetTableId: string;
  sourceColumnId: string;
  targetColumnId: string;
  type: RelationshipType;
  onDelete: CascadeAction;
  onUpdate: CascadeAction;
  name?: string;
  // Visual properties
  controlPoints?: ControlPoint[];
  style?: LineStyle;
  color?: string;
  // Constraint properties
  enforced: boolean;
  deferrable?: boolean;
  deferred?: boolean;
}

export interface ControlPoint {
  id: string;
  x: number;
  y: number;
  type: ControlPointType;
}

export enum ControlPointType {
  BEND = 'bend',
  ANCHOR = 'anchor'
}

export enum RelationshipType {
  ONE_TO_ONE = 'one-to-one',
  ONE_TO_MANY = 'one-to-many',
  MANY_TO_MANY = 'many-to-many',
  // Additional relationship types
  SELF_REFERENCING = 'self-referencing',
  IDENTIFYING = 'identifying',
  NON_IDENTIFYING = 'non-identifying'
}

export enum CascadeAction {
  CASCADE = 'CASCADE',
  SET_NULL = 'SET NULL',
  SET_DEFAULT = 'SET DEFAULT',
  RESTRICT = 'RESTRICT',
  NO_ACTION = 'NO ACTION'
}

export enum LineStyle {
  SOLID = 'solid',
  DASHED = 'dashed',
  DOTTED = 'dotted'
}

export interface RelationshipsState {
  byId: Record<string, Relationship>;
  allIds: string[];
  // Lookup tables for performance
  bySourceTable: Record<string, string[]>;
  byTargetTable: Record<string, string[]>;
  // View settings
  showRelationshipNames: boolean;
  showCascadeActions: boolean;
}

// Relationship operation payloads
export interface CreateRelationshipPayload {
  sourceTableId: string;
  targetTableId: string;
  sourceColumnId: string;
  targetColumnId: string;
  type: RelationshipType;
  onDelete?: CascadeAction;
  onUpdate?: CascadeAction;
  name?: string;
}

export interface UpdateRelationshipPayload {
  id: string;
  updates: Partial<Omit<Relationship, 'id'>>;
}

// Helper types for relationship validation
export interface RelationshipValidation {
  isValid: boolean;
  errors: string[];
  warnings: string[];
}

export interface RelationshipSuggestion {
  sourceTableId: string;
  targetTableId: string;
  sourceColumnId: string;
  targetColumnId: string;
  confidence: number;
  reason: string;
}