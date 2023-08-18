import { configureStore } from '@reduxjs/toolkit';
import { memberReducer } from './states/memberState';
import { goalReducer } from './states/goalState';
import { authReducer } from './states/authState';

export const store = configureStore({
  reducer: {
    member: memberReducer,
    goal: goalReducer,
    auth: authReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
