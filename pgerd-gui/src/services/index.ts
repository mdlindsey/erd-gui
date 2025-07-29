// Services module exports

// Core service classes and types
export { ReduxStateService } from './StateService';
export { 
  ServiceFactory, 
  createStateService, 
  initializeDefaultService,
  type ServiceType,
  type ServiceConfig 
} from './ServiceFactory';

// React context and hooks
export {
  ServiceProvider,
  useStateService,
  useServiceState,
  useCanvasService,
  useTablesService,
  useRelationshipsService,
  useNotesService,
  useUIService,
  withService,
  type ServiceProviderProps
} from './ServiceContext';

// Re-export StateService abstract class from types
export { StateService } from '../types';

// Default export for convenience
export { default as ServiceContext } from './ServiceContext';