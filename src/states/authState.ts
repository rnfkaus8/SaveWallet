import { createAction, createReducer } from '@reduxjs/toolkit';

export interface AuthState {
  isAuthInitialize: boolean;
}

const initialState: AuthState = {
  isAuthInitialize: false,
};

export const authInitialize = createAction('auth/authInitialize');

export const authReducer = createReducer(initialState, (builder) => {
  builder.addCase(authInitialize, (state, action) => {
    state.isAuthInitialize = true;
  });
});
