
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface UIState {
  sidebarCollapsed: boolean;
  currentBreadcrumb: { label: string; href?: string; icon?: React.ReactNode }[];
  theme: 'light' | 'dark';
  notifications: Array<{ id: string; message: string; type: 'success' | 'error' | 'warning' | 'info' }>;
}

const initialState: UIState = {
  sidebarCollapsed: false,
  currentBreadcrumb: [],
  theme: 'light',
  notifications: [],
};

const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    toggleSidebar: (state) => {
      state.sidebarCollapsed = !state.sidebarCollapsed;
    },
    setBreadcrumb: (state, action: PayloadAction<UIState['currentBreadcrumb']>) => {
      state.currentBreadcrumb = action.payload;
    },
    setTheme: (state, action: PayloadAction<'light' | 'dark'>) => {
      state.theme = action.payload;
    },
    addNotification: (state, action: PayloadAction<Omit<UIState['notifications'][0], 'id'>>) => {
      state.notifications.push({
        ...action.payload,
        id: Date.now().toString(),
      });
    },
    removeNotification: (state, action: PayloadAction<string>) => {
      state.notifications = state.notifications.filter(notif => notif.id !== action.payload);
    },
  },
});

export const { toggleSidebar, setBreadcrumb, setTheme, addNotification, removeNotification } = uiSlice.actions;
export default uiSlice.reducer;
