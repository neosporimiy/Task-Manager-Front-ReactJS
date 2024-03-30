import React, { useState, useRef, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../../app/store';
import './TaskManagerHeader.css';

interface TaskManagerHeaderProps {
  onHistoryClick: () => void;
  onCreateBoardClick: () => void;
  onBoardClick: (boardId: string) => void;
}

const TaskManagerHeader: React.FC<TaskManagerHeaderProps> = ({
  onHistoryClick,
  onCreateBoardClick,
  onBoardClick,
}) => {
  const boardList = useSelector((state: RootState) => state.boards);
  const currentBoard = boardList.find(board => board.isCurrent === true);
  const [isBoardMenuOpen, setIsBoardMenuOpen] = useState(false);
  const boardMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (boardMenuRef.current && !boardMenuRef.current.contains(event.target as Node)) {
        setIsBoardMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const toggleBoardMenu = () => {
    setIsBoardMenuOpen(!isBoardMenuOpen);
  };

  return (
    <div className="task-manager-header">
      <div className="board-name" onClick={toggleBoardMenu}>{currentBoard?.boardName}</div>
      {isBoardMenuOpen && (
        <div className="board-menu" ref={boardMenuRef}>
          {boardList.map(board => (
            <div key={board.boardId} className="board-item" 
                onClick={() => {onBoardClick(board.boardId);
                                setIsBoardMenuOpen(!isBoardMenuOpen);
            }}>
              {board.boardName}
            </div>
          ))}
        </div>
      )}
      <div className="buttons">
      <button className="history-button" onClick={onHistoryClick}><span>&#x27F2;</span> History</button>
        <button className="create-list-button" onClick={onCreateBoardClick}>+ Create new list</button>
      </div>
    </div>
  );
};

export default TaskManagerHeader;
