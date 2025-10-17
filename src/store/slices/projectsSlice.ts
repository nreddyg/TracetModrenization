
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface Project {
  id: string;
  name: string;
  description: string;
  manager: string;
  status: 'Planning' | 'Active' | 'On Hold' | 'Completed';
  priority: 'Low' | 'Medium' | 'High' | 'Critical';
  startDate: string;
  endDate: string;
  budget: number;
  createdDate: string;
}

interface ProjectsState {
  projects: Project[];
  loading: boolean;
  error: string | null;
  companyId:string | null;
  userId?:number | null;
  branch?:string;
  branchId?:string;
  branchCode?:string;
}

const initialState: ProjectsState = {
  projects: [],
  loading: false,
  error: null,
  companyId:'',
  userId:null,
  branch:'',
  branchId:"",
  branchCode:'',
};

const projectsSlice = createSlice({
  name: 'projects',
  initialState,
  reducers: {
    setProjects: (state, action: PayloadAction<Project[]>) => {
      state.projects = action.payload;
    },
    addProject: (state, action: PayloadAction<Project>) => {
      state.projects.push(action.payload);
    },
    updateProject: (state, action: PayloadAction<Partial<Project> & { id: string }>) => {
      const index = state.projects.findIndex(project => project.id === action.payload.id);
      if (index !== -1) {
        state.projects[index] = { ...state.projects[index], ...action.payload };
      }
    },
    deleteProject: (state, action: PayloadAction<string>) => {
      state.projects = state.projects.filter(project => project.id !== action.payload);
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setCompanyId:(state,action:PayloadAction<string | null>)=>{
      state.companyId=action.payload
    },
    setBranch:(state,action:PayloadAction<string>)=>{
      state.branch=action.payload
    },
    setBranchId:(state,action:PayloadAction<string>)=>{
      state.branchId=action.payload
    },
    setBranchCode:(state,action:PayloadAction<string>)=>{
      state.branchCode=action.payload
    },
    setUserId:(state,action:PayloadAction<number | null>)=>{
      state.userId=action.payload
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
  },
});

export const { setProjects, addProject, updateProject, deleteProject, setLoading,
  setCompanyId,setBranch,setBranchId,setBranchCode,setUserId,setError } = projectsSlice.actions;
export default projectsSlice.reducer;
