import { create } from "zustand";

import {
  dynamicIslandSlice,
  alertSnackbarSlice,
  projectSlice,
  repositorySlice,
  databaseSlice,
  teamsSlice,
  userSlice,
  pullRequestSlice,
  refreshDataSlice,
  proseMirrorSlice,
} from "./storeSlices";

export const useExtnStore = create((...a) => ({
  ...dynamicIslandSlice(...a),
  ...alertSnackbarSlice(...a),
  ...projectSlice(...a),
  ...repositorySlice(...a),
  ...databaseSlice(...a),
  ...teamsSlice(...a),
  ...userSlice(...a),
  ...pullRequestSlice(...a),
  ...refreshDataSlice(...a),
  ...proseMirrorSlice(...a),
}));
