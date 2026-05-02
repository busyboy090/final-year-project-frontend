// store.ts
import { configureStore } from '@reduxjs/toolkit';
import appReducer from "./appSlice.ts"
import authReducer from "./authSlice.ts";
import userReducer from "./userSlice.ts";

export const store = configureStore({
  reducer: {
    app: appReducer,
    auth: authReducer,
    user: userReducer
  },
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
