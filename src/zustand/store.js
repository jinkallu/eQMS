import { create } from "zustand";

import {
  dynamicIslandSlice,
  alertSnackbarSlice,
  projectSlice,
  repositorySlice,
  databaseSlice,
} from "./storeSlices";

export const useExtnStore = create((...a) => ({
  ...dynamicIslandSlice(...a),
  ...alertSnackbarSlice(...a),
  ...projectSlice(...a),
  ...repositorySlice(...a),
  ...databaseSlice(...a),
}));
