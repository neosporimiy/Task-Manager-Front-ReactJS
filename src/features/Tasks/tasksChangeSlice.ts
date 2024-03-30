import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { generateUniqueId, generateUniqueStringId } from '../../utils/utils';

export interface TaskChangeProps {
  id: string;
  taskId: number | null;
  changeType: string;
  changeDescription: string;
  timestamp: string;
}

export const createEmptyChangesEntry = (): TaskChangeProps => {
  return {
    id: generateUniqueStringId(),
    taskId: null,
    changeType: '',
    changeDescription: '',
    timestamp: '',
  };
};

const initialState: TaskChangeProps[] = [];

const taskChangesSlice = createSlice({
  name: 'taskChanges',
  initialState,
  reducers: {
    taskStateChanged(state, action: PayloadAction<TaskChangeProps>) {
      state.push(action.payload);
    },

  },
});

export const { taskStateChanged } = taskChangesSlice.actions;

export default taskChangesSlice.reducer;
