// spectrumStatusSlice.ts
import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "../../redux/store";

interface SpectrumStatus {
  Velocity: number;
  Altitude: number;
  Temperature: number;
  StatusMessage: string;
  IsAscending: boolean;
  IsActionRequired: boolean;
}

interface SpectrumStatusState {
  data: SpectrumStatus | null;
  loading: "idle" | "loading" | "failed";
  error: string | null;
}

const initialState: SpectrumStatusState = {
  data: null,
  loading: "idle",
  error: null,
};

export const fetchSpectrumStatus = createAsyncThunk(
  "spectrumStatus/fetchStatus",
  async () => {
    const socket = new WebSocket(
      "wss://webfrontendassignment-isaraerospace.azurewebsites.net/api/SpectrumWS"
    );

    return new Promise<SpectrumStatus>((resolve, reject) => {
      socket.onopen = () => {
        console.log("WebSocket connection opened");
      };

      socket.onmessage = (event) => {
        const data: SpectrumStatus = JSON.parse(event.data);
        resolve(data);
      };

      socket.onerror = (event) => {
        console.error("WebSocket error:", event);
        reject(new Error("Failed to fetch Spectrum Status"));
      };

      socket.onclose = (event) => {
        console.log("WebSocket connection closed:", event);
      };
    });
  }
);

const spectrumStatusSlice = createSlice({
  name: "spectrumStatus",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchSpectrumStatus.pending, (state) => {
        state.loading = "loading";
      })
      .addCase(
        fetchSpectrumStatus.fulfilled,
        (state, action: PayloadAction<SpectrumStatus>) => {
          state.loading = "idle";
          state.data = action.payload;
          state.error = null;
        }
      )
      .addCase(fetchSpectrumStatus.rejected, (state, action) => {
        state.loading = "failed";
        state.error = action.error.message || "Failed to fetch Spectrum Status";
      });
  },
});
export default spectrumStatusSlice.reducer;

export const selectSpectrumStatus = (state: RootState) => state.spectrumStatus;
