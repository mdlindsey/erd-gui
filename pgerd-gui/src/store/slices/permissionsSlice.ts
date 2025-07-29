// Permissions slice for managing user access rights

import { createSlice, PayloadAction, nanoid } from '@reduxjs/toolkit';
import { PermissionsState, Permission } from '../../types';

const initialState: PermissionsState = {
  byId: {},
  allIds: [],
  byTableId: {},
  byUserId: {},
};

const permissionsSlice = createSlice({
  name: 'permissions',
  initialState,
  reducers: {
    addPermission: (state, action: PayloadAction<Omit<Permission, 'id'>>) => {
      const id = nanoid();
      const permission: Permission = {
        id,
        ...action.payload,
      };

      state.byId[id] = permission;
      state.allIds.push(id);

      // Update lookup tables
      if (!state.byTableId[permission.tableId]) {
        state.byTableId[permission.tableId] = [];
      }
      state.byTableId[permission.tableId].push(id);

      if (!state.byUserId[permission.userId]) {
        state.byUserId[permission.userId] = [];
      }
      state.byUserId[permission.userId].push(id);
    },

    updatePermission: (
      state,
      action: PayloadAction<{
        id: string;
        updates: Partial<Omit<Permission, 'id'>>;
      }>
    ) => {
      const { id, updates } = action.payload;
      const permission = state.byId[id];

      if (permission) {
        // Handle table/user changes
        if (updates.tableId && updates.tableId !== permission.tableId) {
          // Remove from old table
          const oldTablePermissions = state.byTableId[permission.tableId];
          if (oldTablePermissions) {
            const index = oldTablePermissions.indexOf(id);
            if (index >= 0) {
              oldTablePermissions.splice(index, 1);
            }
          }

          // Add to new table
          if (!state.byTableId[updates.tableId]) {
            state.byTableId[updates.tableId] = [];
          }
          state.byTableId[updates.tableId].push(id);
        }

        if (updates.userId && updates.userId !== permission.userId) {
          // Remove from old user
          const oldUserPermissions = state.byUserId[permission.userId];
          if (oldUserPermissions) {
            const index = oldUserPermissions.indexOf(id);
            if (index >= 0) {
              oldUserPermissions.splice(index, 1);
            }
          }

          // Add to new user
          if (!state.byUserId[updates.userId]) {
            state.byUserId[updates.userId] = [];
          }
          state.byUserId[updates.userId].push(id);
        }

        state.byId[id] = { ...permission, ...updates };
      }
    },

    deletePermission: (state, action: PayloadAction<string>) => {
      const id = action.payload;
      const permission = state.byId[id];

      if (permission) {
        // Remove from lookup tables
        const tablePermissions = state.byTableId[permission.tableId];
        if (tablePermissions) {
          const tableIndex = tablePermissions.indexOf(id);
          if (tableIndex >= 0) {
            tablePermissions.splice(tableIndex, 1);
          }
        }

        const userPermissions = state.byUserId[permission.userId];
        if (userPermissions) {
          const userIndex = userPermissions.indexOf(id);
          if (userIndex >= 0) {
            userPermissions.splice(userIndex, 1);
          }
        }

        delete state.byId[id];
        state.allIds = state.allIds.filter(permId => permId !== id);
      }
    },

    deletePermissionsByTable: (state, action: PayloadAction<string>) => {
      const tableId = action.payload;
      const permissionIds = state.byTableId[tableId] || [];

      permissionIds.forEach(permId => {
        const permission = state.byId[permId];
        if (permission) {
          // Remove from user lookup
          const userPermissions = state.byUserId[permission.userId];
          if (userPermissions) {
            const userIndex = userPermissions.indexOf(permId);
            if (userIndex >= 0) {
              userPermissions.splice(userIndex, 1);
            }
          }

          delete state.byId[permId];
        }
      });

      state.allIds = state.allIds.filter(id => !permissionIds.includes(id));
      delete state.byTableId[tableId];
    },

    deletePermissionsByUser: (state, action: PayloadAction<string>) => {
      const userId = action.payload;
      const permissionIds = state.byUserId[userId] || [];

      permissionIds.forEach(permId => {
        const permission = state.byId[permId];
        if (permission) {
          // Remove from table lookup
          const tablePermissions = state.byTableId[permission.tableId];
          if (tablePermissions) {
            const tableIndex = tablePermissions.indexOf(permId);
            if (tableIndex >= 0) {
              tablePermissions.splice(tableIndex, 1);
            }
          }

          delete state.byId[permId];
        }
      });

      state.allIds = state.allIds.filter(id => !permissionIds.includes(id));
      delete state.byUserId[userId];
    },

    clearAllPermissions: () => {
      return initialState;
    },
  },
});

export default permissionsSlice;
