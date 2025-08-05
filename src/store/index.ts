import { configureStore } from '@reduxjs/toolkit';
import { adsApi } from './api';
import authSlice from './authSlice';
import uiSlice from './uiSlice';

export const store = configureStore({
  reducer: {
    [adsApi.reducerPath]: adsApi.reducer,
    auth: authSlice,
    ui: uiSlice,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(adsApi.middleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;