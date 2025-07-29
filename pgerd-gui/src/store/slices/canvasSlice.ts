// Canvas slice for viewport and grid management

import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { CanvasState, Viewport } from '../../types';

// Initial state
const initialState: CanvasState = {
  viewport: {
    x: 0,
    y: 0,
    zoom: 1,
  },
  gridVisible: true,
  snapToGrid: true,
  gridSize: 15,
  zoomRange: {
    min: 0.25,
    max: 4,
  },
};

const canvasSlice = createSlice({
  name: 'canvas',
  initialState,
  reducers: {
    // Viewport actions
    updateViewport: (state, action: PayloadAction<Partial<Viewport>>) => {
      state.viewport = { ...state.viewport, ...action.payload };
    },
    
    setZoom: (state, action: PayloadAction<number>) => {
      const zoom = Math.max(
        state.zoomRange.min,
        Math.min(state.zoomRange.max, action.payload)
      );
      state.viewport.zoom = zoom;
    },
    
    zoomIn: (state) => {
      const newZoom = state.viewport.zoom * 1.2;
      state.viewport.zoom = Math.min(state.zoomRange.max, newZoom);
    },
    
    zoomOut: (state) => {
      const newZoom = state.viewport.zoom / 1.2;
      state.viewport.zoom = Math.max(state.zoomRange.min, newZoom);
    },
    
    resetZoom: (state) => {
      state.viewport.zoom = 1;
    },
    
    panTo: (state, action: PayloadAction<{ x: number; y: number }>) => {
      state.viewport.x = action.payload.x;
      state.viewport.y = action.payload.y;
    },
    
    panBy: (state, action: PayloadAction<{ deltaX: number; deltaY: number }>) => {
      state.viewport.x += action.payload.deltaX;
      state.viewport.y += action.payload.deltaY;
    },
    
    // Grid actions
    toggleGrid: (state) => {
      state.gridVisible = !state.gridVisible;
    },
    
    setGridVisible: (state, action: PayloadAction<boolean>) => {
      state.gridVisible = action.payload;
    },
    
    toggleSnapToGrid: (state) => {
      state.snapToGrid = !state.snapToGrid;
    },
    
    setSnapToGrid: (state, action: PayloadAction<boolean>) => {
      state.snapToGrid = action.payload;
    },
    
    setGridSize: (state, action: PayloadAction<number>) => {
      if (action.payload > 0) {
        state.gridSize = action.payload;
      }
    },
    
    // Zoom range actions
    setZoomRange: (state, action: PayloadAction<{ min: number; max: number }>) => {
      if (action.payload.min > 0 && action.payload.max > action.payload.min) {
        state.zoomRange = action.payload;
        // Ensure current zoom is within new range
        state.viewport.zoom = Math.max(
          action.payload.min,
          Math.min(action.payload.max, state.viewport.zoom)
        );
      }
    },
    
    // Fit to view action
    fitToView: (state, action: PayloadAction<{ 
      bounds: { x: number; y: number; width: number; height: number };
      viewportSize: { width: number; height: number };
      padding?: number;
    }>) => {
      const { bounds, viewportSize, padding = 50 } = action.payload;
      
      // Calculate zoom to fit content
      const scaleX = (viewportSize.width - padding * 2) / bounds.width;
      const scaleY = (viewportSize.height - padding * 2) / bounds.height;
      const scale = Math.min(scaleX, scaleY);
      
      // Clamp zoom to allowed range
      const zoom = Math.max(
        state.zoomRange.min,
        Math.min(state.zoomRange.max, scale)
      );
      
      // Center the content
      const centerX = bounds.x + bounds.width / 2;
      const centerY = bounds.y + bounds.height / 2;
      const viewportCenterX = viewportSize.width / 2;
      const viewportCenterY = viewportSize.height / 2;
      
      state.viewport = {
        x: viewportCenterX - centerX * zoom,
        y: viewportCenterY - centerY * zoom,
        zoom,
      };
    },
    
    // Reset canvas to initial state
    resetCanvas: (state) => {
      return initialState;
    },
  },
});

export default canvasSlice;