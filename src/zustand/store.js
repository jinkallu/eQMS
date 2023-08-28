import { create } from "zustand";

import {
  dynamicIslandSlice,
  alertSnackbarSlice,
  projectSlice,
  repositorySlice,
  databaseSlice,
  teamsSlice,
  userSlice,
  refreshDataSlice,
} from "./storeSlices";

export const useExtnStore = create((...a) => ({
  ...dynamicIslandSlice(...a),
  ...alertSnackbarSlice(...a),
  ...projectSlice(...a),
  ...repositorySlice(...a),
  ...databaseSlice(...a),
  ...teamsSlice(...a),
  ...userSlice(...a),
  ...refreshDataSlice(...a),
}));
