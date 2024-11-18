import { StoreState } from '@/types';
import { StateCreator } from 'zustand';

let toastId = 0;

export type ToastState = {
  toastList: ToastType[];
  addToast: (message: string, attributes: string, variant: string) => number;
  removeToast: (id: number) => void;
};

export type ToastType = {
  id: number;
  message: string;
  attributes: string;
  variant: 'success' | 'error' | 'warning' | 'info';
};

export const createToastSlice: StateCreator<StoreState, [], [], ToastState> = (
  set,
) => ({
  toastList: [],
  addToast: (message, attributes, varint) => {
    const id = ++toastId;
    const newToast: ToastType = { id, message, attributes, variant: 'info' };
    set((state) => ({ toastList: [...state.toastList, newToast] }));
    return id;
  },
  removeToast: (id) => {
    set((state) => ({
      toastList: state.toastList.filter((toast) => toast.id !== id),
    }));
  },
});
