import { useState } from 'react';
import { Task, TaskComment, User, PurchaseOrder, PayrollSettings } from '@/types';
import ApiService from '@/services/api';
import PurchaseOrderStatus from './PurchaseOrderStatus';
import { EmailService } from '@/services/emailService';
import { calculateCommission } from '@/utils/payrollUtils';

interface TaskDetailsProps {
  task: Task;
  assignedUser: User;
  onStatusChange: (status: Task['status']) => Promise<void>;
  onPOStatusChange?: (status: PurchaseOrder['status']) => Promise<void>;
  isAdmin?: boolean;
}

export default function TaskDetails({
  task,
  assignedUser,
  onStatusChange,
  onPOStatusChange,
  isAdmin = false,
}: TaskDetailsProps) {
  const [comment, setComment] = useState('');
  const [comments, setComments] = useState<TaskComment[]>([]);
  const [loading, setLoading] = useState(false);

  const handleAddComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!comment.trim()) return;

    setLoading(true);
    try {
      const response = await ApiService.post<TaskComment>(`/tasks/${task.id}/comments`, {
        comment,
      });
      setComments([...comments, response.data]);
      setComment('');
    } catch (error) {
      console.error('Failed to add comment:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: Task['status']) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'in_progress':
        return 'bg-blue-100 text-blue-800';
      case 'completed':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const handlePOStatusChange = async (status: PurchaseOrder['status']) => {
    if (!task.purchase_order || !onPOStatusChange) return;
    await onPOStatusChange(status);
  };

  const handleStatusChange = async (newStatus: Task['status']) => {
    if (!task) return;

    try {
      await onStatusChange(newStatus);

      // If task is completed, calculate and send commission notification
      if (newStatus === 'completed') {
        // First get the current payroll settings
        const settingsResponse = await ApiService.get<PayrollSettings>('/payroll/settings');
        const commission = calculateCommission(task, settingsResponse.data);

        const commissionResponse = await ApiService.post<{
          amount: number;
          totalEarned: number;
        }>(`/tasks/${task.id}/commission`, {
          task_id: task.id,
          employee_id: assignedUser.id,
          commission_type: task.purchase_order ? 'po_completion' : 'task_completion',
          amount: commission,
        });

        // Send email notification
        await EmailService.sendCommissionNotification({
          employeeId: assignedUser.id,
          employeeName: `${assignedUser.first_name} ${assignedUser.last_name}`,
          taskTitle: task.title,
          commissionAmount: commissionResponse.data.amount,
          commissionType: task.purchase_order ? 'po_completion' : 'task_completion',
          totalEarned: commissionResponse.data.totalEarned,
        });
      }
    } catch (err) {
      console.error('Failed to update task status:', err instanceof Error ? err.message : 'Failed to update task status');
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg p-6 shadow-sm">
        <div className="flex justify-between items-start">
          <div>
            <h2 className="text-xl font-semibold">{task.title}</h2>
            <p className="text-gray-600 mt-2">{task.description}</p>
          </div>
          <div className="flex items-center space-x-4">
            <span className={`px-3 py-1 rounded-full text-sm ${getStatusColor(task.status)}`}>
              {task.status.replace('_', ' ')}
            </span>
            <select
              value={task.status}
              onChange={(e) => handleStatusChange(e.target.value as Task['status'])}
              className="rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
            >
              <option value="pending">Pending</option>
              <option value="in_progress">In Progress</option>
              <option value="completed">Completed</option>
            </select>
          </div>
        </div>

        <div className="mt-4 grid grid-cols-2 gap-4 text-sm text-gray-600">
          <div>
            <span className="font-medium">Assigned to:</span>{' '}
            {assignedUser.first_name} {assignedUser.last_name}
          </div>
          <div>
            <span className="font-medium">Due Date:</span>{' '}
            {new Date(task.due_date).toLocaleDateString()}
          </div>
          <div>
            <span className="font-medium">Priority:</span>{' '}
            <span className={`px-2 py-1 rounded text-sm ${
              task.priority === 'high' ? 'bg-red-100 text-red-800' :
              task.priority === 'medium' ? 'bg-yellow-100 text-yellow-800' :
              'bg-green-100 text-green-800'
            }`}>
              {task.priority}
            </span>
          </div>
        </div>

        {task.purchase_order && (
          <div className="mt-6 pt-6 border-t">
            <h3 className="text-lg font-medium mb-4">Purchase Order Status</h3>
            <PurchaseOrderStatus
              purchaseOrder={task.purchase_order}
              onStatusChange={handlePOStatusChange}
              showActions={isAdmin}
            />
          </div>
        )}
      </div>

      <div className="bg-white rounded-lg shadow-sm p-6">
        <h3 className="text-lg font-medium mb-4">Comments</h3>
        <div className="space-y-4 mb-6">
          {comments.map((comment) => (
            <div key={comment.id} className="bg-gray-50 rounded-lg p-4">
              <p className="text-gray-900">{comment.comment}</p>
              <p className="text-sm text-gray-500 mt-1">
                {new Date(comment.created_at).toLocaleString()}
              </p>
            </div>
          ))}
        </div>

        <form onSubmit={handleAddComment} className="space-y-4">
          <div>
            <label htmlFor="comment" className="sr-only">
              Add a comment
            </label>
            <textarea
              id="comment"
              rows={3}
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
              placeholder="Add a comment..."
              required
            />
          </div>
          <div className="flex justify-end">
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50"
            >
              {loading ? 'Adding...' : 'Add Comment'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
} 