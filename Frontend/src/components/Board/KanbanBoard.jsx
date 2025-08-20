import { useState, useEffect } from 'react';
import { DragDropContext, Droppable } from '@hello-pangea/dnd';
import { Plus, X } from 'lucide-react';
import TaskCard from '../Task/TaskCard';
import TaskForm from '../Task/TaskForm';
import DeleteConfirmModal from '../Task/DeleteConfirmModal';
import ConflictModal from '../Task/ConflictModal';
import { tasksAPI, updateWithRetry } from '../../services/api';
import socketService from '../../services/socket';
import { useGroup } from '../../contexts/GroupContext';

const KanbanBoard = () => {
  const { currentGroup } = useGroup();
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showTaskForm, setShowTaskForm] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [conflictData, setConflictData] = useState(null);
  const [error, setError] = useState('');
  const [deleteTaskId, setDeleteTaskId] = useState(null);
  const [movingTaskId, setMovingTaskId] = useState(null);

  const columns = [
    { id: 'Todo', title: 'To Do', color: 'bg-slate-100' },
    { id: 'In Progress', title: 'In Progress', color: 'bg-blue-100' },
    { id: 'Done', title: 'Done', color: 'bg-green-100' },
  ];

  useEffect(() => {
    if (currentGroup) {
      loadTasks();
      setupSocketListeners();
    }

    return () => {
      socketService.disconnect();
    };
  }, [currentGroup]);

  const loadTasks = async () => {
    try {
      setLoading(true);
      const response = await tasksAPI.getAll(currentGroup._id);
      setTasks(response.data);
    } catch (error) {
      console.error('Error loading tasks:', error);
      setError('Failed to load tasks');
    } finally {
      setLoading(false);
    }
  };

  const setupSocketListeners = () => {
    socketService.connect();
    if (currentGroup) socketService.emit('join_group', currentGroup._id);

    socketService.onTaskCreated((data) => {
      setTasks((prev) => [...prev, data.task]);
    });

    socketService.onTaskUpdated((data) => {
      setTasks((prev) =>
        prev.map((task) => (task._id === data.task._id ? data.task : task))
      );
    });

    socketService.onTaskDeleted((data) => {
      setTasks((prev) => prev.filter((task) => task._id !== data.taskId));
    });

    socketService.onActivityLogUpdated((log) => {
      console.log('Activity log updated:', log);
    });
  };

  const handleDragEnd = async (result) => {
    if (!result.destination) return;
    const { source, destination, draggableId } = result;

    if (
      source.droppableId === destination.droppableId &&
      source.index === destination.index
    ) {
      return;
    }

    const task = tasks.find((t) => t._id === draggableId);
    if (!task) return;

    const newStatus = destination.droppableId;
    const prevTasks = [...tasks];

    setTasks((prev) =>
      prev.map((t) => (t._id === task._id ? { ...t, status: newStatus } : t))
    );
    setMovingTaskId(task._id);

    try {
      const response = await updateWithRetry(task._id, {
        status: newStatus,
        version: task.version,
      });
      setTasks((prev) =>
        prev.map((t) => (t._id === task._id ? response.data.task : t))
      );
    } catch (error) {
      setTasks(prevTasks);
      if (error.response?.status === 409) {
        setConflictData({
          localTask: { ...task, status: newStatus },
          serverTask: error.response.data.serverTask,
        });
      } else {
        setError('Failed to update task');
      }
    } finally {
      setMovingTaskId(null);
    }
  };

  const handleCreateTask = async (taskData) => {
    try {
      const taskWithGroup = { ...taskData, groupId: currentGroup._id };
      await tasksAPI.create(taskWithGroup);
      setShowTaskForm(false);
    } catch (error) {
      setError(error.response?.data?.message || 'Failed to create task');
    }
  };

  const handleEditTask = async (taskData) => {
    try {
      const response = await updateWithRetry(editingTask._id, {
        ...taskData,
        version: editingTask.version,
      });
      setTasks((prev) =>
        prev.map((t) => (t._id === editingTask._id ? response.data.task : t))
      );
      setEditingTask(null);
    } catch (error) {
      if (error.response?.status === 409) {
        setConflictData({
          localTask: { ...editingTask, ...taskData },
          serverTask: error.response.data.serverTask,
        });
      } else {
        setError(error.response?.data?.message || 'Failed to update task');
      }
    }
  };

  const handleDeleteTask = (taskId) => setDeleteTaskId(taskId);

  const confirmDeleteTask = async () => {
    if (!deleteTaskId) return;
    try {
      await tasksAPI.delete(deleteTaskId);
      setTasks((prev) => prev.filter((t) => t._id !== deleteTaskId));
    } catch {
      setError('Failed to delete task');
    } finally {
      setDeleteTaskId(null);
    }
  };

  const handleSmartAssign = async (taskId) => {
    try {
      const response = await updateWithRetry(taskId, {
        assignedUser: '',
        version: tasks.find((t) => t._id === taskId)?.version || 1,
      });
      setTasks((prev) =>
        prev.map((t) => (t._id === taskId ? response.data.task : t))
      );
    } catch (error) {
      if (error.response?.status === 409) {
        setConflictData({
          localTask: { ...tasks.find((t) => t._id === taskId), assignedUser: '' },
          serverTask: error.response.data.serverTask,
        });
      } else {
        setError('Failed to smart assign task');
      }
    }
  };

  const handleConflictResolve = async (resolution, data) => {
    try {
      if (resolution === 'merge') {
        const response = await updateWithRetry(conflictData.localTask._id, {
          ...data,
          version: conflictData.serverTask.version + 1,
        });
        setTasks((prev) =>
          prev.map((t) =>
            t._id === conflictData.localTask._id ? response.data.task : t
          )
        );
      } else {
        const response = await updateWithRetry(conflictData.localTask._id, {
          ...conflictData.localTask,
          version: conflictData.serverTask.version + 1,
        });
        setTasks((prev) =>
          prev.map((t) =>
            t._id === conflictData.localTask._id ? response.data.task : t
          )
        );
      }
      setConflictData(null);
    } catch (error) {
      if (error.response?.status === 409) {
        setConflictData({
          localTask: conflictData.localTask,
          serverTask: error.response.data.serverTask,
        });
        setError('Conflict still exists. Please try again.');
      } else {
        setError('Failed to resolve conflict. Please refresh and try again.');
      }
    }
  };

  const getTasksForColumn = (columnId) =>
    tasks.filter((task) => task.status === columnId);

  if (!currentGroup) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-gray-600">
        <h3 className="text-xl font-semibold">No Group Selected</h3>
        <p className="text-sm">Please select or create a group to start managing tasks.</p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-gray-500">
        <div className="animate-spin w-8 h-8 border-4 border-blue-400 border-t-transparent rounded-full"></div>
        <p className="mt-2 text-sm">Loading your board...</p>
      </div>
    );
  }

  return (
    <div className="w-full h-full bg-white rounded-2xl shadow-md p-3 sm:p-4 md:p-6 flex flex-col">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-6">
        <h1 className="text-xl sm:text-2xl font-bold text-gray-900 tracking-tight text-center sm:text-left">
          Collaborative To-Do Board
        </h1>
        <button
          onClick={() => setShowTaskForm(true)}
          className="flex items-center justify-center gap-2 bg-gradient-to-r from-blue-500 to-indigo-500 text-white px-4 sm:px-5 py-2 rounded-full shadow-lg hover:scale-105 hover:shadow-xl transition transform text-sm sm:text-base"
        >
          <Plus size={18} /> Add Task
        </button>
      </div>

      {/* Error Toast */}
      {error && (
        <div className="fixed top-4 right-4 z-50 bg-red-500 text-white px-4 py-2 rounded-lg shadow-lg flex items-center gap-2 animate-slide-in">
          <span className="text-sm sm:text-base">{error}</span>
          <button onClick={() => setError('')} className="hover:text-gray-200">
            <X size={16} />
          </button>
        </div>
      )}

      {/* Columns */}
      <DragDropContext onDragEnd={handleDragEnd}>
        <div
          className="
          flex flex-col gap-4
          sm:grid sm:grid-cols-2
          md:grid-cols-3 md:gap-6
          flex-grow
        "
        >
          {columns.map((column) => (
            <div
              key={column.id}
              className="flex flex-col rounded-2xl shadow-sm border border-gray-100 w-full"
            >
              {/* Column Header */}
              <div
                className={`flex items-center justify-between px-3 sm:px-4 py-2 font-semibold text-gray-700 rounded-t-2xl bg-gradient-to-r ${column.id === 'Todo'
                    ? 'from-slate-100 to-slate-200'
                    : column.id === 'In Progress'
                      ? 'from-blue-100 to-blue-200'
                      : 'from-green-100 to-green-200'
                  }`}
              >
                <h3 className="text-sm sm:text-base">{column.title}</h3>
                <span className="bg-white text-gray-700 text-xs px-2 sm:px-3 py-1 rounded-full shadow-sm">
                  {getTasksForColumn(column.id).length}
                </span>
              </div>

              {/* Droppable Area */}
              <Droppable droppableId={column.id}>
                {(provided, snapshot) => (
                  <div
                    ref={provided.innerRef}
                    {...provided.droppableProps}
                    className={`
                    flex-1 p-2 sm:p-3 min-h-[120px] sm:min-h-[150px]
                    overflow-y-auto
                    rounded-b-2xl transition-all duration-200
                    ${snapshot.isDraggingOver
                        ? 'bg-blue-50 border-2 border-dashed border-blue-300'
                        : 'bg-white'}
                  `}
                  >
                    {getTasksForColumn(column.id).length === 0 ? (
                      <div className="flex items-center justify-center h-full text-gray-400 text-xs sm:text-sm italic">
                        No tasks yet 
                      </div>
                    ) : (
                      getTasksForColumn(column.id).map((task, index) => (
                        <TaskCard
                          key={task._id}
                          task={task}
                          index={index}
                          onEdit={(task) => setEditingTask(task)}
                          onDelete={handleDeleteTask}
                          onSmartAssign={handleSmartAssign}
                          isMoving={movingTaskId === task._id}
                        />
                      ))
                    )}
                    {provided.placeholder}
                  </div>
                )}
              </Droppable>
            </div>
          ))}
        </div>
      </DragDropContext>

      {/* Modals */}
      {showTaskForm && (
        <TaskForm onSubmit={handleCreateTask} onCancel={() => setShowTaskForm(false)} />
      )}
      {editingTask && (
        <TaskForm
          task={editingTask}
          onSubmit={handleEditTask}
          onCancel={() => setEditingTask(null)}
          isEditing
        />
      )}
      {conflictData && (
        <ConflictModal
          localTask={conflictData.localTask}
          serverTask={conflictData.serverTask}
          onResolve={handleConflictResolve}
          onCancel={() => setConflictData(null)}
        />
      )}
      <DeleteConfirmModal
        open={!!deleteTaskId}
        onConfirm={confirmDeleteTask}
        onCancel={() => setDeleteTaskId(null)}
      />
    </div>
  );

};

export default KanbanBoard;
