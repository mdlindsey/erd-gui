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
- Create user entities and manage table-level permissions
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
