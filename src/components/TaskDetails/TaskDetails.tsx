import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../app/store';
import './TaskDetails.css';
import 'react-datepicker/dist/react-datepicker.css';
import MainTaskInfo from '../MainTaskInfo/MainTaskInfo';
import TaskHeader from '../TaskHeader/TaskHeader';
import { formatDateForHistory } from '../../utils/dateUtils';
import { createEmptyTask } from '../../features/Tasks/tasksSlice';
import { editTaskRequest } from '../../utils/api';
import { editTask } from '../../features/Tasks/tasksSlice';
import { TaskChangeProps } from '../../features/Tasks/tasksChangeSlice';
import { TaskProps } from '../../features/Tasks/tasksSlice';
import { truncateString } from '../../utils/utils';
import Modal from '../UIElements/Modal';

interface TaskDetailsProps {
  taskId: number;
  taskHistory: TaskChangeProps[];
  onClose: () => void;
  isEditingMode: boolean;
}

const TaskDetails: React.FC<TaskDetailsProps> = ({ taskId, taskHistory, isEditingMode, onClose }) => {
  const task = useSelector((state: RootState) => state.tasks.tasks.find(task => task.id === taskId)) || createEmptyTask();
  const dispatch = useDispatch();
  const [editedTask, setEditedTask] = useState({ ...task });
  const [isEditing, setIsEditing] = useState(isEditingMode);
  const [saveClicked, setSaveClicked] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleSave = async () => { 
    if (editedTask.name === '' || editedTask.description === '') {
      setIsModalOpen(true);
    } else {
      setSaveClicked(true);
      try {
        const changedTask = await editTaskRequest(taskId, editedTask);
        dispatch(editTask(changedTask));
        setIsEditing(false);
        setSaveClicked(false);
        onClose();
      } catch (error) {
        console.error('Error editing task:', error);
      }
    } 
  };

  const handleTaskChange = (updatedTask: TaskProps, updatedTaskHistory: TaskChangeProps[]) => {
    setEditedTask(updatedTask);
  };

  const handleSaveClickReset = () => {
    setSaveClicked(false);
  };

  return (
    <div className="task-details-container">
      <TaskHeader onClose={onClose}/>

      <div className="task-details">
        <div className='task-details-left-middle-info'>
          <div className="task-details-left-info">          
            <MainTaskInfo
              task={task}
              isEditClicked={isEditing}
              isAddTaskPopup={false}
              onTaskChange={handleTaskChange}
              saveClicked={saveClicked}
              onSaveClickReset={handleSaveClickReset}
            />
          </div>
          <div className='task-details-middle-info'>
            {isEditing ? (
              <>
                <button className='task-details-edit-button' onClick={handleSave}>💾Save Task</button>
              </>
            ) : (
                <button className='task-details-edit-button' onClick={handleEdit}>📝Edit Task</button>
            )}
          </div>
        </div>
        <div className="task-details-right-info">
          <span className='task-details-activity-heading'>Activity</span>
          <ul className="task-details-activity-list">
            {taskHistory.map(change => (
              <li key={change.id}>
                <p className='task-details-change-description'>{truncateString(change.changeDescription, 250)}</p>
                {change.timestamp ? (
                  <p className='task-details-change-time'>{formatDateForHistory(change.timestamp)}</p>
                ) : (
                  <p className='task-details-change-time'>Timestamp not available</p>
                )}              
              </li>
            ))}
          </ul>
        </div>
      </div>
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </div>
  );
};

export default TaskDetails;
