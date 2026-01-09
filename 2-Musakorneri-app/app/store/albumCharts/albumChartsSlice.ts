import { createSlice, PayloadAction } from "@reduxjs/toolkit";

const initialState = {
  selectedYear: "all_time",
};

export const albumChartsSlice = createSlice({
  name: "albumChartsSlice",
  initialState,
  reducers: {
    setSelectedYear: (state, action: PayloadAction<string>) => {
      state.selectedYear = action.payload;
    },
  },
});

export const { setSelectedYear } = albumChartsSlice.actions;
export default albumChartsSlice.reducer;
