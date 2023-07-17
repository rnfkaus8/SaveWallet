import { createAction, createReducer } from '@reduxjs/toolkit';
import Realm from 'realm';
import { Member } from '../model/Member';

export interface MemberState {
  id: string;
  startedAt: string;
}

const initialState: MemberState = {
  id: '',
  startedAt: new Date().toISOString(),
};

export const memberFetched = createAction<MemberState>('member/memberFetched');

export const memberReducer = createReducer(initialState, (builder) => {
  builder.addCase(memberFetched, (state, action) => {
    state.id = action.payload.id;
    state.startedAt = action.payload.startedAt;
  });
});
