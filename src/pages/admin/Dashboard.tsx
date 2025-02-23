import { useState, useEffect } from 'react';
import { User, Task } from '@/types';
import ApiService from '@/services/api';
import LoadingSpinner from '@/components/LoadingSpinner';
import Modal from '@/components/Modal';
import TaskForm from '@/components/TaskForm';
import TaskView from '@/components/TaskView';
import TaskFilter, { TaskFilters } from '@/components/TaskFilter';
import TaskCard from '@/components/TaskCard';
import { filterAndSortTasks } from '@/utils/taskUtils';

interface EmployeeWithTasks extends User {
  tasks: Task[];
}

export default function AdminDashboard() {
  const [employees, setEmployees] = useState<EmployeeWithTasks[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedEmployee, setSelectedEmployee] = useState<number | null>(null);
  const [selectedTaskId, setSelectedTaskId] = useState<number | null>(null);
  const [isAddingTask, setIsAddingTask] = useState(false);
  const [filters, setFilters] = useState<TaskFilters>({
    status: 'all',
    priority: 'all',
    sortBy: 'due_date',
    sortOrder: 'asc',
  });

  const fetchEmployees = async () => {
    try {
      const response = await ApiService.get<EmployeeWithTasks[]>('/admin/employees/tasks');
      setEmployees(response.data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch employees');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEmployees();
  }, []);

  const handleAddTask = (employeeId: number) => {
    setSelectedEmployee(employeeId);
    setIsAddingTask(true);
  };

  const handleTaskSubmit = async (taskData: Omit<Task, 'id'>) => {
    if (!selectedEmployee) return;

    try {
      const currentUser = JSON.parse(localStorage.getItem('user') || '{}');
      const taskPayload = {
        ...taskData,
        assigned_to: selectedEmployee,
        assigned_by: currentUser.id,
      };

      // Create task
      const taskResponse = await ApiService.post<Task>('/admin/tasks', taskPayload);
      
      // If there's a PO, create it and link it to the task
      if (taskData.purchase_order) {
        await ApiService.post(`/admin/tasks/${taskResponse.data.id}/purchase-order`, taskData.purchase_order);
      }

      setIsAddingTask(false);
      fetchEmployees();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create task');
    }
  };

  const handleTaskClick = (taskId: number) => {
    setSelectedTaskId(taskId);
  };

  if (error) {
    return (
      <div className="text-red-600 text-center py-4">
        Error: {error}
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Employee Task Management</h1>
      
      <TaskFilter onFilterChange={setFilters} />

      {loading ? (
        <LoadingSpinner />
      ) : (
        <div className="space-y-8">
          {employees.map((employee) => {
            const filteredTasks = filterAndSortTasks(employee.tasks, filters);
            
            return (
              <div key={employee.id} className="bg-white rounded-lg shadow-sm overflow-hidden">
                <div className="p-6 border-b border-gray-200">
                  <div className="flex justify-between items-center">
                    <h2 className="text-xl font-semibold">
                      {employee.first_name} {employee.last_name}
                    </h2>
                    <button
                      onClick={() => handleAddTask(employee.id)}
                      className="bg-primary-600 text-white px-4 py-2 rounded-md hover:bg-primary-700"
                    >
                      Assign Task
                    </button>
                  </div>
                  <p className="text-gray-600 mt-1">{employee.email}</p>
                </div>

                <div className="p-6">
                  <h3 className="text-lg font-medium mb-4">Assigned Tasks</h3>
                  {filteredTasks.length === 0 ? (
                    <p className="text-gray-500">No tasks assigned</p>
                  ) : (
                    <div className="grid gap-4 md:grid-cols-2">
                      {filteredTasks.map((task) => (
                        <TaskCard
                          key={task.id}
                          task={task}
                          onClick={handleTaskClick}
                          showStatus
                        />
                      ))}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      <Modal
        isOpen={isAddingTask}
        onClose={() => setIsAddingTask(false)}
        title="Assign New Task"
      >
        <TaskForm
          onSubmit={handleTaskSubmit}
          onCancel={() => setIsAddingTask(false)}
        />
      </Modal>

      {selectedTaskId && (
        <TaskView
          taskId={selectedTaskId}
          isOpen={!!selectedTaskId}
          onClose={() => setSelectedTaskId(null)}
          onTaskUpdate={fetchEmployees}
        />
      )}
    </div>
  );
} 