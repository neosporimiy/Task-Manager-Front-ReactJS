import { createSlice, createSelector } from '@reduxjs/toolkit';
import { RootState } from '../../app/store';
import { generateUniqueId } from '../../utils/utils';

export interface BoardProps {
  boardId: string;
  boardName: string;
  isCurrent: boolean;
}

const initialTaskBoards: BoardProps[] = [];

export const createEmptyBoard = (): BoardProps => {
  return {
    boardId: generateUniqueId().toString(),
    boardName: '',
    isCurrent: false,
  };
};

export const getCurrentBoardId = (boards: BoardProps[]): string => {
  const currentBoard = boards.find(board => board.isCurrent);
  return currentBoard ? currentBoard.boardId : '';
};

const boardsSlice = createSlice({
  name: 'taskBoard',
  initialState: initialTaskBoards,

  reducers: {
    loadBoards(state, action) {
      return action.payload;
    },
    addTaskBoard(state, action) {
      return [...state, action.payload];
    },
    setCurrentTaskBoardId(state, action) {
      const currentBoardId = action.payload;
      return state.map(board => ({
        ...board,
        isCurrent: board.boardId === currentBoardId,
      }));
    },
    deleteTaskBoard(state, action) {
      return state.filter(board => board.boardId !== action.payload);
    },
  },
});

export const { addTaskBoard, setCurrentTaskBoardId, deleteTaskBoard, loadBoards } = boardsSlice.actions;

export default boardsSlice.reducer;

export const selectTaskBoards = (state: RootState) => state.boards;

export const selectCurrentTaskBoardId = (state: RootState) => {
  const currentBoard = state.boards.find(board => board.isCurrent);
  return currentBoard ? currentBoard.boardId : '';
};

export const selectBoardNameById = createSelector(
  [selectTaskBoards, selectCurrentTaskBoardId],
  (boards, currentTaskBoardId) => {
    const board = boards.find(board => board.boardId === currentTaskBoardId);
    return board ? board.boardName : ''; 
  }
);
