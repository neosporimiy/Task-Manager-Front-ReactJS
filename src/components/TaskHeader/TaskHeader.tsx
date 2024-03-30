import React from 'react';
import './TaskHeader.css';

const TaskHeader: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  return (
    <div className="task-header">
      <div className="header-task-bar">
        <button className="task-header-close-button" onClick={onClose}>X</button>
      </div>
    </div>
  );
};

export default TaskHeader;
