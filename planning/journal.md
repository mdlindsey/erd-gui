# Postgres ERD GUI

The vision is to provide the superlative online GUI tool for database design; it will be the most feature-rich, performant, user-friendly option available and it will be hosted 100% free-to-use as it will be designed from the ground up to be client-side only.

The inspiration came from using pgAdmin's ERD tool and realizing I didn't want to have to download this application, establish a connection, and so forth just to design my database. Then I looked online and saw every option required sign-up so I wanted to offer an alternative - ie: the browser-based pgAdmin ERD tool clone.

Screenshots of the core functionality required for our app can be found in `/planning/images` and example output can be found in `/planning/samples` which contains the minified `design.pgerd` and the human-readable version of the same file converted to json format for syntax highlighting named `design.pgerd.formatted.json`.

This should be built with React TypeScript. Initially this will be built without NextJS or other major frameworks, but it should be designed in such a way that conversion to these later is simple and easy.

This will be 100% open source so code hygeine, styling, and ease of contribution are just as important as the core functionality; ie: developer experience is just as important as user experience.

The rest of this doc will serve as a decision log and documentation for future contributors to onboard and digest background context quickly enabling rapid contribution. For this reason, there must be a deeply thoughtful balance of being succinct and easy to read without leaving out any critical information.

## Product Requirements

July 28, 2025 @ 10:45pm

### Core Functionality

The most obvious functionality shown in the screenshots found in `/planning/images` is:
- Create new projects from scratch or import either a file or copy/paste
- Create/modify tables
- Ability to leave notes similar to sticky notes on tables etc that must be clicked to be expanded
- Ability to drag/drop/move tables and have connector lines automatically and cleanly update
- Ability to export to `.pgerd` format
- Create draggable/resizable colored boxes to indicate schema boundaries

### Table Creator/Editor Requirements

The table creator/editor must be capable of:
- Showing foreign key relationships with connector lines
- Allow connector lines to be moved/adjusted/bent/etc
- Support all supported Postgres column types
- Supporting adding/removing constraints (foreign keys, indexes, etc)
- Support showing/hiding column types in the table's GUI box

### User Management

- **User Entities**: Create user boxes visually distinct from database tables (different colors)
- **Permission Lines**: Show read/write permissions as connecting lines between users and tables
- **Visual Distinction**: 
  - Default: dashed lines for read access, solid lines for write access
  - Lines should be visually distinct from database relationship lines
- **Table-Level Permissions**: Support read, write, or both permissions per user-table pair

### Schema Visualization

- **Schema Boxes**: Create draggable and resizable colored boxes
- **Labels**: Allow adding labels to schema boxes
- **Visual Grouping**: Users can resize boxes to include whatever tables they want inside
- **No Logical Binding**: Boxes are purely visual grouping, not tied to actual database schemas

### Canvas and Navigation

- **Zoom Controls**: Support zoom in/out with mouse wheel and zoom controls (zoom range: 25% to 400%)
- **Pan Controls**: Allow dragging the canvas background to pan around
- **Grid System**: Implement a 15px grid with optional snap-to-grid functionality
- **Viewport Management**: Support offset positioning and viewport state persistence

### Data Management

- **Local Storage**: Save work in progress to browser local storage automatically
- **Import/Export**: 
  - Import: `.pgerd` files, copy/paste JSON
  - Export: `.pgerd` format (minified JSON)
- **Data Validation**: Validate foreign key relationships and table references

### Visual Configuration

- **Configurable Elements**: All visual components should be configurable (line styles, colors, fonts, etc.)
- **Architecture**: Build configurability into the architecture for easy future UI exposure
- **Theme System**: Support JSON/theme-based configuration
- **Extensibility**: Design for easy addition of new visual customization options

### User Experience

- **Undo/Redo**: Implement undo/redo functionality for all user actions
- **Table Operations**: 
  - Resize tables based on content or allow manual resizing
  - Select multiple tables for bulk operations
  - Delete tables with confirmation
- **Relationship Management**:
  - Create foreign key relationships by dragging between columns
  - Edit relationship properties (cascade options, constraint names)
  - Delete relationships with confirmation
- **Notes System**: 
  - Add/remove notes on tables
  - Notes should be collapsible and expandable
  - Support rich text or markdown in notes

### Technical Requirements

- **Performance**: Handle diagrams with 50+ tables without significant lag
- **Responsive Design**: Work well on desktop (primary) and tablet screens
- **Browser Compatibility**: Support modern browsers (Chrome, Firefox, Safari, Edge)
- **Accessibility**: Basic keyboard navigation and screen reader support

### Data Format Specification

The app must support the `.pgerd` format as shown in `/planning/samples/design.pgerd.formatted.json`:
- **Version**: Include version field for future compatibility
- **Canvas State**: Store zoom, offset, and grid settings
- **Tables**: Store table position, schema, columns, constraints, and metadata
- **Relationships**: Store foreign key relationships with connection points
- **Notes**: Store table notes and metadata
- **Users**: Store user entities and their permissions
- **Schema Boxes**: Store visual schema grouping boxes and their properties

### Scoping Clarifications

- **MVP Scope**: 
  - Table editor only needs to support default Postgres column types
  - Basic foreign key relationships (one-to-many)
  - Simple notes system (plain text)
  - Local storage only (no URL sharing)
  - User management with table-level permissions
  - Visual schema grouping boxes
  - Configurable visual elements via code/JSON
- **Future Versions**: 
  - Postgres extensions for new column types
  - Advanced relationship types (many-to-many, inheritance)
  - SQL generation and migration scripts
  - Terraform generation
  - Real-time collaboration features
  - Import from SQL DDL and database connections
  - URL sharing with encoded state
  - Full schema management (constraints, permissions, etc.)
  - User-facing configuration UI

### Development Guidelines

- **Code Quality**: Maintain high code quality for open source contribution
- **Testing**: Include unit tests for core functionality
- **Documentation**: Provide clear API documentation for the `.pgerd` format
- **Performance**: Optimize for large diagrams and smooth interactions

## MVP Refinements

July 28, 2025 @ 11:51pm

### Scope Adjustments

After careful consideration of development resources and timeline constraints, the following features have been **deferred from MVP** to post-MVP development:

#### Deferred Features
- **User Management**: User entities with table-level permissions (user boxes, permission lines)
- **Schema Boxes**: Visual grouping boxes for schema organization
- **Advanced Notes**: Rich text/markdown support in notes (MVP will use plain text only)

#### Rationale
- Single senior engineer working 40 hours/week
- Focus on core table and relationship functionality first
- Ensure high-quality, well-tested MVP before adding complexity
- User management and schema boxes can be added as post-MVP features without breaking existing functionality

### Updated MVP Scope

The refined MVP scope now focuses on:

#### Core Table Functionality
- Create, edit, and delete tables
- Support all default Postgres column types
- Add/remove columns and constraints
- Table positioning and resizing
- Show/hide column types in table display

#### Relationship Management
- Create foreign key relationships (one-to-many)
- Visual connector lines between tables
- Edit relationship properties (cascade options, constraint names)
- Delete relationships with confirmation
- Custom routing of connector lines

#### Canvas and Navigation
- Zoom controls (25% to 400%)
- Pan controls for canvas navigation
- 15px grid system with snap-to-grid
- Viewport state persistence

#### Data Management
- Import/Export `.pgerd` format (required for MVP)
- Local storage auto-save
- Data validation for relationships and references
- Copy/paste JSON functionality

#### Notes System
- Simple plain text notes on tables
- Collapsible/expandable notes
- Add/remove notes functionality

#### User Experience
- Undo/redo functionality
- Table selection and bulk operations
- Drag and drop table positioning
- Responsive design for desktop and tablet

### Technical Requirements (Updated)

#### Performance Standards
- **Benchmark**: Handle 50+ tables without significant lag (< 100ms response time)
- **Performance Testing**: Include automated performance benchmarks
- **Optimization**: Implement virtualization and memoization strategies

#### Testing Requirements
- **Code Coverage**: 80% minimum coverage for unit and integration tests
- **Test Types**: Unit tests for business logic, integration tests for user workflows
- **Testing Framework**: Vitest + React Testing Library
- **Performance Testing**: Automated benchmarks for large diagrams

#### Browser Support
- **Primary**: Chrome (first priority)
- **Secondary**: Firefox, Safari, Edge (post-MVP)
- **Mobile**: Tablet support required, mobile deferred

#### Development Environment
- **Team**: Single senior engineer (40 hours/week)
- **Timeline**: Realistic 1-2 week milestones
- **Quality**: Production-ready code with comprehensive testing

### Future Versions (Updated Priority)

#### Post-MVP Features (High Priority)
1. **User Management**: User entities with table-level permissions
2. **Schema Boxes**: Visual grouping for schema organization
3. **Advanced Notes**: Rich text/markdown support

#### Post-MVP Features (Medium Priority)
4. **Advanced Relationships**: Many-to-many, inheritance
5. **SQL Generation**: DDL and migration scripts
6. **URL Sharing**: Encoded state sharing
7. **Cross-browser Support**: Firefox, Safari, Edge

#### Post-MVP Features (Lower Priority)
8. **Real-time Collaboration**: Multi-user editing
9. **Database Connections**: Direct import from existing databases
10. **Terraform Generation**: Infrastructure as code
11. **User-facing Configuration UI**: Visual theme customization

## Technical Design

July 28, 2025 @ 11:30pm

### Architecture Overview

The application follows a layered architecture with clear separation of concerns:

```
┌─────────────────────────────────────────────────────────────┐
│                    Presentation Layer                       │
│  ┌─────────────┐ ┌─────────────┐ ┌─────────────┐          │
│  │   Canvas    │ │   Toolbar   │ │   Panels    │          │
│  │ Components  │ │ Components  │ │ Components  │          │
│  └─────────────┘ └─────────────┘ └─────────────┘          │
└─────────────────────────────────────────────────────────────┘
┌─────────────────────────────────────────────────────────────┐
│                     Business Logic Layer                    │
│  ┌─────────────┐ ┌─────────────┐ ┌─────────────┐          │
│  │   Table     │ │ Relationship│ │   User      │          │
│  │  Services   │ │  Services   │ │  Services   │          │
│  └─────────────┘ └─────────────┘ └─────────────┘          │
└─────────────────────────────────────────────────────────────┘
┌─────────────────────────────────────────────────────────────┐
│                      State Management                       │
│  ┌─────────────┐ ┌─────────────┐ ┌─────────────┐          │
│  │   Store     │ │   Actions   │ │   Selectors │          │
│  │ (Redux TK)  │ │ (Abstracted)│ │ (Abstracted)│          │
│  └─────────────┘ └─────────────┘ └─────────────┘          │
└─────────────────────────────────────────────────────────────┘
┌─────────────────────────────────────────────────────────────┐
│                      Data Layer                             │
│  ┌─────────────┐ ┌─────────────┐ ┌─────────────┐          │
│  │   Local     │ │   Import/   │ │   Export    │ │   Validation│          │
│  │  Storage    │ │   Services  │ │   Services  │          │
│  └─────────────┘ └─────────────┘ └─────────────┘          │
└─────────────────────────────────────────────────────────────┘
```

### Technology Stack

**Core Framework**: React 18+ with TypeScript
- **State Management**: Redux Toolkit with abstracted service layer
- **UI Components**: Radix UI primitives with custom styling
- **Diagram Library**: React Flow (chosen for performance, feature completeness, and React integration)
- **Styling**: CSS Modules + CSS Custom Properties for theming
- **Build Tool**: Vite (fast development, optimized builds)
- **Testing**: Vitest + React Testing Library (80% coverage requirement)
- **Performance Testing**: React DevTools Profiler + custom benchmarks
- **Linting**: ESLint + Prettier

### Key Design Decisions

#### 1. State Management Abstraction
```typescript
// Abstracted service layer for easy state management switching
interface StateService {
  getState(): AppState;
  dispatch(action: AppAction): void;
  subscribe(listener: (state: AppState) => void): () => void;
}

// Redux implementation (can be swapped)
class ReduxStateService implements StateService {
  // Implementation details hidden from components
}
```

#### 2. Performance Optimizations
- **Virtualization**: Only render visible tables and relationships
- **Canvas Rendering**: Use React Flow's optimized canvas for large diagrams
- **Debounced Updates**: Throttle expensive operations (auto-save, relationship updates)
- **Memoization**: React.memo for expensive components, useMemo for derived state
- **Web Workers**: Offload heavy computations (relationship validation, layout algorithms)

#### 3. Component Architecture
```
src/
├── components/
│   ├── canvas/           # Diagram canvas components
│   ├── tables/           # Table-related components
│   ├── relationships/    # Connection line components
│   ├── notes/           # Notes system components
│   ├── ui/              # Reusable UI components (Radix-based)
│   └── panels/          # Sidebar panels and modals
├── services/            # Business logic and external integrations
├── store/              # State management (abstracted)
├── types/              # TypeScript type definitions
├── utils/              # Utility functions
├── hooks/              # Custom React hooks
└── tests/              # Test files and utilities
```

### Core Data Models

#### Table Model
```typescript
interface Table {
  id: string;
  name: string;
  schema: string;
  position: { x: number; y: number };
  columns: Column[];
  constraints: Constraint[];
  notes: Note[];
  metadata: TableMetadata;
}

interface Column {
  name: string;
  type: PostgresType;
  isPrimaryKey: boolean;
  isNullable: boolean;
  defaultValue?: string;
  constraints: ColumnConstraint[];
}

interface Note {
  id: string;
  content: string; // Plain text for MVP
  position: { x: number; y: number };
  isExpanded: boolean;
}
```

#### Relationship Model
```typescript
interface Relationship {
  id: string;
  type: 'onetomany' | 'manytoone' | 'onetoone' | 'manytomany';
  sourceTable: string;
  sourceColumn: string;
  targetTable: string;
  targetColumn: string;
  cascadeOptions: CascadeOptions;
  points: Point[]; // For custom routing
}
```

### Canvas Implementation

#### React Flow Integration
- **Custom Node Types**: Table components
- **Custom Edge Types**: Relationship lines
- **Custom Controls**: Zoom, pan, grid controls
- **Performance**: React Flow's built-in virtualization and optimization

#### Grid System
```typescript
const GRID_SIZE = 15;
const SNAP_THRESHOLD = 5;

function snapToGrid(value: number): number {
  return Math.round(value / GRID_SIZE) * GRID_SIZE;
}
```

### State Management Structure

#### Redux Store Slice
```typescript
interface AppState {
  canvas: CanvasState;
  tables: TablesState;
  relationships: RelationshipsState;
  notes: NotesState;
  ui: UIState;
  undo: UndoState;
}

interface CanvasState {
  zoom: number;
  offset: { x: number; y: number };
  gridEnabled: boolean;
  selectedElements: string[];
}
```

#### Abstracted Actions
```typescript
// Service layer abstracts Redux actions
class TableService {
  createTable(table: Omit<Table, 'id'>): Promise<Table>;
  updateTable(id: string, updates: Partial<Table>): Promise<Table>;
  deleteTable(id: string): Promise<void>;
  moveTable(id: string, position: Point): Promise<void>;
}
```

### Performance Strategies

#### 1. Rendering Optimization
- **React.memo**: All table and relationship components
- **useCallback**: Event handlers to prevent unnecessary re-renders
- **useMemo**: Expensive calculations (relationship routing, layout)

#### 2. Virtualization
```typescript
// Only render visible elements
const visibleTables = useMemo(() => {
  return tables.filter(table => isInViewport(table.position, viewport));
}, [tables, viewport]);
```

#### 3. Debounced Operations
```typescript
const debouncedAutoSave = useMemo(
  () => debounce(saveToLocalStorage, 1000),
  []
);
```

### File Format Handling

#### Import/Export Service
```typescript
class FileService {
  async importPgerd(file: File): Promise<AppState>;
  async exportPgerd(state: AppState): Promise<Blob>;
  validatePgerd(data: unknown): ValidationResult;
}
```

#### Data Validation
```typescript
interface ValidationResult {
  isValid: boolean;
  errors: ValidationError[];
  warnings: ValidationWarning[];
}

// Validate relationships, table references, etc.
function validateState(state: AppState): ValidationResult {
  // Implementation
}
```

### Theming System

#### CSS Custom Properties
```css
:root {
  --table-bg-color: #ffffff;
  --table-border-color: #e2e8f0;
  --relationship-line-color: #64748b;
  --note-bg-color: #fef3c7;
  --note-border-color: #f59e0b;
}
```

#### Theme Configuration
```typescript
interface Theme {
  colors: ColorPalette;
  fonts: FontConfig;
  spacing: SpacingConfig;
  borderRadius: BorderRadiusConfig;
}
```

### Undo/Redo Implementation

#### Command Pattern
```typescript
interface Command {
  execute(): void;
  undo(): void;
  redo(): void;
}

class CommandManager {
  private history: Command[] = [];
  private currentIndex: number = -1;
  
  execute(command: Command): void;
  undo(): void;
  redo(): void;
}
```

### Testing Strategy

#### Unit Tests (Required for MVP)
- Business logic services
- State management actions/reducers
- Utility functions
- Data validation
- **Coverage Target**: 80% minimum

#### Integration Tests (Required for MVP)
- File import/export workflows
- Canvas interactions
- Undo/redo functionality
- Table creation and editing workflows

#### Component Tests (Required for MVP)
- Table components
- Relationship components
- Notes components
- UI interface components

#### Performance Tests (Required for MVP)
- Large diagram rendering (50+ tables)
- Relationship routing performance
- Memory usage benchmarks
- Interaction response times

### Development Workflow

#### Code Organization
- **Feature-based**: Group related components, services, and types
- **Dependency Injection**: Services injected through context/providers
- **Type Safety**: Strict TypeScript configuration
- **Error Boundaries**: Graceful error handling

#### Build Configuration
- **Vite**: Fast development server and optimized builds
- **Code Splitting**: Lazy load non-critical components
- **Tree Shaking**: Remove unused code
- **Bundle Analysis**: Monitor bundle size

#### Quality Assurance
- **Code Coverage**: 80% minimum enforced by CI/CD
- **Performance Benchmarks**: Automated testing for large diagrams
- **Linting**: ESLint + Prettier with strict rules
- **Type Checking**: Strict TypeScript configuration

### Future Considerations

#### Scalability
- **Micro-frontend Architecture**: Split into smaller applications
- **Web Workers**: Move heavy computations off main thread
- **Service Workers**: Offline support and caching
- **IndexedDB**: Larger local storage capacity

#### Extensibility
- **Plugin System**: Allow custom node types and behaviors
- **API Layer**: Abstract external integrations
- **Configuration System**: User-customizable settings
- **Migration System**: Handle format version changes

This technical design provides a solid foundation for building a performant, maintainable, and extensible Postgres ERD GUI while ensuring all MVP and future requirements can be met efficiently.


