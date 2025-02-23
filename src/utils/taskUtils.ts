import { Task } from '@/types';
import { TaskFilters } from '@/components/TaskFilter';

export const filterAndSortTasks = (tasks: Task[], filters: TaskFilters): Task[] => {
  let filteredTasks = [...tasks];

  // Apply status filter
  if (filters.status !== 'all') {
    filteredTasks = filteredTasks.filter(task => task.status === filters.status);
  }

  // Apply priority filter
  if (filters.priority !== 'all') {
    filteredTasks = filteredTasks.filter(task => task.priority === filters.priority);
  }

  // Apply sorting
  const priorityOrder = { high: 3, medium: 2, low: 1 };
  const statusOrder = { pending: 1, in_progress: 2, completed: 3 };

  filteredTasks.sort((a, b) => {
    let comparison = 0;
    
    switch (filters.sortBy) {
      case 'due_date':
        comparison = new Date(a.due_date).getTime() - new Date(b.due_date).getTime();
        break;
      case 'priority':
        comparison = priorityOrder[b.priority] - priorityOrder[a.priority];
        break;
      case 'status':
        comparison = statusOrder[a.status] - statusOrder[b.status];
        break;
    }

    return filters.sortOrder === 'asc' ? comparison : -comparison;
  });

  return filteredTasks;
}; 