import React from 'react';
import './AddNewTaskButton.css'

interface AddNewTaskButtonProps {
  onClick: () => void;
}

const AddNewTaskButton: React.FC<AddNewTaskButtonProps> = ({ onClick }) => {
  return (
    <button className='add-new-task-button' onClick={onClick}>
      {'✚ Add new card'}
    </button>
  );
};

export default AddNewTaskButton;
