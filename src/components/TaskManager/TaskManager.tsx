import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { TaskProps, editTask, deleteTask, addTask, loadTasks } from '../../features/Tasks/tasksSlice';
import AddNewTaskButton from '../AddNewTaskButton/AddNewTaskButton';
import AddTaskPopup from '../AddTaskPopup/AddTaskPopup';
import Task from '../Task/Task';
import { RootState } from '../../app/store';
import { COLUMNS, getTitleById } from '../../constants/columns';
import { createTaskRequest, deleteTaskRequest, editTaskRequest, getAllTasksRequest, getAllBoardsRequest, changeBoardRequest } from '../../utils/api';
import { taskStateChanged } from '../../features/Tasks/tasksChangeSlice';
import { addTaskBoard, setCurrentTaskBoardId, deleteTaskBoard, selectBoardNameById } from '../../features/Tasks/boardsSlice';
import CreateBoardPopup from '../CreateBoardPopup/CreateBoardPopup';
import SideHistoryPopup from '../SideHistoryPopup/SideHistoryPopup';
import { TaskChangeProps } from '../../features/Tasks/tasksChangeSlice';
import './TaskManager.css';
import TaskManagerHeader from '../TaskManagerHeader/TaskManagerHeader';
import { loadBoards } from '../../features/Tasks/boardsSlice';
import { getCurrentBoardId } from '../../features/Tasks/boardsSlice';
import { createEmptyChangesEntry } from '../../features/Tasks/tasksChangeSlice';
import { createHistoryEntry } from '../../utils/api';
import { deleteHistoryByTaskId } from '../../utils/api';

const TaskManager: React.FC = () => {
  const tasks = useSelector((state: RootState) => state.tasks.tasks);
  const taskChanges = useSelector((state: RootState) => state.tasksChanges);
  const boards = useSelector((state: RootState) => state.boards);
  const dispatch = useDispatch();
  const emptyChangesInTaskEntry = createEmptyChangesEntry();

  const [isAddTaskPopupOpen, setIsAddTaskPopupOpen] = useState(false);
  const [isAddBoardPopupOpen, setIsAddBoardPopupOpen] = useState(false);
  const [isHistoryPopupOpen, setIsHistoryPopupOpen] = useState(false);
  const [selectedColumnId, setSelectedColumnId] = useState<string>('');
  const [sortedTaskChanges, setSortedTaskChanges] = useState<TaskChangeProps[]>([]);
  const [loadedBoardId, setLoadedBoardId] = useState(getCurrentBoardId(boards));
  const [columns, setColumns] = useState(
    COLUMNS.map(column => ({
      ...column,
      tasks: tasks.filter(task => task.columnId === column.id && task.boardId === loadedBoardId),
    }))
  );

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getAllBoardsRequest();
        setLoadedBoardId(getCurrentBoardId(data));
        dispatch(loadBoards(data));
        dispatch(setCurrentTaskBoardId(getCurrentBoardId(data)))
      } catch (error) {
        console.error('Error fetching boards:', error);
      }
    };
  
    fetchData();
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getAllTasksRequest();
        dispatch(loadTasks(data));
      } catch (error) {
        console.error('Error fetching tasks:', error);
      }
    };
  
    fetchData();
  }, []);

  useEffect(() => {
    setColumns(
      COLUMNS.map(column => ({
        ...column,
        tasks: tasks.filter(task => task.columnId === column.id && task.boardId === loadedBoardId),
      }))
    );
  }, [tasks, loadedBoardId]);

  const handleAddTask = async (newTask: TaskProps) => {
    try {
      const createdTask = await createTaskRequest(newTask);
      
      const historyEntry = {
        ...emptyChangesInTaskEntry, 
        taskId: createdTask.id,
        changeType: 'created',
        changeDescription: 'Task created',
        timestamp: Date.now().toLocaleString(),
      }
      const changedTask = await createHistoryEntry(historyEntry);

      dispatch(taskStateChanged(changedTask));
  
      dispatch(addTask(createdTask));
    } catch (error) {
      console.error('Error adding task:', error);
    }
  };

  const handleDeleteTask = async (taskId: number) => {    
    try {
      await deleteTaskRequest(taskId);
      dispatch(deleteTask(taskId));
      await deleteHistoryByTaskId(taskId);      
    } catch (error) {
      console.error('Error deleting task:', error);
    }
  }

  const openAddTaskPopup = async (columnId: string) => {
    setSelectedColumnId(columnId);
    setIsAddTaskPopupOpen(true);
  };

  const closeAddTaskPopup = () => {
    setIsAddTaskPopupOpen(false);
  };

  const handleMoveTo = async (taskId: number, columnId: string) => {
    const taskToMove = tasks.find(task => task.id === taskId);
    if (!taskToMove) return;
  
    const prevColumnTitle = getTitleById(taskToMove.columnId);
    const nextColumnTitle = getTitleById(columnId);
  
    try {
      const movedTask = await editTaskRequest(taskId, {...taskToMove, columnId} );
      dispatch(editTask(movedTask));

      const historyEntry = {
        ...emptyChangesInTaskEntry,
        taskId: movedTask.id,
        changeType: 'moved',
        changeDescription: `Moved from ${prevColumnTitle} to ${nextColumnTitle}`,
        timestamp: Date.now().toLocaleString(),
      }

      try {
        const changedTask = await createHistoryEntry(historyEntry);
        dispatch(taskStateChanged(changedTask));
      } catch (error) {
        console.error('Error updating task history:', error);
      }
      
    } catch (error) {
      console.error('Error moving task:', error);
    }
  };

  const openAddBoardPopup = () => {
    setIsAddBoardPopupOpen(true);
  };

  const closeAddBoardPopup = () => {
    setIsAddBoardPopupOpen(false);
  };

  const handleCreateBoard = (title: string) => {
    dispatch(addTaskBoard({ id: 'new-board-id', name: title }));
    closeAddBoardPopup();
  };

  const handleChangeBoardClick = async (boardId: string) => {
    try {
      const data = await changeBoardRequest(boardId);
      setLoadedBoardId(data.boardId);
      dispatch(setCurrentTaskBoardId(boardId));    
    } catch (error) {
      console.error('Error fetching boards:', error);
    }
  }

  const openHistoryPopup = () => {
    const taskChangesInCurrentBoard = taskChanges.filter(change => {
      const task = tasks.find(task => task.id === change.taskId);
      return task && task.boardId === loadedBoardId;
    });
    const sortedTaskChanges = taskChangesInCurrentBoard.sort((a, b) => {
      const timestampA = parseInt(a.timestamp ?? "0", 10);
      const timestampB = parseInt(b.timestamp ?? "0", 10);
      return timestampA - timestampB;
    });
    setSortedTaskChanges(sortedTaskChanges);
    setIsHistoryPopupOpen(true);
  }

  return (
    <div className="task-manager-main-container">
      <div className='header-container'>
        <TaskManagerHeader
          onHistoryClick={()=>{openHistoryPopup()}}
          onCreateBoardClick={openAddBoardPopup}
          onBoardClick={handleChangeBoardClick}
        />
        
      </div>
      <div className="columns-container">
        {columns.map(column => (
          <div key={column.id} className="column">
            <h2>{column.title}</h2>
            <div className="task-list">
              <AddNewTaskButton onClick={() => openAddTaskPopup(column.id)} />
              {column.tasks.map((task, index) => (
                <Task
                  key={task.id}
                  id={task.id}
                  onMoveTo={handleMoveTo}
                  onDeleteTask={handleDeleteTask}
                />
              ))}
            </div>
          </div>
        ))}
      </div>
      {isAddTaskPopupOpen && loadedBoardId && (
        <AddTaskPopup
          onAddTask={handleAddTask}
          boardId={loadedBoardId}
          onClose={closeAddTaskPopup}
          selectedColumnId={selectedColumnId}
        />
      )}
      {isAddBoardPopupOpen && (
        <CreateBoardPopup
          onClose={closeAddBoardPopup}
          onBoardCreate={handleCreateBoard}
        />
      )}

      {isHistoryPopupOpen && (
        <SideHistoryPopup 
          tasks={tasks}
          onClose={() => setIsHistoryPopupOpen(false)} 
        /> 
      )}
    </div>
  );
};

export default TaskManager;
