// React Flow Canvas Component for ERD GUI

import React, { useCallback, useMemo } from 'react';
import {
  ReactFlow,
  Background,
  BackgroundVariant,
  Controls,
  MiniMap,
  useNodesState,
  useEdgesState,
  addEdge,
  Connection,
  Edge,
  Node,
  NodeTypes,
  EdgeTypes,
  Panel,
  ReactFlowProvider,
  Viewport,
  OnMove,
  OnConnect,
  MarkerType,
} from 'reactflow';
import 'reactflow/dist/style.css';

import { useCanvasService } from '../../services';

// Custom node types for ERD entities
const TableNode = React.memo(({ data, selected }: { data: any; selected: boolean }) => {
  return (
    <div
      className={`table-node ${selected ? 'selected' : ''}`}
      style={{
        background: '#fff',
        border: '2px solid #ddd',
        borderRadius: '8px',
        padding: '12px',
        minWidth: '200px',
        boxShadow: selected ? '0 0 0 2px #3b82f6' : '0 2px 4px rgba(0,0,0,0.1)',
      }}
    >
      <div
        style={{
          fontWeight: 'bold',
          marginBottom: '8px',
          borderBottom: '1px solid #eee',
          paddingBottom: '4px',
        }}
      >
        {data.tableName || 'Table'}
      </div>
      <div style={{ fontSize: '12px', color: '#666' }}>
        {data.columns?.map((col: any, idx: number) => (
          <div key={idx} style={{ margin: '2px 0' }}>
            {col.name} <span style={{ color: '#999' }}>({col.type})</span>
          </div>
        )) || 'No columns'}
      </div>
    </div>
  );
});

const NoteNode = React.memo(({ data, selected }: { data: any; selected: boolean }) => {
  return (
    <div
      className={`note-node ${selected ? 'selected' : ''}`}
      style={{
        background: data.color || '#ffd700',
        border: '1px solid #ddd',
        borderRadius: '4px',
        padding: '8px',
        minWidth: '150px',
        maxWidth: '300px',
        boxShadow: selected ? '0 0 0 2px #3b82f6' : '0 1px 3px rgba(0,0,0,0.1)',
        fontSize: '14px',
      }}
    >
      {data.content || 'Note content'}
    </div>
  );
});

const UserNode = React.memo(({ data, selected }: { data: any; selected: boolean }) => {
  return (
    <div
      className={`user-node ${selected ? 'selected' : ''}`}
      style={{
        background: data.color || '#e0f2fe',
        border: '2px solid #0277bd',
        borderRadius: '50%',
        padding: '16px',
        width: '80px',
        height: '80px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontWeight: 'bold',
        boxShadow: selected ? '0 0 0 2px #3b82f6' : '0 2px 4px rgba(0,0,0,0.1)',
      }}
    >
      {data.userName || 'User'}
    </div>
  );
});

// Define node types
const nodeTypes: NodeTypes = {
  table: TableNode,
  note: NoteNode,
  user: UserNode,
};

// Note: Custom edge types will be implemented in later tasks
// For now, use default edge rendering
const edgeTypes: EdgeTypes = {};

// Default viewport configuration
const defaultViewport: Viewport = {
  x: 0,
  y: 0,
  zoom: 1,
};

export interface CanvasProps {
  className?: string;
  style?: React.CSSProperties;
}

const Canvas: React.FC<CanvasProps> = React.memo(({ className, style }) => {
  const canvasService = useCanvasService();

  // Sample nodes and edges for initial display
  const initialNodes: Node[] = useMemo(() => [
    {
      id: 'sample-table-1',
      type: 'table',
      position: { x: 100, y: 100 },
      data: {
        tableName: 'users',
        columns: [
          { name: 'id', type: 'integer' },
          { name: 'email', type: 'varchar' },
          { name: 'created_at', type: 'timestamp' },
        ],
      },
    },
    {
      id: 'sample-table-2',
      type: 'table',
      position: { x: 400, y: 100 },
      data: {
        tableName: 'posts',
        columns: [
          { name: 'id', type: 'integer' },
          { name: 'user_id', type: 'integer' },
          { name: 'title', type: 'varchar' },
        ],
      },
    },
    {
      id: 'sample-note-1',
      type: 'note',
      position: { x: 100, y: 300 },
      data: {
        content: 'User authentication table',
        color: '#e8f5e8',
      },
    },
  ], []);

  const initialEdges: Edge[] = useMemo(() => [
    {
      id: 'relationship-1',
      source: 'sample-table-1',
      target: 'sample-table-2',
      animated: false,
      style: { stroke: '#333', strokeWidth: 2 },
      markerEnd: { type: MarkerType.Arrow, color: '#333' },
      data: {
        relationshipType: 'one-to-many',
        sourceColumn: 'id',
        targetColumn: 'user_id',
      },
    },
  ], []);

  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

  // Handle viewport changes and sync with canvas service
  const onMove: OnMove = useCallback((_event, viewport) => {
    canvasService.updateViewport(viewport);
  }, [canvasService]);

  // Handle new connections
  const onConnect: OnConnect = useCallback((params: Connection) => {
    setEdges((eds) => addEdge(params, eds));
  }, [setEdges]);

  // Handle node drag end to snap to grid if enabled
  const onNodeDragStop = useCallback((_event: React.MouseEvent, node: Node) => {
    if (canvasService.snapToGrid) {
      const gridSize = canvasService.gridSize;
      const snappedX = Math.round(node.position.x / gridSize) * gridSize;
      const snappedY = Math.round(node.position.y / gridSize) * gridSize;
      
      setNodes((nodes) =>
        nodes.map((n) =>
          n.id === node.id
            ? { ...n, position: { x: snappedX, y: snappedY } }
            : n
        )
      );
    }
  }, [canvasService.snapToGrid, canvasService.gridSize, setNodes]);

  // Fit view helper (placeholder for now)
  const handleFitView = useCallback(() => {
    // TODO: Implement fitToView functionality
    console.log('Fit view requested');
  }, []);

  return (
    <div
      className={`canvas-container ${className || ''}`}
      style={{
        width: '100%',
        height: '100%',
        position: 'relative',
        ...style,
      }}
    >
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        onMove={onMove}
        onNodeDragStop={onNodeDragStop}
        nodeTypes={nodeTypes}
        edgeTypes={edgeTypes}
        defaultViewport={defaultViewport}
        minZoom={canvasService.zoomRange.min}
        maxZoom={canvasService.zoomRange.max}
        snapToGrid={canvasService.snapToGrid}
        snapGrid={[canvasService.gridSize, canvasService.gridSize]}
        attributionPosition="bottom-left"
        proOptions={{ hideAttribution: true }}
        fitView={false}
        fitViewOptions={{
          padding: 0.1,
          minZoom: canvasService.zoomRange.min,
          maxZoom: canvasService.zoomRange.max,
        }}
      >
        {canvasService.gridVisible && (
          <Background
            gap={canvasService.gridSize}
            size={1}
            color="#e0e0e0"
            variant={BackgroundVariant.Dots}
          />
        )}
        
        <Controls
          showZoom={true}
          showFitView={true}
          showInteractive={true}
          fitViewOptions={{
            padding: 0.1,
            minZoom: canvasService.zoomRange.min,
            maxZoom: canvasService.zoomRange.max,
          }}
        />
        
        <MiniMap
          nodeColor="#e0e0e0"
          nodeStrokeWidth={2}
          maskColor="rgba(0, 0, 0, 0.1)"
          style={{
            background: '#f8f9fa',
            border: '1px solid #dee2e6',
          }}
        />

        <Panel position="top-left">
          <div
            style={{
              background: '#fff',
              padding: '8px 12px',
              borderRadius: '4px',
              boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
              border: '1px solid #dee2e6',
              fontSize: '14px',
              display: 'flex',
              gap: '12px',
              alignItems: 'center',
            }}
          >
            <span>Zoom: {Math.round(canvasService.viewport.zoom * 100)}%</span>
            <button
              onClick={canvasService.toggleGrid}
              style={{
                padding: '4px 8px',
                fontSize: '12px',
                border: '1px solid #dee2e6',
                borderRadius: '3px',
                background: canvasService.gridVisible ? '#e3f2fd' : '#fff',
                cursor: 'pointer',
              }}
            >
              Grid: {canvasService.gridVisible ? 'ON' : 'OFF'}
            </button>
            <button
              onClick={canvasService.toggleSnapToGrid}
              style={{
                padding: '4px 8px',
                fontSize: '12px',
                border: '1px solid #dee2e6',
                borderRadius: '3px',
                background: canvasService.snapToGrid ? '#e8f5e8' : '#fff',
                cursor: 'pointer',
              }}
            >
              Snap: {canvasService.snapToGrid ? 'ON' : 'OFF'}
            </button>
            <button
              onClick={handleFitView}
              style={{
                padding: '4px 8px',
                fontSize: '12px',
                border: '1px solid #dee2e6',
                borderRadius: '3px',
                background: '#fff',
                cursor: 'pointer',
              }}
            >
              Fit View
            </button>
          </div>
        </Panel>
      </ReactFlow>
    </div>
  );
});

Canvas.displayName = 'Canvas';

// Wrapper component with ReactFlowProvider
const CanvasWithProvider: React.FC<CanvasProps> = (props) => {
  return (
    <ReactFlowProvider>
      <Canvas {...props} />
    </ReactFlowProvider>
  );
};

export default CanvasWithProvider;