import React, { useState, useRef, useEffect } from 'react';
import './Task.css';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../../app/store';
import { COLUMNS } from '../../constants/columns';
import { formatDate } from '../../utils/dateUtils';
import TaskDetails from '../TaskDetails/TaskDetails';
import { getTaskByIdRequest, getHistoryByTaskId } from '../../utils/api';
import { TaskChangeProps, taskStateChanged } from '../../features/Tasks/tasksChangeSlice';
import { truncateString } from '../../utils/utils';

interface TaskProps {
  id: number | null;
  onMoveTo: (taskId: number, columnId: string) => void;
  onDeleteTask: (taskId: number) => void;
}


const Task: React.FC<TaskProps> = ({ id, onMoveTo, onDeleteTask }) => {
  const task = useSelector((state: RootState) => state.tasks.tasks.find(task => task.id === id));
  const history = useSelector((state: RootState) => state.tasksChanges);
  const [selectedColumnId, setSelectedColumnId] = useState(task?.columnId || '');
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const otherColumns = COLUMNS.filter(col => col.id !== selectedColumnId);
  const [taskData, setTaskData] = useState(task);
  const [historyData, setHistoryData] = useState(history);
  const [openTaskDetails, setOpenTaskDetails] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const dispatch = useDispatch();
  
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleMoveToChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const newColumnId = event.target.value;
    setSelectedColumnId(newColumnId);
    if (id !== null && newColumnId !== '') {
      onMoveTo(id, newColumnId);
    }
  };

  const handleMenuToggle = () => {
    setIsMenuOpen(prevState => !prevState);
  };

  const handleEditTask = () => {
    setOpenTaskDetails(true);
  };

  const handleDeleteTask = () => {
    if (id !== null) {
      onDeleteTask(id);
    }
  };

  const closeTask = () => {
    setOpenTaskDetails(false);
  };  

  const openTask = async (id: number) => {
    if (id !== null) {
      try {
        const data = await getTaskByIdRequest(id);
        const history = await getHistoryByTaskId(id);
        history.forEach((change: TaskChangeProps) => {
          dispatch(taskStateChanged(change));
        });
        setHistoryData(history);
        setTaskData(data);
        setOpenTaskDetails(true);
      } catch (error) {
        console.error('Error fetching task:', error);
      }
    }
  };

  return (
    <div className="task">
      <div className="task-heading-wrapper">
      <p className='task-heading' onClick={() => id && openTask(id)}>{task?.name}</p>
        <div className="task-menu" onClick={handleMenuToggle} ref={menuRef}>
          <i className="fas fa-ellipsis-v"></i>
          {isMenuOpen && (
            <ul className="task-menu-options">
              <li onClick={handleEditTask}>Edit</li>
              <li onClick={handleDeleteTask}>Delete</li>
            </ul>
          )}
        </div>
      </div>

      <p className='task-description'>{task && truncateString(task.description,150)}</p>
      <p className="due-date">📆 {task?.dueDate ? formatDate(task?.dueDate): 'No due date'}</p>
      <p className="priority-text">{task?.priority}</p>
      <div className="select-container">
        <select value={selectedColumnId} onChange={handleMoveToChange}>
          <option value="">Move to...</option>
          {otherColumns.map(column => (
            <option key={column.id} value={column.id}>{column.title}</option>
          ))}
        </select>
      </div>

      {taskData && taskData.id !== null && openTaskDetails && (
        <TaskDetails
          taskId={taskData.id}
          taskHistory={historyData}
          onClose={closeTask}
          isEditingMode={false}
        />
      )}

    </div>
  );
};

export default Task;
