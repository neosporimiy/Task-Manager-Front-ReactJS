import React, { useState, useEffect } from 'react';
import DatePicker from 'react-datepicker';
import { getTitleById } from '../../constants/columns';
import './MainTaskInfo.css';
import { formatDate } from '../../utils/dateUtils';
import { TaskProps } from '../../features/Tasks/tasksSlice';
import { createEmptyTask } from '../../features/Tasks/tasksSlice';
import { TaskChangeProps } from '../../features/Tasks/tasksChangeSlice';
import { taskStateChanged } from '../../features/Tasks/tasksChangeSlice';
import { useDispatch } from 'react-redux';
import { createHistoryEntry } from '../../utils/api';
import { createEmptyChangesEntry } from '../../features/Tasks/tasksChangeSlice';

export interface MainTaskInfoProps {
    task: TaskProps;
    isEditClicked: boolean;
    isAddTaskPopup: boolean;
    selectedColumnId?: string;
    onTaskChange: (updatedTask: TaskProps, taskHistory: TaskChangeProps[]) => void;
    saveClicked: boolean;
    onSaveClickReset: () => void;
  }

const priorityOptions = ["Low", "Middle", "High"];

const MainTaskInfo: React.FC<MainTaskInfoProps> = ({ task, isEditClicked, isAddTaskPopup, selectedColumnId, onTaskChange, saveClicked, onSaveClickReset  }) => {
    const initialEditedTaskState: TaskProps = task.id === null ? createEmptyTask() : task;
    const [historyArray, setHistoryArray] = useState<TaskChangeProps[]>([]);
    const [initialTask, setInitialTask] = useState(task);    
    const [editedTask, setEditedTask] = useState<TaskProps>(initialEditedTaskState);
    const dispatch = useDispatch();
    const [changes, setChanges] = useState<TaskChangeProps[]>([]);

    
    useEffect(() => {
      if (saveClicked) {
        addChangesToHistory();
        onSaveClickReset();
        setInitialTask(editedTask); 
      }
      onTaskChange(editedTask, historyArray);
    }, [editedTask, saveClicked]);

    useEffect(() => {
      if (isAddTaskPopup) {
          setEditedTask(prevState => ({
              ...prevState,
              columnId: selectedColumnId || '',
              priority: priorityOptions[0] || '',
          }));
      }
    }, [isAddTaskPopup, selectedColumnId]);

    const addChangesToHistory = async () => {
      const changes: TaskChangeProps[] = [];

      if (initialTask.name !== editedTask.name) {
        changes.push({
          ...createEmptyChangesEntry(),
          taskId: editedTask.id,
          changeType: "Name Changed",
          changeDescription: `Name changed from "${initialTask.name}" to "${editedTask.name}"`,
          timestamp: Date.now().toLocaleString(),
        });
      }
    
      if (initialTask.description !== editedTask.description) {
        changes.push({
          ...createEmptyChangesEntry(),
          taskId: editedTask.id,
          changeType: "Description Changed",
          changeDescription: `Description changed from "${initialTask.description}" to "${editedTask.description}"`,
          timestamp: Date.now().toLocaleString(),
        });
      }
    
      if (initialTask.priority !== editedTask.priority) {
        changes.push({
          ...createEmptyChangesEntry(),
          taskId: editedTask.id,
          changeType: "Priority Changed",
          changeDescription: `Priority changed from "${initialTask.priority}" to "${editedTask.priority}"`,
          timestamp: Date.now().toLocaleString(),
        });
      }
    
      if (initialTask.dueDate !== editedTask.dueDate) {
        changes.push({
          ...createEmptyChangesEntry(),
          taskId: editedTask.id,
          changeType: "Due Date Changed",
          changeDescription: `Due date changed from "${initialTask.dueDate}" to "${editedTask.dueDate}"`,
          timestamp: Date.now().toLocaleString(),
        });
      }
    
      for (const change of changes) {
        try {
          const changedTask = await createHistoryEntry(change);
          dispatch(taskStateChanged(changedTask));
        } catch (error) {
          console.error('Error updating task history:', error);
        }
      }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setEditedTask(prevState => ({
            ...prevState,
            [name]: value
        }));
    };  

    const handlePriorityChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const { name, value } = e.target;
        setEditedTask(prevState => ({
            ...prevState,
            [name]: value
        }));
    };

    const handleDueDateChange = (date: Date | null) => {
      if (date) {
          setEditedTask(prevState => ({
            ...prevState,
            dueDate: date.toISOString().split('T')[0]
          }));
        }
    };  

    return (
        <div className='main-task-info'>
          <span className="task-details-heading">
            {isEditClicked ? (
              <input
                type="text"
                name="name"
                placeholder='Task title'
                value={editedTask.name}
                onChange={handleChange}
                className="task-details-heading-edit"
              />
            ) : (
              <span>{task?.name}</span>
            )}
          </span>
          <div className="task-additional-info">
            <p className="task-additional-label">
              <label>🎯 Status:</label>
            </p>
            <p className='task-additional-value'>{getTitleById(editedTask?.columnId ?? '')}</p>
          </div>
          <div className="task-additional-info">
            <p className="task-additional-label">
            <label>📆 Due date:</label>
            </p>
                      {isEditClicked ? (
              <div className='task-additional-value'>
                <DatePicker
                selected={editedTask.dueDate ? new Date(editedTask.dueDate) : null}
                onChange={handleDueDateChange}
                dateFormat="EEE, dd MMMM"
                />
              </div>
            ) : (
              <p className='task-additional-value'>{task?.dueDate ? formatDate(task.dueDate) : ''}</p>
            )}
          </div>
          <div className="task-additional-info">
            <p className="task-additional-label">
              <label>🏷️ Priority:</label>
            </p>
            {isEditClicked ? (
              <p className='task-additional-value'>
              <select
                name="priority"
                value={editedTask.priority}
                onChange={handlePriorityChange}
              >
                {priorityOptions.map(option => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
              </p>
            ) : (
              <p className='task-additional-value'>{task?.priority}</p>
            )}

          </div>
          <div className="description-info">
            <p className="description-label">Description:</p>
            {isEditClicked ? (
              <textarea
                name="description"
                value={editedTask.description}
                onChange={handleChange}
                className="description-content-textarea"
                placeholder='Task description'
              />
            ) : (
              <div className="description-content">
                <p>{task?.description}</p>
              </div>
            )}
          </div>
        </div>
    );
};

export default MainTaskInfo;
