import { useState } from 'react';
import { Task, PurchaseOrder } from '@/types';
import PurchaseOrderForm from './PurchaseOrderForm';
import PurchaseOrderPreview from './PurchaseOrderPreview';

interface TaskFormProps {
  onSubmit: (task: Omit<Task, 'id'>) => Promise<void>;
  onCancel: () => void;
  initialData?: Partial<Task>;
}

export default function TaskForm({ onSubmit, onCancel, initialData }: TaskFormProps) {
  const [formData, setFormData] = useState({
    title: initialData?.title || '',
    description: initialData?.description || '',
    priority: initialData?.priority || 'medium',
    due_date: initialData?.due_date ? new Date(initialData.due_date).toISOString().split('T')[0] : '',
  });
  const [showPOForm, setShowPOForm] = useState(false);
  const [purchaseOrder, setPurchaseOrder] = useState<Omit<PurchaseOrder, 'id' | 'created_at' | 'updated_at'> | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await onSubmit({
        ...formData,
        status: 'pending',
        assigned_to: 0, // This will be set by the parent component
        assigned_by: 0, // This will be set from the current user
        purchase_order: purchaseOrder || undefined,
      } as Omit<Task, 'id'>);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to submit task');
    }
  };

  const handlePOSubmit = async (po: Omit<PurchaseOrder, 'id' | 'created_at' | 'updated_at'>) => {
    setPurchaseOrder(po);
    setShowPOForm(false);
  };

  const handleRemovePO = () => {
    setPurchaseOrder(null);
  };

  return (
    <div className="space-y-6">
      <form onSubmit={handleSubmit} className="space-y-4">
        {error && (
          <div className="text-red-600 text-sm">{error}</div>
        )}

        <div>
          <label htmlFor="title" className="block text-sm font-medium text-gray-700">
            Title
          </label>
          <input
            type="text"
            id="title"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
            required
          />
        </div>

        <div>
          <label htmlFor="description" className="block text-sm font-medium text-gray-700">
            Description
          </label>
          <textarea
            id="description"
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            rows={3}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
            required
          />
        </div>

        <div>
          <label htmlFor="priority" className="block text-sm font-medium text-gray-700">
            Priority
          </label>
          <select
            id="priority"
            value={formData.priority}
            onChange={(e) => setFormData({ ...formData, priority: e.target.value as Task['priority'] })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
          >
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
          </select>
        </div>

        <div>
          <label htmlFor="due_date" className="block text-sm font-medium text-gray-700">
            Due Date
          </label>
          <input
            type="date"
            id="due_date"
            value={formData.due_date}
            onChange={(e) => setFormData({ ...formData, due_date: e.target.value })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
            required
          />
        </div>

        <div className="flex justify-between items-center">
          {!purchaseOrder ? (
            <button
              type="button"
              onClick={() => setShowPOForm(true)}
              className="text-primary-600 hover:text-primary-800"
            >
              + Add Purchase Order
            </button>
          ) : (
            <button
              type="button"
              onClick={handleRemovePO}
              className="text-red-600 hover:text-red-800"
            >
              Remove Purchase Order
            </button>
          )}

          <div className="flex space-x-2">
            <button
              type="button"
              onClick={onCancel}
              className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700"
            >
              Create Task
            </button>
          </div>
        </div>
      </form>

      {showPOForm && (
        <div className="mt-8 border-t pt-6">
          <h3 className="text-lg font-medium mb-4">Purchase Order Details</h3>
          <PurchaseOrderForm
            onSubmit={handlePOSubmit}
            onCancel={() => setShowPOForm(false)}
          />
        </div>
      )}

      {purchaseOrder && !showPOForm && (
        <div className="mt-8 border-t pt-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-medium">Purchase Order Preview</h3>
            <button
              type="button"
              onClick={() => setShowPOForm(true)}
              className="text-primary-600 hover:text-primary-800"
            >
              Edit Purchase Order
            </button>
          </div>
          <PurchaseOrderPreview
            purchaseOrder={{
              ...purchaseOrder,
              id: 0,
              created_at: new Date().toISOString(),
              updated_at: new Date().toISOString(),
            }}
          />
        </div>
      )}
    </div>
  );
} 