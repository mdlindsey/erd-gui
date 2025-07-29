// React context for service dependency injection

import React, { createContext, useContext, ReactNode } from 'react';
import { StateService } from '../types';
import { ServiceFactory } from './ServiceFactory';

// Create the context
const ServiceContext = createContext<StateService | null>(null);

// Props for the provider
export interface ServiceProviderProps {
  children: ReactNode;
  service?: StateService;
}

// Service Provider component
export const ServiceProvider: React.FC<ServiceProviderProps> = ({ 
  children, 
  service 
}) => {
  // Use provided service or get current service from factory
  const stateService = service || ServiceFactory.getInstance().getCurrentService();

  return (
    <ServiceContext.Provider value={stateService}>
      {children}
    </ServiceContext.Provider>
  );
};

// Hook to use the service in components
export const useStateService = (): StateService => {
  const service = useContext(ServiceContext);
  
  if (!service) {
    throw new Error(
      'useStateService must be used within a ServiceProvider. ' +
      'Make sure to wrap your app with <ServiceProvider>.'
    );
  }
  
  return service;
};

// Hook to use state from the service
export const useServiceState = () => {
  const service = useStateService();
  const [state, setState] = React.useState(service.getState());

  React.useEffect(() => {
    // Subscribe to state changes
    const unsubscribe = service.subscribe((newState) => {
      setState(newState);
    });

    // Cleanup subscription
    return unsubscribe;
  }, [service]);

  return state;
};

// Specialized hooks for different parts of state
export const useCanvasService = () => {
  const service = useStateService();
  const state = useServiceState();

  return {
    // State
    viewport: state.canvas.viewport,
    gridVisible: state.canvas.gridVisible,
    snapToGrid: state.canvas.snapToGrid,
    gridSize: state.canvas.gridSize,
    zoomRange: state.canvas.zoomRange,
    
    // Actions
    updateViewport: service.updateViewport.bind(service),
    toggleGrid: service.toggleGrid.bind(service),
    toggleSnapToGrid: service.toggleSnapToGrid.bind(service),
    // fitToView will be implemented in later tasks
  };
};

export const useTablesService = () => {
  const service = useStateService();
  const state = useServiceState();

  return {
    // State
    tables: state.tables.byId,
    allTableIds: state.tables.allIds,
    selectedTableIds: state.tables.selectedIds,
    showColumnTypes: state.tables.showColumnTypes,
    
    // Actions
    addTable: service.addTable.bind(service),
    updateTable: service.updateTable.bind(service),
    deleteTable: service.deleteTable.bind(service),
    selectTables: service.selectTables.bind(service),
    moveTable: service.moveTable.bind(service),
    addColumn: service.addColumn.bind(service),
    updateColumn: service.updateColumn.bind(service),
    deleteColumn: service.deleteColumn.bind(service),
  };
};

export const useRelationshipsService = () => {
  const service = useStateService();
  const state = useServiceState();

  return {
    // State
    relationships: state.relationships.byId,
    allRelationshipIds: state.relationships.allIds,
    showRelationshipNames: state.relationships.showRelationshipNames,
    
    // Actions
    addRelationship: service.addRelationship.bind(service),
    updateRelationship: service.updateRelationship.bind(service),
    deleteRelationship: service.deleteRelationship.bind(service),
  };
};

export const useNotesService = () => {
  const service = useStateService();
  const state = useServiceState();

  return {
    // State
    notes: state.notes.byId,
    allNoteIds: state.notes.allIds,
    showAllNotes: state.notes.showAllNotes,
    
    // Actions
    addNote: service.addNote.bind(service),
    updateNote: service.updateNote.bind(service),
    deleteNote: service.deleteNote.bind(service),
  };
};

export const useUIService = () => {
  const service = useStateService();
  const state = useServiceState();

  return {
    // State
    selectedTool: state.ui.selectedTool,
    showColumnTypes: state.ui.showColumnTypes,
    sidebarOpen: state.ui.sidebarOpen,
    activePanel: state.ui.activePanel,
    theme: state.ui.theme,
    
    // Actions
    setSelectedTool: service.setSelectedTool.bind(service),
    toggleColumnTypes: service.toggleColumnTypes.bind(service),
    toggleSidebar: service.toggleSidebar.bind(service),
    setActivePanel: service.setActivePanel.bind(service),
    setTheme: service.setTheme.bind(service),
  };
};

// Higher-order component for service injection
export function withService<P extends object>(
  Component: React.ComponentType<P & { service: StateService }>
) {
  return function WithServiceComponent(props: P) {
    const service = useStateService();
    return <Component {...props} service={service} />;
  };
}

// Default export
export default ServiceContext;