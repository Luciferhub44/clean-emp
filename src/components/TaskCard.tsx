import { Task } from '@/types';

interface TaskCardProps {
  task: Task;
  onClick: (taskId: number) => void;
  showStatus?: boolean;
}

export default function TaskCard({ task, onClick, showStatus = false }: TaskCardProps) {
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
    <div
      onClick={() => onClick(task.id)}
      className="bg-white p-4 rounded-lg shadow cursor-pointer hover:shadow-md transition-shadow"
    >
      <h3 className="font-semibold text-lg">{task.title}</h3>
      <p className="text-gray-600 mt-2 line-clamp-2">{task.description}</p>
      <div className="mt-4 flex flex-wrap gap-2 items-center">
        <div className="flex space-x-2">
          <span className={`px-2 py-1 rounded text-sm ${
            task.priority === 'high' ? 'bg-red-100 text-red-800' :
            task.priority === 'medium' ? 'bg-yellow-100 text-yellow-800' :
            'bg-green-100 text-green-800'
          }`}>
            {task.priority}
          </span>
          {showStatus && (
            <span className={`px-2 py-1 rounded text-sm ${getStatusColor(task.status)}`}>
              {task.status.replace('_', ' ')}
            </span>
          )}
          {task.purchase_order && (
            <span className={`px-2 py-1 rounded text-sm ${
              task.employee_response === 'accepted' ? 'bg-green-100 text-green-800' :
              task.employee_response === 'rejected' ? 'bg-red-100 text-red-800' :
              'bg-gray-100 text-gray-800'
            }`}>
              {task.employee_response ? `Task ${task.employee_response}` : 'Pending Response'}
            </span>
          )}
        </div>
        <span className="text-sm text-gray-500 ml-auto">
          Due: {new Date(task.due_date).toLocaleDateString()}
        </span>
      </div>
    </div>
  );
} 