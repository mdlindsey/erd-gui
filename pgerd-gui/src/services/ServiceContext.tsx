// React context for service dependency injection

import React, { createContext, ReactNode } from 'react';
import { StateService } from '../types';

// Create the service context
const ServiceContext = createContext<StateService | null>(null);

export interface ServiceProviderProps {
  children: ReactNode;
  service?: StateService;
}

export const ServiceProvider: React.FC<ServiceProviderProps> = ({
  children,
  service,
}) => {
  return (
    <ServiceContext.Provider value={service || null}>
      {children}
    </ServiceContext.Provider>
  );
};

// Export the context for use in hooks file
export { ServiceContext };
