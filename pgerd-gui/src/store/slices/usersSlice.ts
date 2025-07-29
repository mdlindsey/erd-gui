// Users slice for managing user entities

import { createSlice, PayloadAction, nanoid } from '@reduxjs/toolkit';
import { UsersState, User } from '../../types';

const initialState: UsersState = {
  byId: {},
  allIds: [],
};

const usersSlice = createSlice({
  name: 'users',
  initialState,
  reducers: {
    addUser: (state, action: PayloadAction<Omit<User, 'id'>>) => {
      const id = nanoid();
      const user: User = {
        id,
        ...action.payload,
      };
      
      state.byId[id] = user;
      state.allIds.push(id);
    },
    
    updateUser: (state, action: PayloadAction<{ id: string; updates: Partial<Omit<User, 'id'>> }>) => {
      const { id, updates } = action.payload;
      if (state.byId[id]) {
        state.byId[id] = { ...state.byId[id], ...updates };
      }
    },
    
    deleteUser: (state, action: PayloadAction<string>) => {
      const id = action.payload;
      if (state.byId[id]) {
        delete state.byId[id];
        state.allIds = state.allIds.filter(userId => userId !== id);
      }
    },
    
    moveUser: (state, action: PayloadAction<{ id: string; position: { x: number; y: number } }>) => {
      const { id, position } = action.payload;
      if (state.byId[id]) {
        state.byId[id].position = position;
      }
    },
    
    clearAllUsers: (state) => {
      return initialState;
    },
  },
});

export default usersSlice;