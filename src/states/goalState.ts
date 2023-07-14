import { createAction, createReducer } from '@reduxjs/toolkit';

export interface GoalState {
  goalPrice: number;
}

const initialState = {
  goalPrice: 200000,
};

export const goalFetched = createAction<GoalState>('goal/goalFetched');

export const goalReducer = createReducer(initialState, (builder) => {
  builder.addCase(goalFetched, (state, action) => {
    state.goalPrice = action.payload.goalPrice;
  });
});
