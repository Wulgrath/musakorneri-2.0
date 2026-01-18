import { AotyItem } from "@/types";
import { createEntityAdapter, createSlice } from "@reduxjs/toolkit";

export const aotyItemsAdapter = createEntityAdapter<AotyItem, string>({
  selectId: (aotyItem) => `${aotyItem.userId}-${aotyItem.year}`,
});

const aotyInitialState = aotyItemsAdapter.getInitialState();

export const aotyItemsSlice = createSlice({
  name: "aotyItems",
  initialState: aotyInitialState,
  reducers: {
    setAotyItems: aotyItemsAdapter.setAll,
    setAotyItem: aotyItemsAdapter.setOne,
    addAotyItems: aotyItemsAdapter.addMany,
    updateAotyItem: aotyItemsAdapter.updateOne,
  },
});

export const { setAotyItems, setAotyItem, addAotyItems, updateAotyItem } =
  aotyItemsSlice.actions;

export default aotyItemsSlice.reducer;
