import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { generateUniqueId } from '../../utils/utils';

export interface TaskProps {
  id: number | null;
  boardId: string;
  name: string;
  description: string;
  dueDate: string;
  priority: string;
  columnId: string;
}

export const createEmptyTask = (): TaskProps => {
  return {
    id: generateUniqueId(),
    boardId: '',
    name: '',
    description: '',
    dueDate: new Date().toString(),
    priority: '',
    columnId: '',
  };
};

interface TasksState {
  tasks: TaskProps[];
}

const initialTasks: TaskProps[] = [];

const initialState: TasksState = {
  tasks: initialTasks,
};

const tasksSlice = createSlice({
  name: 'tasks',
  initialState,
  reducers: {
    loadTasks(state, action: PayloadAction<TaskProps[]>) {
      state.tasks = action.payload;
    },
    addTask(state, action: PayloadAction<TaskProps>) {
      state.tasks.push(action.payload);
    },
    editTask(state, action: PayloadAction<TaskProps>) {
      const { id } = action.payload;
      const existingTaskIndex = state.tasks.findIndex(task => task.id === id);
      if (existingTaskIndex !== -1) {
        state.tasks[existingTaskIndex] = action.payload;
      }
    },
    deleteTask(state, action: PayloadAction<number>) {
      state.tasks = state.tasks.filter(task => task.id !== action.payload);
    },
  },
});

export const { loadTasks, addTask, editTask, deleteTask } = tasksSlice.actions;

export default tasksSlice.reducer;
