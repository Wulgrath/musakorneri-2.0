import { RootState } from "../../index";
import { usersAdapter } from "../usersSlice";

// Get the selectors from the adapter
const adapterSelectors = usersAdapter.getSelectors(
  (state: RootState) => state.users
);

// Export the basic selectors
export const selectAllUsers = adapterSelectors.selectAll;
export const selectUserById = adapterSelectors.selectById;
export const selectUserIds = adapterSelectors.selectIds;
export const selectUserEntities = adapterSelectors.selectEntities;
export const selectUserTotal = adapterSelectors.selectTotal;
