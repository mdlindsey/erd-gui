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

- **Performance**: Handle diagrams with 50+ tables without significant lag (< 100ms response time)
- **Responsive Design**: Work well on desktop (primary) and tablet screens
- **Browser Compatibility**: 
  - **Primary Support (MVP)**: Chrome 90+, Edge 90+ (primary development and testing target)
  - **Secondary Support (Post-MVP)**: Firefox 88+, Safari 14+ (functional with acceptable performance)
  - **Feature Detection**: Progressive enhancement with graceful degradation for unsupported features
- **Accessibility**: Basic keyboard navigation and screen reader support
- **Bundle Size**: < 500KB gzipped total bundle size

### Data Format Specification

The app must support the `.pgerd` format as shown in `/planning/samples/design.pgerd.formatted.json`:

#### Complete File Format Definition

The `.pgerd` format is a versioned JSON structure that stores complete diagram state:

```json
{
  "version": "1.0.0",
  "metadata": {
    "created": "2025-01-01T00:00:00Z",
    "modified": "2025-01-01T00:00:00Z",
    "title": "Database Design",
    "description": "Optional description"
  },
  "canvas": {
    "zoom": 1.0,
    "offset": { "x": 0, "y": 0 },
    "gridEnabled": true,
    "gridSize": 15,
    "snapToGrid": true
  },
  "tables": {
    "table_id_1": {
      "id": "table_id_1",
      "name": "users",
      "schema": "public",
      "position": { "x": 100, "y": 100 },
      "size": { "width": 200, "height": 150 },
      "columns": [
        {
          "id": "col_1",
          "name": "id",
          "type": "SERIAL",
          "isPrimaryKey": true,
          "isNullable": false,
          "defaultValue": null,
          "constraints": ["PRIMARY KEY"],
          "comment": null
        }
      ],
      "constraints": [
        {
          "id": "constraint_1",
          "type": "PRIMARY_KEY",
          "name": "users_pkey",
          "columns": ["id"]
        }
      ],
      "notes": [
        {
          "id": "note_1",
          "content": "Main user table",
          "position": { "x": 10, "y": 10 },
          "isExpanded": false,
          "color": "#fef3c7"
        }
      ]
    }
  },
  "relationships": {
    "rel_1": {
      "id": "rel_1",
      "type": "one_to_many",
      "sourceTable": "table_id_1",
      "sourceColumn": "id",
      "targetTable": "table_id_2",
      "targetColumn": "user_id",
      "constraintName": "fk_user_posts",
      "cascadeOptions": {
        "onDelete": "CASCADE",
        "onUpdate": "RESTRICT"
      },
      "routingPoints": [
        { "x": 300, "y": 125 },
        { "x": 400, "y": 125 }
      ],
      "style": {
        "lineType": "bezier",
        "color": "#64748b",
        "width": 2
      }
    }
  }
}
```

#### PostgreSQL Data Types Support

**Complete list of supported PostgreSQL types for MVP:**

**Numeric Types**: `SMALLINT`, `INTEGER`, `BIGINT`, `DECIMAL(p,s)`, `NUMERIC(p,s)`, `REAL`, `DOUBLE PRECISION`, `SMALLSERIAL`, `SERIAL`, `BIGSERIAL`

**Character Types**: `CHARACTER(n)`, `CHAR(n)`, `CHARACTER VARYING(n)`, `VARCHAR(n)`, `TEXT`

**Date/Time Types**: `TIMESTAMP`, `TIMESTAMP WITH TIME ZONE`, `DATE`, `TIME`, `TIME WITH TIME ZONE`, `INTERVAL`

**Other Types**: `BOOLEAN`, `BYTEA`, `JSON`, `JSONB`, `UUID`

#### Data Validation Rules

**Table Validation**: Table names must be valid PostgreSQL identifiers (1-63 chars, alphanumeric + underscore), schema names must be valid PostgreSQL identifiers, at least one column required per table, primary key constraints must reference existing columns.

**Column Validation**: Column names must be unique within table and be valid PostgreSQL identifiers, data types must be from supported list, primary key columns cannot be nullable, default values must be compatible with column type.

**Relationship Validation**: Source and target tables must exist, source and target columns must exist and be compatible types, cannot create circular foreign key dependencies, cascade options must be valid PostgreSQL values: CASCADE, RESTRICT, SET NULL, SET DEFAULT, NO ACTION.

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
│  ┌─────────────┐ ┌─────────────┐ ┌─────────────┐ ┌─────────────┐ │
│  │   Local     │ │   Import/   │ │   Export    │ │ Validation  │ │
│  │  Storage    │ │   Services  │ │   Services  │ │  Services   │ │
│  └─────────────┘ └─────────────┘ └─────────────┘ └─────────────┘ │
└─────────────────────────────────────────────────────────────┐
```

### Technology Stack

**Core Framework**: React 18+ with TypeScript
- **State Management**: Zustand (simpler than Redux for client-side app)
- **UI Components**: Radix UI primitives with custom styling
- **Diagram Library**: React Flow (with custom virtualization layer)
- **Styling**: CSS Modules + CSS Custom Properties for theming
- **Build Tool**: Vite (fast development, optimized builds)
- **Testing**: Vitest + React Testing Library (80% coverage requirement)
- **Performance Testing**: React DevTools Profiler + Playwright + custom benchmarks
- **Cross-Browser Testing**: Playwright with automated browser matrix
- **Linting**: ESLint + Prettier + TypeScript strict mode
- **Bundle Analysis**: @vite/plugin-bundle-analyzer

### Key Design Decisions

#### 1. State Management Architecture
```typescript
// Simplified Zustand store for client-side app
import { create } from 'zustand';

interface AppState {
  canvas: { zoom: number; offset: Point; gridEnabled: boolean; selectedElements: string[] };
  tables: Record<string, Table>;
  relationships: Record<string, Relationship>;
  ui: { activePanel: string | null; isLoading: boolean; errors: string[] };
  history: { past: AppState[]; future: AppState[] };
}

const useAppStore = create<AppState>()((set, get) => ({
  // State and actions implementation
}));
```

#### 2. Performance Optimizations
- **Virtualization**: Only render visible tables and relationships using custom viewport calculations
- **Canvas Rendering**: Use React Flow's optimized canvas with custom virtualization layer
- **Debounced Updates**: Throttle expensive operations (auto-save, relationship updates)
- **Memoization**: React.memo for expensive components, useMemo for derived state
- **Bundle Optimization**: Aggressive code splitting and tree shaking (target: < 500KB gzipped)

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
  size: { width: number; height: number };
  columns: Column[];
  constraints: Constraint[];
  notes: Note[];
  metadata: TableMetadata;
}

interface Column {
  name: string;
  type: PostgresType; // From supported types list above
  isPrimaryKey: boolean;
  isNullable: boolean;
  defaultValue?: string;
  constraints: ColumnConstraint[];
  comment?: string;
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
  type: 'one_to_many' | 'many_to_one' | 'one_to_one' | 'many_to_many';
  sourceTable: string;
  sourceColumn: string;
  targetTable: string;
  targetColumn: string;
  constraintName: string;
  cascadeOptions: {
    onDelete: 'CASCADE' | 'RESTRICT' | 'SET NULL' | 'SET DEFAULT' | 'NO ACTION';
    onUpdate: 'CASCADE' | 'RESTRICT' | 'SET NULL' | 'SET DEFAULT' | 'NO ACTION';
  };
  routingPoints: Point[]; // For custom routing (max 3 points for performance)
  style: { lineType: string; color: string; width: number };
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
const GRID_CONFIG = {
  size: 15, // px
  snapThreshold: 7, // px - half grid size for intuitive snapping
  strongSnapDistance: 3, // px - closer than this always snaps
  visualFeedbackThreshold: 10 // px - show snap guides when within this distance
};

function snapToGrid(value: number): number {
  const remainder = value % GRID_CONFIG.size;
  const halfGrid = GRID_CONFIG.size / 2;
  return remainder < halfGrid ? value - remainder : value + (GRID_CONFIG.size - remainder);
}
```

**Grid Snap Behavior**: Snap threshold of 7px for intuitive behavior, visual feedback with snap guides when dragging near grid lines, toggle preserves current element positions, keyboard shortcuts: `G` to toggle grid, `Shift+G` to toggle snapping.

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

#### 1. React Flow Optimization
```typescript
// Custom virtualization for React Flow
const VIEWPORT_BUFFER = 200; // px buffer around visible area

const useVirtualizedNodes = (tables: Table[], viewport: Viewport) => {
  return useMemo(() => {
    const visibleBounds = {
      minX: viewport.x - VIEWPORT_BUFFER,
      maxX: viewport.x + viewport.width + VIEWPORT_BUFFER,
      minY: viewport.y - VIEWPORT_BUFFER,
      maxY: viewport.y + viewport.height + VIEWPORT_BUFFER
    };
    
    return tables.filter(table => 
      isRectIntersecting(table.position, table.size, visibleBounds)
    );
  }, [tables, viewport]);
};
```

#### 2. Relationship Routing Performance
- **Pathfinding Algorithm**: Use A* algorithm for complex routing with obstacles
- **Caching**: Cache routing calculations with memoization, debounce routing updates during table movement
- **Constraints**: Maximum 3 routing points per relationship for performance

#### 3. Memory Management
```typescript
// Lazy loading of table content for performance
const TableNode = React.memo(({ id, isVisible }: TableNodeProps) => {
  const tableData = useSelector(state => state.tables[id]);
  
  if (!isVisible) {
    return <TablePlaceholder position={tableData.position} />;
  }
  
  return <FullTableComponent data={tableData} />;
});
```

#### 4. Bundle Size Optimization
**Target Metrics**: Initial bundle < 500KB gzipped, React Flow ~200KB, Application code < 250KB

**Code Splitting Strategy**:
```typescript
const TableEditor = lazy(() => import('./components/tables/TableEditor'));
const RelationshipEditor = lazy(() => import('./components/relationships/RelationshipEditor'));
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

## MVP Milestones

July 28, 2025 @ 11:52pm

### Overview

This milestone plan is designed for a single senior engineer working 40 hours per week. Each milestone represents 1-2 weeks of focused development with clear deliverables and acceptance criteria. The sequence is designed to ensure meaningful progress toward E2E completion while building a solid foundation.

### Milestone 1: Project Foundation & Core Infrastructure (Week 1-2)

**Duration**: 2 weeks  
**Goal**: Establish the project foundation with core infrastructure and basic canvas functionality.

#### Deliverables
- [ ] Project setup with Vite, React 18+, TypeScript
- [ ] Redux Toolkit store with abstracted service layer
- [ ] React Flow canvas integration with basic zoom/pan
- [ ] 15px grid system with snap-to-grid functionality
- [ ] Basic project structure and component architecture
- [ ] ESLint + Prettier configuration
- [ ] Vitest + React Testing Library setup with 80% coverage enforcement

#### Acceptance Criteria
- Canvas renders with zoom controls (25% to 400%)
- Pan functionality works smoothly
- Grid system visible and snap-to-grid functional
- Project builds without errors
- Test suite runs with 80% coverage
- Code quality tools properly configured

#### Technical Focus
- Establish clean architecture patterns
- Set up proper TypeScript configuration
- Implement abstracted state management
- Create reusable UI component foundation

---

### Milestone 2: Table Components & Basic State Management (Week 3-4)

**Duration**: 2 weeks  
**Goal**: Create core table components with full CRUD functionality and state management.

#### Deliverables
- [ ] Table data models and TypeScript interfaces
- [ ] Table component with basic rendering
- [ ] Table creation/editing modal/form
- [ ] Column management (add/remove columns)
- [ ] Postgres column type support
- [ ] Table positioning and drag/drop
- [ ] Table selection and bulk operations
- [ ] Local storage integration for auto-save

#### Acceptance Criteria
- Can create new tables with custom names
- Can add/remove columns with proper Postgres types
- Tables can be positioned on canvas via drag/drop
- Table selection works (single and multiple)
- Data persists in local storage
- All table operations have comprehensive tests

#### Technical Focus
- Custom React Flow node types for tables
- Form validation and error handling
- Optimized re-rendering with React.memo
- Proper state management patterns

---

### Milestone 3: Relationship Management & Visual Connections (Week 5-6)

**Duration**: 2 weeks  
**Goal**: Implement foreign key relationships with visual connector lines and relationship management.

#### Deliverables
- [ ] Relationship data models and interfaces
- [ ] Visual connector lines between tables
- [ ] Relationship creation via drag between columns
- [ ] Relationship editing (cascade options, constraint names)
- [ ] Custom routing for connector lines
- [ ] Relationship validation and error handling
- [ ] Delete relationships with confirmation

#### Acceptance Criteria
- Can create relationships by dragging between table columns
- Connector lines render correctly and update with table movement
- Relationship properties can be edited
- Custom routing points work for complex layouts
- Invalid relationships are prevented with clear error messages
- All relationship operations have comprehensive tests

#### Technical Focus
- Custom React Flow edge types
- Pathfinding algorithms for connector routing
- Relationship validation logic
- Performance optimization for large numbers of relationships

---

### Milestone 4: Notes System & Enhanced UX (Week 7-8)

**Duration**: 2 weeks  
**Goal**: Implement notes system and enhance user experience with undo/redo functionality.

#### Deliverables
- [ ] Notes data model and components
- [ ] Collapsible/expandable notes on tables
- [ ] Add/remove notes functionality
- [ ] Undo/redo system with command pattern
- [ ] Enhanced table resizing based on content
- [ ] Improved table selection and bulk operations
- [ ] Responsive design for desktop and tablet

#### Acceptance Criteria
- Notes can be added to tables and are collapsible
- Undo/redo works for all user actions
- Tables resize appropriately based on content
- Bulk operations work smoothly
- Interface is responsive on different screen sizes
- All notes functionality has comprehensive tests

#### Technical Focus
- Command pattern implementation
- State history management
- Responsive design patterns
- Accessibility improvements

---

### Milestone 5: Import/Export & Data Validation (Week 9-10)

**Duration**: 2 weeks  
**Goal**: Implement `.pgerd` format import/export with comprehensive data validation.

#### Deliverables
- [ ] `.pgerd` format specification implementation
- [ ] Import functionality (file upload and copy/paste)
- [ ] Export functionality (download and copy to clipboard)
- [ ] Data validation for relationships and references
- [ ] Error handling for invalid imports
- [ ] Format versioning and migration support
- [ ] Comprehensive validation tests

#### Acceptance Criteria
- Can import `.pgerd` files successfully
- Can export current state to `.pgerd` format
- Copy/paste JSON functionality works
- Invalid data is caught with clear error messages
- Format versioning handles future compatibility
- All import/export operations have comprehensive tests

#### Technical Focus
- File handling and blob management
- JSON schema validation
- Error boundary implementation
- Data migration strategies

---

### Milestone 6: Performance Optimization & Testing (Week 11-12)

**Duration**: 2 weeks  
**Goal**: Optimize performance for large diagrams and complete comprehensive testing.

#### Deliverables
- [ ] Performance benchmarks for 50+ tables
- [ ] Virtualization for large diagrams
- [ ] Memory usage optimization
- [ ] Interaction response time optimization
- [ ] Comprehensive integration tests
- [ ] Performance testing automation
- [ ] Cross-browser testing (Chrome focus)
- [ ] Accessibility testing and improvements

#### Acceptance Criteria
- Handles 50+ tables without significant lag (< 100ms response time)
- Memory usage remains stable with large diagrams
- All user workflows have integration tests
- Performance benchmarks pass consistently
- Accessibility standards are met
- 80% code coverage maintained

#### Technical Focus
- React Flow optimization techniques
- Virtualization strategies
- Performance monitoring and profiling
- Comprehensive test coverage

---

### Milestone 7: Polish & Production Readiness (Week 13-14)

**Duration**: 2 weeks  
**Goal**: Final polish, bug fixes, and production readiness.

#### Deliverables
- [ ] UI/UX polish and refinement
- [ ] Bug fixes and edge case handling
- [ ] Error boundary improvements
- [ ] Loading states and user feedback
- [ ] Documentation updates
- [ ] Production build optimization
- [ ] Final testing and validation
- [ ] Deployment preparation

#### Acceptance Criteria
- All features work smoothly without bugs
- User experience is polished and intuitive
- Error handling is robust and user-friendly
- Application is ready for production deployment
- Documentation is complete and accurate
- Performance meets all requirements

#### Technical Focus
- Production build optimization
- Error handling and user feedback
- Final testing and validation
- Documentation and deployment preparation

---

### Success Metrics

#### Technical Metrics
- **Code Coverage**: Maintain 80%+ throughout development
- **Performance**: < 100ms response time with 50+ tables
- **Bundle Size**: Optimized for fast loading
- **Test Coverage**: All critical user workflows covered

#### Quality Metrics
- **Bug Count**: Zero critical bugs in final milestone
- **User Experience**: Intuitive and responsive interface
- **Accessibility**: WCAG 2.1 AA compliance
- **Documentation**: Complete and accurate

#### Delivery Metrics
- **Timeline**: Complete within 14 weeks
- **Scope**: All MVP features delivered
- **Quality**: Production-ready code
- **Maintainability**: Clean, well-documented codebase

### Risk Mitigation

#### Technical Risks (High Impact)
- **React Flow Limitations**: Risk of inadequate performance with 50+ tables
  - *Mitigation*: Custom virtualization layer, fallback to HTML5 Canvas, prototype with 100+ tables in week 1
  - *Contingency*: Switch to Konva.js + React-Konva if React Flow fails

- **Browser Compatibility**: CSS Grid and modern JS features may not work in older browsers
  - *Mitigation*: Define minimum browser versions (Chrome 90+, Firefox 88+, Safari 14+), feature detection with graceful degradation
  - *Testing*: Automated cross-browser testing with Playwright

- **Bundle Size Explosion**: React Flow + dependencies may exceed 500KB budget
  - *Mitigation*: Monitor bundle size in CI/CD, aggressive code splitting, hard limit enforcement
  - *Fallback*: Create lightweight custom canvas solution

#### Development Risks (Medium Impact)
- **State Management Complexity**: Complex state updates introducing bugs
  - *Mitigation*: Use Zustand for simpler state management, comprehensive unit tests, state debugger for development

- **Performance Testing Gaps**: Performance issues discovered late
  - *Mitigation*: Performance tests from milestone 1, continuous React DevTools Profiler usage, automated regression testing

#### Timeline Risks (Medium Impact)
- **React Flow Learning Curve**: Custom nodes/edges more complex than anticipated
  - *Mitigation*: 25% time buffer for canvas implementation, proof of concept in first week, HTML5 Canvas backup plan

- **Testing Overhead**: 80% coverage requirement slowing development
  - *Mitigation*: TDD for complex logic, testing utilities early, write tests alongside code

#### Business Risks (Low Impact)
- **Scope Creep**: Stakeholders requesting features beyond MVP
  - *Mitigation*: Document clear MVP boundaries, post-MVP roadmap, time-boxed feature exploration

#### Risk Monitoring
**Weekly Assessment**: Performance benchmarks, bundle size growth, test coverage metrics, development velocity
**Go/No-Go Criteria**: Milestone 1 (25 tables smooth), Milestone 3 (intuitive relationships), Milestone 6 (50 tables < 100ms)

### Post-MVP Planning

Upon successful completion of MVP milestones, the following features will be prioritized for post-MVP development:

1. **User Management**: User entities with table-level permissions
2. **Schema Boxes**: Visual grouping for schema organization  
3. **Advanced Notes**: Rich text/markdown support
4. **Advanced Relationships**: Many-to-many, inheritance
5. **SQL Generation**: DDL and migration scripts

This milestone plan ensures steady progress toward a complete, production-ready Postgres ERD GUI while maintaining high code quality and comprehensive testing throughout the development process.

## Prioritized Backlog

July 28, 2025 @ 11:58pm

### Milestone 1: Project Foundation & Core Infrastructure

This backlog provides detailed task breakdowns for each deliverable in Milestone 1. Tasks are written for junior to mid-level engineers with clear instructions, best practices, and acceptance criteria.

#### Deliverable 1: Project Setup with Vite, React 18+, TypeScript

**Task 1.1: Initialize Vite Project**
- **Branch**: `setup/vite-init`
- **Description**: Create new Vite project with React and TypeScript template
- **Instructions**: 
  - Run `npm create vite@latest pgerd-gui -- --template react-ts`
  - Navigate to project directory: `cd pgerd-gui`
  - Install dependencies: `npm install`
  - Verify TypeScript configuration in `tsconfig.json` has strict mode enabled
- **Acceptance Criteria**: Project builds successfully with `npm run build`
- **Testing**: Run `npm run dev` and verify React app loads in browser
- **Estimated Effort**: 30 minutes

**Task 1.2: Configure TypeScript Strict Mode**
- **Branch**: `setup/typescript-config`
- **Description**: Set up strict TypeScript configuration for type safety
- **Instructions**:
  - Update `tsconfig.json` to include: `"strict": true`, `"noImplicitAny": true`, `"strictNullChecks": true`
  - Add `"skipLibCheck": true` to avoid third-party library type issues
  - Configure `"baseUrl": "."` and `"paths"` for clean imports
- **Acceptance Criteria**: No TypeScript errors in initial build
- **Testing**: Run `npx tsc --noEmit` to verify type checking
- **Estimated Effort**: 1 hour

**Task 1.3: Install Core Dependencies**
- **Branch**: `setup/dependencies`
- **Description**: Install React Flow, Redux Toolkit, and other core dependencies
- **Instructions**:
  - Install React Flow: `npm install reactflow`
  - Install Redux Toolkit: `npm install @reduxjs/toolkit react-redux`
  - Install Radix UI primitives: `npm install @radix-ui/react-dialog @radix-ui/react-dropdown-menu @radix-ui/react-button`
  - Install utility libraries: `npm install lodash-es` (for debouncing)
- **Acceptance Criteria**: All packages install without conflicts
- **Testing**: Verify imports work in a test component
- **Estimated Effort**: 30 minutes

#### Deliverable 2: Redux Toolkit Store with Abstracted Service Layer

**Task 2.1: Define Core TypeScript Interfaces**
- **Branch**: `types/core-interfaces`
- **Description**: Create type definitions for application state
- **Instructions**:
  - Create `src/types/index.ts` with core interfaces (AppState, CanvasState, Table, etc.)
  - Define abstract StateService interface as shown in technical design
  - Create separate type files for each domain (tables, relationships, notes)
- **Best Practices**: Use strict typing, avoid `any`, use union types for enums
- **Acceptance Criteria**: All interfaces compile without errors
- **Testing**: Create simple test to verify type compatibility
- **Estimated Effort**: 2 hours

**Task 2.2: Implement Redux Store Structure**
- **Branch**: `store/redux-setup`
- **Description**: Set up Redux Toolkit store with proper slice organization
- **Instructions**:
  - Create `src/store/index.ts` with configureStore
  - Create separate slices: `canvasSlice.ts`, `tablesSlice.ts`, `relationshipsSlice.ts`
  - Implement initial state for each slice
  - Set up proper TypeScript typing for store and slices
- **Best Practices**: Use createSlice, avoid mutating state, use immer for updates
- **Acceptance Criteria**: Store initializes without errors, all slices accessible
- **Testing**: Write unit tests for each slice reducer
- **Estimated Effort**: 3 hours

**Task 2.3: Create Abstracted Service Layer**
- **Branch**: `services/state-abstraction`
- **Description**: Implement service layer that abstracts Redux implementation
- **Instructions**:
  - Create `src/services/StateService.ts` implementing the abstract interface
  - Create concrete `ReduxStateService` class
  - Implement service methods that dispatch Redux actions
  - Create service factory/context for dependency injection
- **Best Practices**: Use dependency injection, make services testable, handle async operations
- **Acceptance Criteria**: Services can be injected and used by components
- **Testing**: Write unit tests for service methods
- **Estimated Effort**: 4 hours

#### Deliverable 3: React Flow Canvas Integration with Basic Zoom/Pan

**Task 3.1: Set Up React Flow Canvas**
- **Branch**: `canvas/react-flow-setup`
- **Description**: Create basic React Flow canvas with proper configuration
- **Instructions**:
  - Create `src/components/canvas/Canvas.tsx` component
  - Configure ReactFlow with proper nodeTypes and edgeTypes
  - Set up viewport state management
  - Implement basic zoom and pan controls
- **Best Practices**: Use React.memo for performance, handle viewport changes properly
- **Acceptance Criteria**: Canvas renders with zoom controls (25% to 400%)
- **Testing**: Test zoom/pan functionality with user interactions
- **Estimated Effort**: 3 hours

**Task 3.2: Implement Custom Controls**
- **Branch**: `canvas/custom-controls`
- **Description**: Create custom zoom and pan controls
- **Instructions**:
  - Create `src/components/canvas/CanvasControls.tsx`
  - Implement zoom in/out buttons with proper limits
  - Add fit-to-view functionality
  - Style controls to match design system
- **Best Practices**: Use CSS custom properties for theming, make controls accessible
- **Acceptance Criteria**: All zoom controls work within specified range
- **Testing**: Test all control interactions and edge cases
- **Estimated Effort**: 2 hours

**Task 3.3: Integrate Canvas with State Management**
- **Branch**: `canvas/state-integration`
- **Description**: Connect canvas to Redux store for state persistence
- **Instructions**:
  - Connect canvas component to Redux store using useSelector and useDispatch
  - Implement viewport state synchronization
  - Handle canvas events and dispatch appropriate actions
  - Ensure smooth performance with large numbers of elements
- **Best Practices**: Use useCallback for event handlers, debounce expensive operations
- **Acceptance Criteria**: Canvas state persists and restores correctly
- **Testing**: Test state persistence and restoration
- **Estimated Effort**: 2 hours

#### Deliverable 4: 15px Grid System with Snap-to-Grid Functionality

**Task 4.1: Implement Grid Rendering**
- **Branch**: `grid/visual-rendering`
- **Description**: Create visual grid system on canvas
- **Instructions**:
  - Create `src/components/canvas/Grid.tsx` component
  - Implement 15px grid rendering with CSS
  - Make grid responsive to zoom level
  - Add grid toggle functionality
- **Best Practices**: Use CSS transforms for performance, make grid subtle but visible
- **Acceptance Criteria**: Grid is visible and scales with zoom
- **Testing**: Test grid visibility at different zoom levels
- **Estimated Effort**: 2 hours

**Task 4.2: Implement Snap-to-Grid Logic**
- **Branch**: `grid/snap-logic`
- **Description**: Create utility functions for snapping coordinates to grid
- **Instructions**:
  - Create `src/utils/grid.ts` with snapToGrid function
  - Implement snap threshold logic (5px)
  - Create helper functions for grid calculations
  - Add grid size constants
- **Best Practices**: Use pure functions, handle edge cases, make functions testable
- **Acceptance Criteria**: Coordinates snap correctly to 15px grid
- **Testing**: Write comprehensive unit tests for grid utilities
- **Estimated Effort**: 1.5 hours

**Task 4.3: Integrate Grid with Canvas Interactions**
- **Branch**: `grid/canvas-integration`
- **Description**: Apply snap-to-grid to all canvas interactions
- **Instructions**:
  - Modify canvas event handlers to use snapToGrid
  - Apply snapping to node positioning
  - Add visual feedback when snapping occurs
  - Make snap-to-grid toggleable
- **Best Practices**: Provide visual feedback, make snapping optional, handle performance
- **Acceptance Criteria**: All canvas interactions respect grid snapping
- **Testing**: Test snapping behavior with various interactions
- **Estimated Effort**: 2 hours

#### Deliverable 5: Basic Project Structure and Component Architecture

**Task 5.1: Create Component Directory Structure**
- **Branch**: `structure/component-dirs`
- **Description**: Set up organized component architecture
- **Instructions**:
  - Create directory structure: `src/components/{canvas,tables,relationships,notes,ui,panels}`
  - Create index files for clean imports
  - Set up barrel exports for each component category
  - Create placeholder components for each major feature
- **Best Practices**: Use consistent naming, organize by feature, use barrel exports
- **Acceptance Criteria**: Clean import structure, no circular dependencies
- **Testing**: Verify all imports work correctly
- **Estimated Effort**: 1 hour

**Task 5.2: Create Base UI Components**
- **Branch**: `ui/base-components`
- **Description**: Implement reusable UI components using Radix UI
- **Instructions**:
  - Create `src/components/ui/Button.tsx`, `Modal.tsx`, `Input.tsx`
  - Implement consistent styling with CSS custom properties
  - Add proper TypeScript props interfaces
  - Include accessibility attributes
- **Best Practices**: Use Radix UI primitives, implement proper accessibility, use consistent styling
- **Acceptance Criteria**: All UI components render correctly and are accessible
- **Testing**: Test component rendering and accessibility
- **Estimated Effort**: 3 hours

**Task 5.3: Set Up CSS Architecture**
- **Branch**: `styles/css-architecture`
- **Description**: Implement CSS Modules with custom properties for theming
- **Instructions**:
  - Create `src/styles/` directory with global styles
  - Set up CSS custom properties for theming
  - Create component-specific CSS modules
  - Implement responsive design utilities
- **Best Practices**: Use CSS custom properties, implement mobile-first design, use semantic class names
- **Acceptance Criteria**: Consistent styling across components, responsive design works
- **Testing**: Test styling across different screen sizes
- **Estimated Effort**: 2 hours

#### Deliverable 6: ESLint + Prettier Configuration

**Task 6.1: Install and Configure ESLint**
- **Branch**: `lint/eslint-setup`
- **Description**: Set up ESLint with React and TypeScript rules
- **Instructions**:
  - Install ESLint: `npm install -D eslint @typescript-eslint/parser @typescript-eslint/eslint-plugin eslint-plugin-react eslint-plugin-react-hooks`
  - Create `.eslintrc.js` with strict rules for React and TypeScript
  - Configure rules for code quality and consistency
  - Add scripts to package.json for linting
- **Best Practices**: Use strict rules, enable React hooks rules, configure for TypeScript
- **Acceptance Criteria**: ESLint runs without errors on existing code
- **Testing**: Run `npm run lint` and verify no errors
- **Estimated Effort**: 1 hour

**Task 6.2: Install and Configure Prettier**
- **Branch**: `lint/prettier-setup`
- **Description**: Set up Prettier for consistent code formatting
- **Instructions**:
  - Install Prettier: `npm install -D prettier eslint-config-prettier eslint-plugin-prettier`
  - Create `.prettierrc` with consistent formatting rules
  - Configure ESLint to work with Prettier
  - Add format scripts to package.json
- **Best Practices**: Use consistent formatting rules, integrate with ESLint, configure for team use
- **Acceptance Criteria**: Prettier formats code consistently
- **Testing**: Run `npm run format` and verify formatting
- **Estimated Effort**: 30 minutes

**Task 6.3: Set Up Pre-commit Hooks**
- **Branch**: `lint/pre-commit-hooks`
- **Description**: Configure Git hooks for code quality
- **Instructions**:
  - Install husky: `npm install -D husky lint-staged`
  - Configure pre-commit hook to run linting and formatting
  - Set up lint-staged to only process changed files
  - Add scripts to package.json for hook management
- **Best Practices**: Use lint-staged for performance, fail commits on lint errors
- **Acceptance Criteria**: Pre-commit hooks run automatically
- **Testing**: Make a commit and verify hooks run
- **Estimated Effort**: 1 hour

#### Deliverable 7: Vitest + React Testing Library Setup with 80% Coverage Enforcement

**Task 7.1: Install and Configure Vitest**
- **Branch**: `testing/vitest-setup`
- **Description**: Set up Vitest testing framework
- **Instructions**:
  - Install Vitest: `npm install -D vitest @vitest/ui jsdom`
  - Configure `vite.config.ts` for testing
  - Set up test environment with jsdom
  - Create test utilities and helpers
- **Best Practices**: Use jsdom for DOM testing, configure for React components
- **Acceptance Criteria**: Vitest runs tests successfully
- **Testing**: Run `npm run test` and verify execution
- **Estimated Effort**: 1 hour

**Task 7.2: Install and Configure React Testing Library**
- **Branch**: `testing/rtl-setup`
- **Description**: Set up React Testing Library for component testing
- **Instructions**:
  - Install React Testing Library: `npm install -D @testing-library/react @testing-library/jest-dom @testing-library/user-event`
  - Configure testing utilities and custom render function
  - Set up test providers (Redux, Router, etc.)
  - Create common test utilities
- **Best Practices**: Use user-centric testing, avoid testing implementation details
- **Acceptance Criteria**: Can render and test React components
- **Testing**: Write simple component test and verify it passes
- **Estimated Effort**: 1.5 hours

**Task 7.3: Configure Coverage Reporting**
- **Branch**: `testing/coverage-config`
- **Description**: Set up code coverage with 80% enforcement
- **Instructions**:
  - Configure Vitest coverage settings in `vite.config.ts`
  - Set up coverage thresholds (80% minimum)
  - Configure coverage reporting format
  - Add coverage scripts to package.json
- **Best Practices**: Use realistic thresholds, exclude test files, configure for CI/CD
- **Acceptance Criteria**: Coverage reports generate correctly
- **Testing**: Run `npm run test:coverage` and verify reporting
- **Estimated Effort**: 1 hour

**Task 7.4: Create Initial Test Suite**
- **Branch**: `testing/initial-tests`
- **Description**: Write comprehensive tests for existing components
- **Instructions**:
  - Write unit tests for utility functions
  - Write component tests for UI components
  - Write integration tests for canvas functionality
  - Ensure 80% coverage is achieved
- **Best Practices**: Test user interactions, test edge cases, use meaningful test descriptions
- **Acceptance Criteria**: 80% code coverage achieved
- **Testing**: Run full test suite and verify coverage
- **Estimated Effort**: 4 hours

### Task Dependencies and Prerequisites

**Critical Path**:
1. Task 1.1 → Task 1.2 → Task 1.3 (Project Setup)
2. Task 2.1 → Task 2.2 → Task 2.3 (State Management)
3. Task 3.1 → Task 3.2 → Task 3.3 (Canvas Integration)
4. Task 4.1 → Task 4.2 → Task 4.3 (Grid System)
5. Task 5.1 → Task 5.2 → Task 5.3 (Component Architecture)
6. Task 6.1 → Task 6.2 → Task 6.3 (Code Quality)
7. Task 7.1 → Task 7.2 → Task 7.3 → Task 7.4 (Testing)

**Parallel Tasks**: Tasks 5.1-5.3 can run in parallel with Tasks 6.1-6.3

### Success Criteria for Milestone 1

- **Functional**: Canvas renders with zoom controls (25% to 400%), pan functionality works smoothly
- **Technical**: Grid system visible and snap-to-grid functional, project builds without errors
- **Quality**: Test suite runs with 80% coverage, code quality tools properly configured
- **Architecture**: Clean architecture patterns established, proper TypeScript configuration
- **Foundation**: Abstracted state management implemented, reusable UI component foundation created

### Risk Mitigation

- **React Flow Complexity**: Start with basic canvas setup before advanced features
- **TypeScript Configuration**: Use strict mode from the beginning to avoid technical debt
- **Testing Setup**: Establish testing patterns early to ensure consistent coverage
- **Performance**: Monitor bundle size and performance from the start

This detailed backlog ensures that junior to mid-level engineers have clear, actionable tasks with proper guidance on best practices and implementation details.

## Contributing

### Documentation Updates

This planning document is a living document that should remain succinct yet comprehensive. When making updates:

**PR Requirements:**
- **Title**: MUST be very short - 1-3 words maximum (e.g., "Plan review", "Architecture update", "Scope refinement", "Bug fix")
- **Description**: Summary of the conversation or analysis that led to the changes
- **Branch**: Short and relevant name (e.g., `planning/review`, `architecture/updates`)

**Content Guidelines:**
- Update content in place while minimizing changes to preserve history
- Preserve existing formatting to reduce noise in version diffs
- Incorporate recommendations into existing sections rather than adding new major sections
- Maintain the balance of being succinct yet comprehensive

**Review Process:**
- All architectural changes should be reviewed by a senior engineer
- Performance implications should be considered for any technical modifications
- Scope changes must be validated against MVP boundaries

### Development Workflow & Pull Request Process

This project follows a structured PR workflow to maintain code quality, enable proper review, and ensure clean git history. Each task from the prioritized backlog should be implemented as a separate PR.

#### Task Completion Process

When being asked to complete a task from the backlog, follow this exact process:

1. **Read the entire journal.md file** to understand full context on vision, product requirements, technical design, etc.
2. **Find the next task** that needs to be completed from the prioritized backlog
3. **Re-read the contribution guidelines** and existing codebase to ensure you are following best practices
4. **Complete the task** and verify quality with testing
5. **Push your work** to an appropriately (short) named branch
6. **Inform the human operator** that the branch is ready for review and provide them with a URL using this format so they can easily create a PR themselves:
   ```
   https://github.com/mdlindsey/erd-gui/compare/main...[branch-name]
   ```
   Replace `[branch-name]` with the actual name of the branch you created.

**IMPORTANT**: Do NOT merge PRs automatically. Always stop after step 6 and wait for explicit human approval before merging.

**Branch Workflow:**
- **Branch Creation**: Create a new branch for each task using the naming convention specified in the backlog (e.g., `types/core-interfaces`, `store/redux-setup`)
- **Development**: Implement the complete task requirements on the feature branch
- **Testing**: Ensure all acceptance criteria are met and code compiles without errors
- **Commit Messages**: Use descriptive commit messages that explain the implementation details

**Pull Request Requirements:**
- **Title Format**: Use the exact task name from the backlog (e.g., "Task 2.1: Define Core TypeScript Interfaces")
- **Description**: Include:
  - Summary of implemented features
  - List of files changed with brief explanations
  - Confirmation that acceptance criteria are met
  - Any architectural decisions or trade-offs made
- **Review Required**: ALL PRs must be explicitly approved before merging
- **No Auto-Merge**: Automatic merging is prohibited - only manual human review and authorization

**Merge Process (Human-Controlled):**
- **Manual Review**: Every PR requires human review and explicit approval
- **Explicit Authorization**: Merge only occurs after human operator explicitly approves
- **Merge Method**: Use `--no-ff` merges to preserve PR history and branch context
- **Merge Message**: Include task details and implementation summary in merge commit
- **Branch Cleanup**: Delete feature branches immediately after successful merge (both local and remote)

**Example Workflow:**
```bash
# 1. Create feature branch
git checkout -b types/core-interfaces

# 2. Implement task requirements
# ... development work ...

# 3. Commit with descriptive message
git commit -m "Task 2.1: Define Core TypeScript Interfaces
- Created comprehensive type definitions..."

# 4. Push branch for review
git push origin types/core-interfaces

# 5. Inform human operator with PR creation URL:
# "Branch ready for review: https://github.com/mdlindsey/erd-gui/compare/main...types/core-interfaces"
# 6. STOP - Wait for explicit human approval
# 7. Only after explicit authorization, merge with no-ff
git checkout main
git merge types/core-interfaces --no-ff -m "Merge Task 2.1: ..."

# 8. Clean up branches
git branch -d types/core-interfaces
git push origin --delete types/core-interfaces
```

**Quality Gates:**
- All TypeScript code must compile without errors
- Code must follow established architectural patterns
- Tests must pass (when testing framework is implemented)
- No linting errors or warnings
- Performance implications must be considered

**Branch Management:**
- Keep branches focused on single tasks
- Delete merged branches promptly to maintain clean repository
- Regularly review and prune stale branches
- Use descriptive branch names that match task identifiers

**Critical Process Notes:**
- **Never assume approval**: Always wait for explicit human authorization before merging
- **Communication is key**: Always inform the human operator when branch is ready with PR creation URL
- **Stop at branch push**: The workflow stops after pushing the branch and providing the PR creation URL
- **Human creates PR**: The human operator creates the actual PR through the GitHub interface
- **Patience is required**: Do not proceed with merge until explicitly told to do so

This workflow ensures:
- **Traceable History**: Each task has a clear PR trail
- **Quality Control**: Human review catches issues before merge
- **Clean Repository**: Regular cleanup prevents branch proliferation
- **Collaboration**: Clear process enables multiple contributors
- **Rollback Capability**: No-ff merges preserve branch context for easy rollbacks
- **Human Oversight**: All merges are human-controlled and authorized


