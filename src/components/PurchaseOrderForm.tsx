import { useState } from 'react';
import { PurchaseOrder } from '@/types';

interface FormItem {
  description: string;
  quantity: number;
  unit_price: number;
  total_price: number;
}

interface PurchaseOrderFormProps {
  onSubmit: (po: Omit<PurchaseOrder, 'id' | 'created_at' | 'updated_at'>) => Promise<void>;
  onCancel: () => void;
  initialData?: Partial<PurchaseOrder>;
}

export default function PurchaseOrderForm({ onSubmit, onCancel, initialData }: PurchaseOrderFormProps) {
  const [formData, setFormData] = useState({
    order_number: initialData?.order_number || '',
    vendor: initialData?.vendor || '',
    notes: initialData?.notes || '',
    items: (initialData?.items || []).map(item => ({
      description: item.description || '',
      quantity: item.quantity || 1,
      unit_price: item.unit_price || 0,
      total_price: item.total_price || 0,
    })) as FormItem[],
  });

  const [error, setError] = useState<string | null>(null);

  const addItem = () => {
    setFormData({
      ...formData,
      items: [...formData.items, { description: '', quantity: 1, unit_price: 0, total_price: 0 }],
    });
  };

  const removeItem = (index: number) => {
    setFormData({
      ...formData,
      items: formData.items.filter((_, i) => i !== index),
    });
  };

  const updateItem = (index: number, field: keyof FormItem, value: string | number) => {
    const newItems = [...formData.items] as FormItem[];
    const item = { ...newItems[index] };
    
    item[field] = value as never;
    
    if (field === 'quantity' || field === 'unit_price') {
      item.total_price = item.quantity * item.unit_price;
    }
    
    newItems[index] = item;
    setFormData({ ...formData, items: newItems });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const total_amount = formData.items.reduce((sum, item) => sum + item.total_price, 0);
      
      const purchaseOrderData: Omit<PurchaseOrder, 'id' | 'created_at' | 'updated_at'> = {
        order_number: formData.order_number,
        vendor: formData.vendor,
        notes: formData.notes,
        status: 'pending',
        total_amount,
        items: formData.items.map(item => ({
          id: 0, // This will be set by the backend
          po_id: 0, // This will be set by the backend
          description: item.description,
          quantity: item.quantity,
          unit_price: item.unit_price,
          total_price: item.total_price,
        })),
      };

      await onSubmit(purchaseOrderData);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to submit purchase order');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <div className="text-red-600 text-sm">{error}</div>
      )}

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label htmlFor="order_number" className="block text-sm font-medium text-gray-700">
            PO Number
          </label>
          <input
            type="text"
            id="order_number"
            value={formData.order_number}
            onChange={(e) => setFormData({ ...formData, order_number: e.target.value })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
            required
          />
        </div>

        <div>
          <label htmlFor="vendor" className="block text-sm font-medium text-gray-700">
            Vendor
          </label>
          <input
            type="text"
            id="vendor"
            value={formData.vendor}
            onChange={(e) => setFormData({ ...formData, vendor: e.target.value })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
            required
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Items
        </label>
        <div className="space-y-4">
          {formData.items.map((item, index) => (
            <div key={index} className="flex gap-4 items-start">
              <div className="flex-1">
                <input
                  type="text"
                  placeholder="Description"
                  value={item.description}
                  onChange={(e) => updateItem(index, 'description', e.target.value)}
                  className="w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                  required
                />
              </div>
              <div className="w-24">
                <input
                  type="number"
                  placeholder="Qty"
                  value={item.quantity}
                  onChange={(e) => updateItem(index, 'quantity', Number(e.target.value))}
                  className="w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                  min="1"
                  required
                />
              </div>
              <div className="w-32">
                <input
                  type="number"
                  placeholder="Unit Price"
                  value={item.unit_price}
                  onChange={(e) => updateItem(index, 'unit_price', Number(e.target.value))}
                  className="w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                  min="0"
                  step="0.01"
                  required
                />
              </div>
              <button
                type="button"
                onClick={() => removeItem(index)}
                className="text-red-600 hover:text-red-800"
              >
                Remove
              </button>
            </div>
          ))}
        </div>
        <button
          type="button"
          onClick={addItem}
          className="mt-2 text-primary-600 hover:text-primary-800"
        >
          + Add Item
        </button>
      </div>

      <div>
        <label htmlFor="notes" className="block text-sm font-medium text-gray-700">
          Notes
        </label>
        <textarea
          id="notes"
          value={formData.notes}
          onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
          rows={3}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
        />
      </div>

      <div className="flex justify-end space-x-2">
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
          Create Purchase Order
        </button>
      </div>
    </form>
  );
} 