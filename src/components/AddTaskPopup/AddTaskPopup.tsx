import React, { useState } from 'react';
import './AddTaskPopup.css';
import 'react-datepicker/dist/react-datepicker.css';
import { TaskProps } from '../../features/Tasks/tasksSlice';
import MainTaskInfo from '../MainTaskInfo/MainTaskInfo';
import TaskHeader from '../TaskHeader/TaskHeader';
import { createEmptyTask } from '../../features/Tasks/tasksSlice';
import Modal from '../UIElements/Modal';

interface AddTaskPopupProps {
  onClose: () => void;
  boardId: string;
  selectedColumnId: string;
  onAddTask: (newTask: TaskProps, columnId: string) => void;
}

const AddTaskPopup: React.FC<AddTaskPopupProps> = ({ onAddTask, boardId, selectedColumnId, onClose }) => {

  const [editedTask, setEditedTask] = useState<TaskProps>(createEmptyTask);
  const [isModalOpen, setIsModalOpen] = useState(false);


  const handleSave = () => {
    if (editedTask.name === '' || editedTask.description === '') {
      setIsModalOpen(true);
    } else {
      const updatedTask: TaskProps = {
        ...editedTask,
        boardId: boardId,
        columnId: selectedColumnId,
      };
      onAddTask(updatedTask, selectedColumnId);
      onClose();  
    }    
  }

  const handleTaskChange = (updatedTask: TaskProps) => {
    setEditedTask(updatedTask);
  };

  return (
    <div className="add-task-details-container">
      <TaskHeader onClose={onClose}/>
      <div className="add-details">
        <div className="add-main-details">
        <MainTaskInfo
              task={editedTask}
              isEditClicked={true}
              isAddTaskPopup={true}
              selectedColumnId={selectedColumnId}
              onTaskChange={handleTaskChange}
              saveClicked={false}
              onSaveClickReset={()=>{}}
            />
        </div>
        <div className='add-buttons'>
          <button className='save-button' onClick={handleSave}>💾 Save Task</button>
        </div>
      </div>
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </div>
  );
};

export default AddTaskPopup;
