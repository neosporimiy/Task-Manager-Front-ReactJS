import React, { useState, useEffect, useRef } from 'react';
import './CreateBoardPopup.css';
import { createBoardRequest } from '../../utils/api';
import { createEmptyBoard } from '../../features/Tasks/boardsSlice';
import { addTaskBoard } from '../../features/Tasks/boardsSlice';
import { useDispatch } from 'react-redux';

interface CreateBoardPopupProps {
  onClose: () => void;
  onBoardCreate: (title: string) => void;
}

const CreateBoardPopup: React.FC<CreateBoardPopupProps> = ({ onClose, onBoardCreate }) => {
  const popupRef = useRef<HTMLDivElement>(null);
  const [newBoard, setNewBoard] = useState(createEmptyBoard());
  const dispatch = useDispatch();

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (popupRef.current && !popupRef.current.contains(event.target as Node)) {
        onClose();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [onClose]);

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewBoard({ ...newBoard, boardName: e.target.value });
  };

  const handleCreateBoard = async () => {
    try {
      const createdBoard = await createBoardRequest(newBoard);  
      dispatch(addTaskBoard(createdBoard));
      onClose();
    } catch (error) {
      console.error('Error creating board:', error);
    }

  };

  return (
    <div className="create-board-popup" ref={popupRef}>
      <div className="create-board-content">
        <button className="close-button" onClick={onClose}>X</button>
        <input
          type="text"
          placeholder="Enter board title"
          value={newBoard.boardName}
          onChange={handleTitleChange}
        />
      </div>
      <button className="create-button" onClick={handleCreateBoard}>Create Board</button>

    </div>
  );
};

export default CreateBoardPopup;
