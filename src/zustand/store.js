import { create } from "zustand";

export const useDynamicIsland = create((set) => ({
  open: false,
  message: "",
  severity: "",
  defaultMessage: "Org Hub",
  temporary: true,
  setMessage: ({ showAlert, message, severity, temporary }) =>
    set((state) => ({ open, message, severity, temporary })),

  setDefaultMessage: (defaultMessage) =>
    set((state) => ({ defaultMessage, message: "", open: false })),
}));

export const useProject = create((set) => ({
  project: {},
  setProject: (project) => set((state) => ({ project })),
}));
