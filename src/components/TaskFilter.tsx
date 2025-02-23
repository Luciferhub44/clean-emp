import { useState, useEffect } from 'react';
import { Task } from '@/types';

interface TaskFilterProps {
  onFilterChange: (filters: TaskFilters) => void;
}

export interface TaskFilters {
  status: Task['status'] | 'all';
  priority: Task['priority'] | 'all';
  sortBy: 'due_date' | 'priority' | 'status';
  sortOrder: 'asc' | 'desc';
}

export default function TaskFilter({ onFilterChange }: TaskFilterProps) {
  const [filters, setFilters] = useState<TaskFilters>({
    status: 'all',
    priority: 'all',
    sortBy: 'due_date',
    sortOrder: 'asc',
  });

  useEffect(() => {
    onFilterChange(filters);
  }, [filters, onFilterChange]);

  return (
    <div className="bg-white p-4 rounded-lg shadow-sm mb-6">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div>
          <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-1">
            Status
          </label>
          <select
            id="status"
            value={filters.status}
            onChange={(e) => setFilters({ ...filters, status: e.target.value as TaskFilters['status'] })}
            className="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
          >
            <option value="all">All</option>
            <option value="pending">Pending</option>
            <option value="in_progress">In Progress</option>
            <option value="completed">Completed</option>
          </select>
        </div>

        <div>
          <label htmlFor="priority" className="block text-sm font-medium text-gray-700 mb-1">
            Priority
          </label>
          <select
            id="priority"
            value={filters.priority}
            onChange={(e) => setFilters({ ...filters, priority: e.target.value as TaskFilters['priority'] })}
            className="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
          >
            <option value="all">All</option>
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
          </select>
        </div>

        <div>
          <label htmlFor="sortBy" className="block text-sm font-medium text-gray-700 mb-1">
            Sort By
          </label>
          <select
            id="sortBy"
            value={filters.sortBy}
            onChange={(e) => setFilters({ ...filters, sortBy: e.target.value as TaskFilters['sortBy'] })}
            className="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
          >
            <option value="due_date">Due Date</option>
            <option value="priority">Priority</option>
            <option value="status">Status</option>
          </select>
        </div>

        <div>
          <label htmlFor="sortOrder" className="block text-sm font-medium text-gray-700 mb-1">
            Sort Order
          </label>
          <select
            id="sortOrder"
            value={filters.sortOrder}
            onChange={(e) => setFilters({ ...filters, sortOrder: e.target.value as TaskFilters['sortOrder'] })}
            className="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
          >
            <option value="asc">Ascending</option>
            <option value="desc">Descending</option>
          </select>
        </div>
      </div>
    </div>
  );
} 