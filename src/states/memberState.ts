import { createAction, createReducer } from '@reduxjs/toolkit';

export interface MemberState {
  id: number;
  name: string;
  createdAt: Date;
  updatedAt: Date;
}

const initialState: MemberState = {
  id: 0,
  name: '',
  createdAt: new Date(),
  updatedAt: new Date(),
};

export const memberFetched = createAction<MemberState>('member/memberFetched');

export const memberReducer = createReducer(initialState, (builder) => {
  builder.addCase(memberFetched, (state, action) => {
    state.id = action.payload.id;
    state.name = action.payload.name;
    state.createdAt = action.payload.createdAt;
    state.updatedAt = action.payload.updatedAt;
  });
});
