import React from 'react';
import { useReactFlow } from 'reactflow';
import { useSelector, useDispatch } from 'react-redux';
import { RootState, canvasActions } from '../../store';
import './CanvasControls.css';

const CanvasControls: React.FC = () => {
  const { fitView, zoomIn, zoomOut } = useReactFlow();
  const dispatch = useDispatch();
  const canvasState = useSelector((state: RootState) => state.canvas);
  const zoom = canvasState?.viewport?.zoom ?? 1;

  const handleZoomIn = () => {
    const newZoom = Math.min(zoom * 1.2, 4.0);
    dispatch(canvasActions.setZoom(newZoom));
    zoomIn();
  };

  const handleZoomOut = () => {
    const newZoom = Math.max(zoom / 1.2, 0.25);
    dispatch(canvasActions.setZoom(newZoom));
    zoomOut();
  };

  const handleFitView = () => {
    fitView({ padding: 0.1 });
  };

  const handleReset = () => {
    dispatch(canvasActions.setZoom(1.0));
    dispatch(canvasActions.panTo({ x: 0, y: 0 }));
    fitView({ padding: 0.1 });
  };

  return (
    <div className="canvas-controls">
      <button
        className="control-button"
        onClick={handleZoomIn}
        title="Zoom In"
        aria-label="Zoom In"
      >
        +
      </button>
      <button
        className="control-button"
        onClick={handleZoomOut}
        title="Zoom Out"
        aria-label="Zoom Out"
      >
        −
      </button>
      <button
        className="control-button"
        onClick={handleFitView}
        title="Fit to View"
        aria-label="Fit to View"
      >
        ⊞
      </button>
      <button
        className="control-button"
        onClick={handleReset}
        title="Reset View"
        aria-label="Reset View"
      >
        ⌂
      </button>
      <div className="zoom-display">{Math.round(zoom * 100)}%</div>
    </div>
  );
};

export default CanvasControls;
