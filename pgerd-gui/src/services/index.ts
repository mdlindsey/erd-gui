// Export the main service classes
export { ReduxStateService } from './StateService';
export { ServiceFactory, createStateService } from './ServiceFactory';

// Export the context and provider
export { ServiceProvider, ServiceContext } from './ServiceContext';

// Export all hooks
export {
  useStateService,
  useServiceState,
  useCanvasService,
  useTablesService,
  useRelationshipsService,
  useNotesService,
  useUIService,
} from './hooks';

// Export the abstract StateService from types
export { StateService } from '../types';
