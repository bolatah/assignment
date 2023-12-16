import { configureStore, ThunkAction, Action } from '@reduxjs/toolkit';
import spectrumStatusSlice from '../features/spectrumStatus/spectrumStatusSlice';

export const store = configureStore({
  reducer: {
    spectrumStatus: spectrumStatusSlice,
  },
});

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  unknown,
  Action<string>
>;
