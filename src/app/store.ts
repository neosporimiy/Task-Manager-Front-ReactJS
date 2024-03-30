import { configureStore } from '@reduxjs/toolkit';
import tasksReducer from '../features/Tasks/tasksSlice';
import tasksChangeReducer from '../features/Tasks/tasksChangeSlice';
import boardReducer from '../features/Tasks/boardsSlice';

const store = configureStore({
  reducer: {
    tasks: tasksReducer,
    tasksChanges: tasksChangeReducer,
    boards: boardReducer
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
