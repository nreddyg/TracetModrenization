
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface Ticket {
  id: string;
  title: string;
  description: string;
  priority: 'Low' | 'Medium' | 'High' | 'Critical';
  status: 'Open' | 'In Progress' | 'Resolved' | 'Closed';
  assignee: string;
  category: string;
  createdDate: string;
  dueDate?: string;
  tags: string[];
}

interface TicketsState {
  tickets: Ticket[];
  loading: boolean;
  error: string | null;
}

const initialState: TicketsState = {
  tickets: [],
  loading: false,
  error: null,
};

const ticketsSlice = createSlice({
  name: 'tickets',
  initialState,
  reducers: {
    setTickets: (state, action: PayloadAction<Ticket[]>) => {
      state.tickets = action.payload;
    },
    addTicket: (state, action: PayloadAction<Ticket>) => {
      state.tickets.push(action.payload);
    },
    updateTicket: (state, action: PayloadAction<Partial<Ticket> & { id: string }>) => {
      const index = state.tickets.findIndex(ticket => ticket.id === action.payload.id);
      if (index !== -1) {
        state.tickets[index] = { ...state.tickets[index], ...action.payload };
      }
    },
    deleteTicket: (state, action: PayloadAction<string>) => {
      state.tickets = state.tickets.filter(ticket => ticket.id !== action.payload);
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
  },
});

export const { setTickets, addTicket, updateTicket, deleteTicket, setLoading, setError } = ticketsSlice.actions;
export default ticketsSlice.reducer;
