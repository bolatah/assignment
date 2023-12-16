// spectrumStatusSlice.ts
import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '../../redux/store';

interface SpectrumStatus {
  velocity: number;
  altitude: number;
  temperature: number;
  statusMessage: string;
  isAscending: boolean;
  isActionRequired: boolean;
}

interface SpectrumStatusState {
  data: SpectrumStatus | null;
  loading: 'idle' | 'loading' | 'failed';
  error: string | null;
}

const initialState: SpectrumStatusState = {
  data: null,
  loading: 'idle',
  error: null,
};

export const fetchSpectrumStatus = createAsyncThunk('spectrumStatus/fetchStatus', async () => {
  const response = await fetch('https://webfrontendassignment-isaraerospace.azurewebsites.net/api/SpectrumStatus');
  if (!response.ok) {
    throw new Error('Failed to fetch Spectrum Status');
  }
  const data = await response.json();
  return data;
});



const spectrumStatusSlice = createSlice({
  name: 'spectrumStatus',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchSpectrumStatus.pending, (state) => {
        state.loading = 'loading';
      })
      .addCase(fetchSpectrumStatus.fulfilled, (state, action: PayloadAction<SpectrumStatus>) => {
        state.loading = 'idle';
        state.data = action.payload;
        state.error = null;
      })
      .addCase(fetchSpectrumStatus.rejected, (state, action) => {
        state.loading = 'failed';
        state.error = action.error.message || 'Failed to fetch Spectrum Status';
      });
  },
});
export default spectrumStatusSlice.reducer;

export const selectSpectrumStatus = (state: RootState) => state.spectrumStatus;