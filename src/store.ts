import { configureStore } from '@reduxjs/toolkit';
import { memberReducer } from './states/memberState';

export const store = configureStore({
  reducer: {
    member: memberReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
