import { Task } from '@/types';

interface TaskListProps {
  tasks: Task[];
  onStatusChange?: (taskId: number, status: Task['status']) => Promise<void>;
}

export default function TaskList({ tasks, onStatusChange }: TaskListProps) {
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

  return (
    <div className="space-y-4">
      {tasks.map((task) => (
        <div key={task.id} className="bg-white rounded-lg shadow p-4">
          <div className="flex justify-between items-start">
            <div>
              <h3 className="text-lg font-medium">{task.title}</h3>
              <p className="text-gray-600 mt-1">{task.description}</p>
            </div>
            {onStatusChange && (
              <select
                value={task.status}
                onChange={(e) => onStatusChange(task.id, e.target.value as Task['status'])}
                className="ml-4 rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
              >
                <option value="pending">Pending</option>
                <option value="in_progress">In Progress</option>
                <option value="completed">Completed</option>
              </select>
            )}
          </div>
          <div className="mt-4 flex justify-between items-center">
            <span className={`px-2 py-1 rounded text-sm ${getStatusColor(task.status)}`}>
              {task.status.replace('_', ' ')}
            </span>
            <span className={`px-2 py-1 rounded text-sm ${
              task.priority === 'high' ? 'bg-red-100 text-red-800' :
              task.priority === 'medium' ? 'bg-yellow-100 text-yellow-800' :
              'bg-green-100 text-green-800'
            }`}>
              {task.priority}
            </span>
            <span className="text-sm text-gray-500">
              Due: {new Date(task.due_date).toLocaleDateString()}
            </span>
          </div>
        </div>
      ))}
    </div>
  );
} 