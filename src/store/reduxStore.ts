
import { configureStore } from '@reduxjs/toolkit';
import { useDispatch, useSelector, TypedUseSelectorHook } from 'react-redux';
import ticketsSlice from './slices/ticketsSlice';
import projectsSlice from './slices/projectsSlice';
import tasksSlice from './slices/tasksSlice';
import uiSlice from './slices/uiSlice';

export const store = configureStore({
  reducer: {
    tickets: ticketsSlice,
    projects: projectsSlice,//main slice: don't change this.
    tasks: tasksSlice,
    ui: uiSlice,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
