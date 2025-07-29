// Service factory for dependency injection

import { Store } from '@reduxjs/toolkit';
import { StateService } from '../types';
import { RootState } from '../store';
import { ReduxStateService } from './StateService';

export type ServiceType = 'redux' | 'memory' | 'mock';

export interface ServiceConfig {
  type: ServiceType;
  store?: Store<RootState>;
  // Future: Add other service configurations
  // localStorage?: boolean;
  // apiEndpoint?: string;
}

export class ServiceFactory {
  private static instance: ServiceFactory;
  private services: Map<string, StateService> = new Map();
  private currentService: StateService | null = null;

  private constructor() {}

  static getInstance(): ServiceFactory {
    if (!ServiceFactory.instance) {
      ServiceFactory.instance = new ServiceFactory();
    }
    return ServiceFactory.instance;
  }

  createService(config: ServiceConfig): StateService {
    const key = this.generateServiceKey(config);

    // Return existing service if already created
    if (this.services.has(key)) {
      return this.services.get(key)!;
    }

    let service: StateService;

    switch (config.type) {
      case 'redux':
        if (!config.store) {
          throw new Error('Redux store is required for Redux service');
        }
        service = new ReduxStateService(config.store);
        break;

      case 'memory':
        // Future implementation: In-memory state service
        throw new Error('Memory service not yet implemented');

      case 'mock':
        // Future implementation: Mock service for testing
        throw new Error('Mock service not yet implemented');

      default:
        throw new Error(`Unknown service type: ${config.type}`);
    }

    this.services.set(key, service);
    return service;
  }

  setCurrentService(service: StateService): void {
    this.currentService = service;
  }

  getCurrentService(): StateService {
    if (!this.currentService) {
      throw new Error(
        'No current service set. Call setCurrentService() first.'
      );
    }
    return this.currentService;
  }

  clearServices(): void {
    this.services.clear();
    this.currentService = null;
  }

  private generateServiceKey(config: ServiceConfig): string {
    return `${config.type}-${Date.now()}`;
  }
}

// Convenience function for creating and configuring services
export function createStateService(config: ServiceConfig): StateService {
  const factory = ServiceFactory.getInstance();
  const service = factory.createService(config);
  factory.setCurrentService(service);
  return service;
}

// Default service initialization
export function initializeDefaultService(
  store: Store<RootState>
): StateService {
  return createStateService({
    type: 'redux',
    store,
  });
}
