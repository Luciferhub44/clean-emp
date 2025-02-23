import { useState, useEffect } from 'react';
import { Task, User } from '@/types';
import ApiService from '@/services/api';
import LoadingSpinner from '@/components/LoadingSpinner';
import TaskDetails from '@/components/TaskDetails';
import Modal from '@/components/Modal';
import PurchaseOrderPreview from '@/components/PurchaseOrderPreview';
import TaskResponseModal from '@/components/TaskResponseModal';

interface TaskViewProps {
  taskId: number;
  isOpen: boolean;
  onClose: () => void;
  onTaskUpdate?: () => void;
}

export default function TaskView({ taskId, isOpen, onClose, onTaskUpdate }: TaskViewProps) {
  const [task, setTask] = useState<Task | null>(null);
  const [assignedUser, setAssignedUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showResponseModal, setShowResponseModal] = useState(false);

  useEffect(() => {
    if (isOpen && taskId) {
      fetchTaskDetails();
    }
  }, [taskId, isOpen]);

  const fetchTaskDetails = async () => {
    setLoading(true);
    setError(null);
    try {
      const [taskResponse, userResponse] = await Promise.all([
        ApiService.get<Task>(`/tasks/${taskId}`),
        ApiService.get<User>(`/users/${task?.assigned_to}`),
      ]);
      setTask(taskResponse.data);
      setAssignedUser(userResponse.data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch task details');
    } finally {
      setLoading(false);
    }
  };

  const handleTaskResponse = async (response: 'accepted' | 'rejected', notes: string) => {
    if (!task) return;

    await ApiService.put(`/tasks/${task.id}/response`, {
      response,
      notes,
    });
    
    setTask({
      ...task,
      employee_response: response,
      response_notes: notes,
    });
    
    onTaskUpdate?.();
  };

  const handleStatusChange = async (newStatus: Task['status']) => {
    if (!task) return;

    try {
      await ApiService.put(`/tasks/${task.id}`, {
        status: newStatus,
      });
      
      setTask({ ...task, status: newStatus });
      onTaskUpdate?.();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update task status');
    }
  };

  const handleAcceptClick = async () => {
    setShowResponseModal(true);
    return Promise.resolve();
  };

  const handleRejectClick = async () => {
    setShowResponseModal(true);
    return Promise.resolve();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Task Details"
    >
      {loading ? (
        <LoadingSpinner />
      ) : error ? (
        <div className="text-red-600 text-center py-4">
          {error}
        </div>
      ) : task && assignedUser ? (
        <div className="space-y-6">
          <TaskDetails
            task={task}
            assignedUser={assignedUser}
            onStatusChange={handleStatusChange}
          />

          {task.purchase_order && (
            <div className="mt-8">
              <h3 className="text-lg font-medium mb-4">Purchase Order Details</h3>
              <PurchaseOrderPreview
                purchaseOrder={task.purchase_order}
                showActions={!task.employee_response}
                onAccept={handleAcceptClick}
                onReject={handleRejectClick}
              />
            </div>
          )}

          <TaskResponseModal
            isOpen={showResponseModal}
            onClose={() => setShowResponseModal(false)}
            onSubmit={handleTaskResponse}
          />
        </div>
      ) : (
        <div className="text-gray-600 text-center py-4">
          No task details available
        </div>
      )}
    </Modal>
  );
} 