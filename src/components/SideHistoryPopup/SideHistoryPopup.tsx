import React, { useRef, useEffect, useState } from 'react';
import './SideHistoryPopup.css';
import { TaskChangeProps } from '../../features/Tasks/tasksChangeSlice';
import { getAllHistory } from '../../utils/api';
import { formatDateForHistory } from '../../utils/dateUtils';
import { TaskProps } from '../../features/Tasks/tasksSlice';
import { truncateString } from '../../utils/utils';

interface SideHistoryPopupProps {
  tasks: TaskProps[];
  onClose: () => void;
}

const SideHistoryPopup: React.FC<SideHistoryPopupProps> = ({ tasks, onClose }) => {
  const popupRef = useRef<HTMLDivElement>(null);
  const [history, setHistory] = useState<TaskChangeProps[]>([]);

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const historyData = await getAllHistory();
        setHistory(historyData);
      } catch (error) {
        console.error('Error fetching history:', error);
      }
    };
    fetchHistory();
  }, []);

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

  const getTaskNameById = (taskId: number): string => {
    const task = tasks.find(task => task.id === taskId);
    return task ? task.name : '';
  };

  return (
    <div className="side-history-popup" ref={popupRef}>
      <div className='side-history-header-bar'>
        <p className='side-history-header-label'>History</p>
        <button className="side-history-header-button" onClick={onClose}>X</button>
      </div>
      <ul className="history-list">
        {history.map(change => (
          change.taskId !== null && getTaskNameById(change.taskId) !== '' && (
            <li key={change.id}>
              {`"${getTaskNameById(change.taskId)}" ${truncateString(change.changeDescription.toLowerCase(), 250)}`}
              <p className='side-history-date'>{formatDateForHistory(change.timestamp)}</p>
            </li>
          )
        ))}
      </ul>
    </div>
  );
};

export default SideHistoryPopup;
