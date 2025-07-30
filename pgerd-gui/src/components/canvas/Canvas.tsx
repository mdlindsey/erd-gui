// React Flow Canvas Component for ERD GUI

import React, { useCallback, useMemo } from 'react';
import {
  ReactFlow,
  Background,
  BackgroundVariant,
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
  OnMove,
  OnConnect,
  MarkerType,
} from 'reactflow';
import { useSelector, useDispatch } from 'react-redux';
import { RootState, canvasActions } from '../../store';
import CanvasControls from './CanvasControls';
import 'reactflow/dist/style.css';

import { useCanvasService } from '../../services';

// Type definitions for node data
interface TableNodeData {
  tableName?: string;
  columns?: Array<{ name: string; type: string }>;
}

interface NoteNodeData {
  content?: string;
  color?: string;
}

interface UserNodeData {
  userName?: string;
  color?: string;
}

// Custom node types for ERD entities
const TableNode = React.memo(
  ({ data, selected }: { data: TableNodeData; selected: boolean }) => {
    return (
      <div
        className={`table-node ${selected ? 'selected' : ''}`}
        style={{
          background: '#fff',
          border: '2px solid #ddd',
          borderRadius: '8px',
          padding: '12px',
          minWidth: '200px',
          boxShadow: selected
            ? '0 0 0 2px #3b82f6'
            : '0 2px 4px rgba(0,0,0,0.1)',
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
          {data.columns?.map((col, idx) => (
            <div key={idx} style={{ margin: '2px 0' }}>
              {col.name} <span style={{ color: '#999' }}>({col.type})</span>
            </div>
          )) || 'No columns'}
        </div>
      </div>
    );
  }
);

const NoteNode = React.memo(
  ({ data, selected }: { data: NoteNodeData; selected: boolean }) => {
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
          boxShadow: selected
            ? '0 0 0 2px #3b82f6'
            : '0 1px 3px rgba(0,0,0,0.1)',
          fontSize: '14px',
        }}
      >
        {data.content || 'Note content'}
      </div>
    );
  }
);

const UserNode = React.memo(
  ({ data, selected }: { data: UserNodeData; selected: boolean }) => {
    return (
      <div
        className={`user-node ${selected ? 'selected' : ''}`}
        style={{
          background: data.color || '#e0f2fe',
          border: '2px solid #0277bd',
          borderRadius: '50%',
          width: '80px',
          height: '80px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: selected
            ? '0 0 0 2px #3b82f6'
            : '0 2px 4px rgba(0,0,0,0.1)',
          fontSize: '12px',
          fontWeight: 'bold',
          color: '#0277bd',
        }}
      >
        {data.userName || 'User'}
      </div>
    );
  }
);

// Define node types
const nodeTypes: NodeTypes = {
  table: TableNode,
  note: NoteNode,
  user: UserNode,
};

// Note: Custom edge types will be implemented in later tasks
// For now, use default edge rendering
const edgeTypes: EdgeTypes = {};

export interface CanvasProps {
  className?: string;
  style?: React.CSSProperties;
}

const Canvas: React.FC<CanvasProps> = ({ className, style }) => {
  const dispatch = useDispatch();
  const canvasState = useSelector((state: RootState) => state.canvas);
  const canvasService = useCanvasService();

  // Sample nodes and edges for initial display
  const initialNodes: Node[] = [
    {
      id: '1',
      type: 'table',
      position: { x: 100, y: 100 },
      data: {
        tableName: 'users',
        columns: [
          { name: 'id', type: 'SERIAL' },
          { name: 'name', type: 'VARCHAR(255)' },
          { name: 'email', type: 'VARCHAR(255)' },
        ],
      },
    },
    {
      id: '2',
      type: 'table',
      position: { x: 400, y: 100 },
      data: {
        tableName: 'posts',
        columns: [
          { name: 'id', type: 'SERIAL' },
          { name: 'user_id', type: 'INTEGER' },
          { name: 'title', type: 'VARCHAR(255)' },
        ],
      },
    },
    {
      id: '3',
      type: 'note',
      position: { x: 100, y: 300 },
      data: {
        content: 'This is a sample note',
        color: '#ffd700',
      },
    },
    {
      id: '4',
      type: 'user',
      position: { x: 400, y: 300 },
      data: {
        userName: 'Admin',
        color: '#e0f2fe',
      },
    },
  ];

  const initialEdges: Edge[] = [
    {
      id: 'e1-2',
      source: '1',
      target: '2',
      type: 'smoothstep',
      markerEnd: { type: MarkerType.Arrow, color: '#333' },
      data: {
        relationshipType: 'one-to-many',
        sourceColumn: 'id',
        targetColumn: 'user_id',
      },
    },
  ];

  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

  // Handle viewport changes and sync with Redux state
  const onMove: OnMove = useCallback(
    (_event, viewport) => {
      dispatch(canvasActions.updateViewport(viewport));
      canvasService.updateViewport(viewport);
    },
    [dispatch, canvasService]
  );

  // Handle new connections
  const onConnect: OnConnect = useCallback(
    (params: Connection) => {
      setEdges(eds => addEdge(params, eds));
    },
    [setEdges]
  );

  // Handle node drag end to snap to grid if enabled
  const onNodeDragStop = useCallback(
    (_event: React.MouseEvent, node: Node) => {
      if (canvasService.snapToGrid) {
        const gridSize = canvasService.gridSize;
        const snappedX = Math.round(node.position.x / gridSize) * gridSize;
        const snappedY = Math.round(node.position.y / gridSize) * gridSize;

        setNodes(nodes =>
          nodes.map(n =>
            n.id === node.id
              ? { ...n, position: { x: snappedX, y: snappedY } }
              : n
          )
        );
      }
    },
    [canvasService.snapToGrid, canvasService.gridSize, setNodes]
  );

  // Use Redux state for viewport
  const viewport = useMemo(
    () => ({
      x: canvasState?.viewport?.x ?? 0,
      y: canvasState?.viewport?.y ?? 0,
      zoom: canvasState?.viewport?.zoom ?? 1,
    }),
    [
      canvasState?.viewport?.x,
      canvasState?.viewport?.y,
      canvasState?.viewport?.zoom,
    ]
  );

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
        defaultViewport={viewport}
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

        <CanvasControls />

        <Panel position="top-left">
          <div
            style={{
              background: 'white',
              padding: '8px',
              borderRadius: '4px',
              fontSize: '12px',
            }}
          >
            Zoom: {Math.round((canvasState?.viewport?.zoom ?? 1) * 100)}%
          </div>
        </Panel>
      </ReactFlow>
    </div>
  );
};

Canvas.displayName = 'Canvas';

// Wrapper component with ReactFlowProvider
const CanvasWithProvider: React.FC<CanvasProps> = props => {
  return (
    <ReactFlowProvider>
      <Canvas {...props} />
    </ReactFlowProvider>
  );
};

export default CanvasWithProvider;
