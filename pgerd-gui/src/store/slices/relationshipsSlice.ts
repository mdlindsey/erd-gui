// Relationships slice for managing foreign key relationships

import { createSlice, PayloadAction, nanoid } from '@reduxjs/toolkit';
import { RelationshipsState, Relationship, CreateRelationshipPayload } from '../../types';

// Initial state
const initialState: RelationshipsState = {
  byId: {},
  allIds: [],
  bySourceTable: {},
  byTargetTable: {},
  showRelationshipNames: false,
  showCascadeActions: false,
};

const relationshipsSlice = createSlice({
  name: 'relationships',
  initialState,
  reducers: {
    // Relationship CRUD operations
    addRelationship: (state, action: PayloadAction<CreateRelationshipPayload>) => {
      const id = nanoid();
      const relationship: Relationship = {
        id,
        sourceTableId: action.payload.sourceTableId,
        targetTableId: action.payload.targetTableId,
        sourceColumnId: action.payload.sourceColumnId,
        targetColumnId: action.payload.targetColumnId,
        type: action.payload.type,
        onDelete: action.payload.onDelete || 'RESTRICT',
        onUpdate: action.payload.onUpdate || 'RESTRICT',
        name: action.payload.name,
        enforced: true,
      };
      
      state.byId[id] = relationship;
      state.allIds.push(id);
      
      // Update lookup tables
      if (!state.bySourceTable[relationship.sourceTableId]) {
        state.bySourceTable[relationship.sourceTableId] = [];
      }
      state.bySourceTable[relationship.sourceTableId].push(id);
      
      if (!state.byTargetTable[relationship.targetTableId]) {
        state.byTargetTable[relationship.targetTableId] = [];
      }
      state.byTargetTable[relationship.targetTableId].push(id);
    },
    
    updateRelationship: (state, action: PayloadAction<{ 
      id: string; 
      updates: Partial<Omit<Relationship, 'id'>> 
    }>) => {
      const { id, updates } = action.payload;
      const relationship = state.byId[id];
      
      if (relationship) {
        // If source or target table changes, update lookup tables
        if (updates.sourceTableId && updates.sourceTableId !== relationship.sourceTableId) {
          // Remove from old source table
          const oldSourceRelationships = state.bySourceTable[relationship.sourceTableId];
          if (oldSourceRelationships) {
            const index = oldSourceRelationships.indexOf(id);
            if (index >= 0) {
              oldSourceRelationships.splice(index, 1);
            }
          }
          
          // Add to new source table
          if (!state.bySourceTable[updates.sourceTableId]) {
            state.bySourceTable[updates.sourceTableId] = [];
          }
          state.bySourceTable[updates.sourceTableId].push(id);
        }
        
        if (updates.targetTableId && updates.targetTableId !== relationship.targetTableId) {
          // Remove from old target table
          const oldTargetRelationships = state.byTargetTable[relationship.targetTableId];
          if (oldTargetRelationships) {
            const index = oldTargetRelationships.indexOf(id);
            if (index >= 0) {
              oldTargetRelationships.splice(index, 1);
            }
          }
          
          // Add to new target table
          if (!state.byTargetTable[updates.targetTableId]) {
            state.byTargetTable[updates.targetTableId] = [];
          }
          state.byTargetTable[updates.targetTableId].push(id);
        }
        
        // Update the relationship
        state.byId[id] = { ...relationship, ...updates };
      }
    },
    
    deleteRelationship: (state, action: PayloadAction<string>) => {
      const id = action.payload;
      const relationship = state.byId[id];
      
      if (relationship) {
        // Remove from lookup tables
        const sourceRelationships = state.bySourceTable[relationship.sourceTableId];
        if (sourceRelationships) {
          const sourceIndex = sourceRelationships.indexOf(id);
          if (sourceIndex >= 0) {
            sourceRelationships.splice(sourceIndex, 1);
          }
        }
        
        const targetRelationships = state.byTargetTable[relationship.targetTableId];
        if (targetRelationships) {
          const targetIndex = targetRelationships.indexOf(id);
          if (targetIndex >= 0) {
            targetRelationships.splice(targetIndex, 1);
          }
        }
        
        // Remove from main state
        delete state.byId[id];
        state.allIds = state.allIds.filter(relationshipId => relationshipId !== id);
      }
    },
    
    // Bulk operations
    deleteRelationshipsByTable: (state, action: PayloadAction<string>) => {
      const tableId = action.payload;
      const relatedRelationships = [
        ...(state.bySourceTable[tableId] || []),
        ...(state.byTargetTable[tableId] || []),
      ];
      
      // Remove duplicates
      const uniqueRelationships = [...new Set(relatedRelationships)];
      
      uniqueRelationships.forEach(relationshipId => {
        const relationship = state.byId[relationshipId];
        if (relationship) {
          // Remove from lookup tables
          const sourceRelationships = state.bySourceTable[relationship.sourceTableId];
          if (sourceRelationships) {
            const sourceIndex = sourceRelationships.indexOf(relationshipId);
            if (sourceIndex >= 0) {
              sourceRelationships.splice(sourceIndex, 1);
            }
          }
          
          const targetRelationships = state.byTargetTable[relationship.targetTableId];
          if (targetRelationships) {
            const targetIndex = targetRelationships.indexOf(relationshipId);
            if (targetIndex >= 0) {
              targetRelationships.splice(targetIndex, 1);
            }
          }
          
          // Remove from main state
          delete state.byId[relationshipId];
        }
      });
      
      // Update allIds
      state.allIds = state.allIds.filter(id => !uniqueRelationships.includes(id));
      
      // Clean up lookup tables
      delete state.bySourceTable[tableId];
      delete state.byTargetTable[tableId];
    },
    
    // Visual adjustments
    updateRelationshipControlPoints: (state, action: PayloadAction<{ 
      id: string; 
      controlPoints: Array<{ id: string; x: number; y: number; type: string }> 
    }>) => {
      const { id, controlPoints } = action.payload;
      if (state.byId[id]) {
        state.byId[id].controlPoints = controlPoints;
      }
    },
    
    // View settings
    toggleRelationshipNames: (state) => {
      state.showRelationshipNames = !state.showRelationshipNames;
    },
    
    setShowRelationshipNames: (state, action: PayloadAction<boolean>) => {
      state.showRelationshipNames = action.payload;
    },
    
    toggleCascadeActions: (state) => {
      state.showCascadeActions = !state.showCascadeActions;
    },
    
    setShowCascadeActions: (state, action: PayloadAction<boolean>) => {
      state.showCascadeActions = action.payload;
    },
    
    // Bulk import/export
    importRelationships: (state, action: PayloadAction<Relationship[]>) => {
      action.payload.forEach(relationship => {
        const newId = nanoid();
        const newRelationship: Relationship = {
          ...relationship,
          id: newId,
        };
        
        state.byId[newId] = newRelationship;
        state.allIds.push(newId);
        
        // Update lookup tables
        if (!state.bySourceTable[newRelationship.sourceTableId]) {
          state.bySourceTable[newRelationship.sourceTableId] = [];
        }
        state.bySourceTable[newRelationship.sourceTableId].push(newId);
        
        if (!state.byTargetTable[newRelationship.targetTableId]) {
          state.byTargetTable[newRelationship.targetTableId] = [];
        }
        state.byTargetTable[newRelationship.targetTableId].push(newId);
      });
    },
    
    // Reset state
    clearAllRelationships: (state) => {
      return initialState;
    },
    
    // Validation helpers
    validateRelationship: (state, action: PayloadAction<string>) => {
      // This would typically trigger side effects or set validation state
      // For now, it's a placeholder for validation logic
      const id = action.payload;
      const relationship = state.byId[id];
      if (relationship) {
        // Validation logic would go here
        // For example, checking if source and target tables/columns exist
      }
    },
  },
});

export default relationshipsSlice;