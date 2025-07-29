// Note-related types for Postgres ERD GUI

import { Position, Size } from './index';

export interface Note {
  id: string;
  content: string;
  position: Position;
  size: Size;
  collapsed: boolean;
  tableId?: string; // Optional association with a table
  color?: string;
  // Rich text properties
  format: NoteFormat;
  // Metadata
  createdAt: Date;
  updatedAt: Date;
  author?: string;
  // Display properties
  opacity?: number;
  zIndex?: number;
  locked?: boolean;
}

export enum NoteFormat {
  PLAIN_TEXT = 'plain_text',
  MARKDOWN = 'markdown',
  RICH_TEXT = 'rich_text',
}

export interface NotesState {
  byId: Record<string, Note>;
  allIds: string[];
  // Lookup by association
  byTableId: Record<string, string[]>;
  // View settings
  showAllNotes: boolean;
  defaultNoteColor: string;
  defaultNoteSize: Size;
}

// Note operation payloads
export interface CreateNotePayload {
  content: string;
  position: Position;
  size?: Size;
  tableId?: string;
  color?: string;
  format?: NoteFormat;
}

export interface UpdateNotePayload {
  id: string;
  updates: Partial<Omit<Note, 'id' | 'createdAt'>>;
}

// Note template types
export interface NoteTemplate {
  id: string;
  name: string;
  content: string;
  size: Size;
  color: string;
  format: NoteFormat;
}

// Built-in note templates
export const DEFAULT_NOTE_TEMPLATES: NoteTemplate[] = [
  {
    id: 'default',
    name: 'Default Note',
    content: 'Add your notes here...',
    size: { width: 200, height: 100 },
    color: '#ffd700',
    format: NoteFormat.PLAIN_TEXT,
  },
  {
    id: 'table-comment',
    name: 'Table Comment',
    content: 'Table description and business rules...',
    size: { width: 250, height: 120 },
    color: '#98fb98',
    format: NoteFormat.MARKDOWN,
  },
  {
    id: 'schema-info',
    name: 'Schema Information',
    content: '## Schema Notes\n\nPurpose and guidelines...',
    size: { width: 300, height: 150 },
    color: '#87ceeb',
    format: NoteFormat.MARKDOWN,
  },
];
