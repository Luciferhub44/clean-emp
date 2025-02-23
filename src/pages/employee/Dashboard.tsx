import { useState, useEffect } from 'react';
import { Task } from '@/types';
import ApiService from '@/services/api';
import LoadingSpinner from '@/components/LoadingSpinner';
import TaskView from '@/components/TaskView';
import TaskFilter, { TaskFilters } from '@/components/TaskFilter';
import { filterAndSortTasks } from '@/utils/taskUtils';

export default function EmployeeDashboard() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedTaskId, setSelectedTaskId] = useState<number | null>(null);
  const [filters, setFilters] = useState<TaskFilters>({
    status: 'all',
    priority: 'all',
    sortBy: 'due_date',
    sortOrder: 'asc',
  });

  const fetchTasks = async () => {
    try {
      const response = await ApiService.get<Task[]>('/employee/tasks');
      setTasks(response.data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch tasks');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  const handleTaskClick = (taskId: number) => {
    setSelectedTaskId(taskId);
  };

  const filteredTasks = filterAndSortTasks(tasks, filters);

  if (error) {
    return (
      <div className="text-red-600 text-center py-4">
        Error: {error}
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">My Tasks</h1>
      
      <TaskFilter onFilterChange={setFilters} />

      {loading ? (
        <LoadingSpinner />
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {filteredTasks.map((task) => (
            <div
              key={task.id}
              onClick={() => handleTaskClick(task.id)}
              className="bg-white p-4 rounded-lg shadow cursor-pointer hover:shadow-md transition-shadow"
            >
              <h3 className="font-semibold text-lg">{task.title}</h3>
              <p className="text-gray-600 mt-2 line-clamp-2">{task.description}</p>
              <div className="mt-4 flex justify-between items-center">
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
      )}

      {selectedTaskId && (
        <TaskView
          taskId={selectedTaskId}
          isOpen={!!selectedTaskId}
          onClose={() => setSelectedTaskId(null)}
          onTaskUpdate={fetchTasks}
        />
      )}
    </div>
  );
} 