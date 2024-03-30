import axios from 'axios';
import { TaskProps } from '../features/Tasks/tasksSlice';
import { BoardProps } from '../features/Tasks/boardsSlice';
import { TaskChangeProps } from '../features/Tasks/tasksChangeSlice';

const BASE_URL = 'http://localhost:4000';

export const createTaskRequest = async (taskData: TaskProps) => {
  try {
    const response = await axios.post(`${BASE_URL}/tasks`, taskData);
    return response.data;
  } catch (error) {
    console.error('Error creating task:', error);
    throw error;
  }
};

export const deleteTaskRequest = async (taskId: number) => {
  try {
    const response = await axios.delete(`${BASE_URL}/tasks/${taskId}`);
    return response.data;
  } catch (error) {
    console.error('Error deleting task:', error);
    throw error;
  }
};

export const editTaskRequest = async (taskId: number, taskData: TaskProps) => {
  try {
    const response = await axios.patch(`${BASE_URL}/tasks/${taskId}`, taskData);
    return response.data;
  } catch (error) {
    console.error('Error editing task:', error);
    throw error;
  }
};

export const getTaskByIdRequest = async (taskId: number) => {
  try {
    const response = await axios.get(`${BASE_URL}/tasks/${taskId}`);
    return response.data;
  } catch (error) {
    console.error('Error getting task by ID:', error);
    throw error;
  }
};

export const getAllTasksRequest = async () => {
  try {
    const response = await axios.get(`${BASE_URL}/tasks`);
    return response.data;
  } catch (error) {
    console.error('Error getting all tasks:', error);
    throw error;
  }
};

export const createBoardRequest = async (boardsData: BoardProps) => {
  try {
    const response = await axios.post(`${BASE_URL}/boards`, boardsData);
    return response.data;
  } catch (error) {
    console.error('Error create board:', error);
    throw error;
  }
};

export const getAllBoardsRequest = async () => {
  try {
    const response = await axios.get(`${BASE_URL}/boards`);
    return response.data;
  } catch (error) {
    console.error('Error getting all boards:', error);
    throw error;
  }
};

export const changeBoardRequest = async (boardId: string) => {
  try {
    const response = await axios.patch(`${BASE_URL}/boards/${boardId}`);
    return response.data;
  } catch (error) {
    console.error('Error updating board:', error);
    throw error;
  }
};

export const getAllHistory = async () => {
  try {
    const response = await axios.get(`${BASE_URL}/history`);
    return response.data;
  } catch (error) {
    console.error('Error fetching history:', error);
    throw error;
  }
};

export const getHistoryByTaskId = async (taskId: number) => {
  try {
    const response = await axios.get(`${BASE_URL}/history/${taskId}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching history with id ${taskId}:`, error);
    throw error;
  }
};

export const createHistoryEntry = async (historyData: TaskChangeProps) => {
  try {
    const response = await axios.post(`${BASE_URL}/history`, historyData);
    return response.data;
  } catch (error) {
    console.error('Error creating history entry:', error);
    throw error;
  }
};

export const deleteHistoryByTaskId = async (taskId: number) => {
  try {
    const response = await axios.delete(`${BASE_URL}/history/${taskId}`);
    return response.data;
  } catch (error) {
    console.error('Error deleting history by task ID:', error);
    throw error;
  }
};