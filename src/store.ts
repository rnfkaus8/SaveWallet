import { configureStore } from '@reduxjs/toolkit';
import { memberReducer } from './states/memberState';
import { goalReducer } from './states/goalState';

export const store = configureStore({
  reducer: {
    member: memberReducer,
    goal: goalReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
