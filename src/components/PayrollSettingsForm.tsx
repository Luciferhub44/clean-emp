import { useState } from 'react';
import { PayrollSettings } from '@/types';
import ApiService from '@/services/api';

interface PayrollSettingsFormProps {
  initialData?: PayrollSettings;
  onSubmit: () => void;
  onCancel: () => void;
}

export default function PayrollSettingsForm({
  initialData,
  onSubmit,
  onCancel,
}: PayrollSettingsFormProps) {
  const [formData, setFormData] = useState({
    base_salary: initialData?.base_salary || 0,
    commission_rate: initialData?.commission_rate || 0,
    po_commission_rate: initialData?.po_commission_rate || 0,
    pay_period: initialData?.pay_period || '1 month',
  });
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      await ApiService.put('/admin/payroll/settings', formData);
      onSubmit();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update payroll settings');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <div className="text-red-600 text-sm">{error}</div>
      )}

      <div>
        <label htmlFor="base_salary" className="block text-sm font-medium text-gray-700">
          Base Salary
        </label>
        <div className="mt-1 relative rounded-md shadow-sm">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <span className="text-gray-500 sm:text-sm">$</span>
          </div>
          <input
            type="number"
            id="base_salary"
            min="0"
            step="0.01"
            value={formData.base_salary}
            onChange={(e) => setFormData({ ...formData, base_salary: Number(e.target.value) })}
            className="pl-7 block w-full rounded-md border-gray-300 focus:ring-primary-500 focus:border-primary-500"
            required
          />
        </div>
      </div>

      <div>
        <label htmlFor="commission_rate" className="block text-sm font-medium text-gray-700">
          Task Commission Rate (%)
        </label>
        <input
          type="number"
          id="commission_rate"
          min="0"
          max="100"
          step="0.01"
          value={formData.commission_rate}
          onChange={(e) => setFormData({ ...formData, commission_rate: Number(e.target.value) })}
          className="mt-1 block w-full rounded-md border-gray-300 focus:ring-primary-500 focus:border-primary-500"
          required
        />
      </div>

      <div>
        <label htmlFor="po_commission_rate" className="block text-sm font-medium text-gray-700">
          PO Commission Rate (%)
        </label>
        <input
          type="number"
          id="po_commission_rate"
          min="0"
          max="100"
          step="0.01"
          value={formData.po_commission_rate}
          onChange={(e) => setFormData({ ...formData, po_commission_rate: Number(e.target.value) })}
          className="mt-1 block w-full rounded-md border-gray-300 focus:ring-primary-500 focus:border-primary-500"
          required
        />
      </div>

      <div>
        <label htmlFor="pay_period" className="block text-sm font-medium text-gray-700">
          Pay Period
        </label>
        <select
          id="pay_period"
          value={formData.pay_period}
          onChange={(e) => setFormData({ ...formData, pay_period: e.target.value })}
          className="mt-1 block w-full rounded-md border-gray-300 focus:ring-primary-500 focus:border-primary-500"
        >
          <option value="1 week">Weekly</option>
          <option value="2 weeks">Bi-weekly</option>
          <option value="1 month">Monthly</option>
        </select>
      </div>

      <div className="flex justify-end space-x-3">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
          disabled={isSubmitting}
        >
          Cancel
        </button>
        <button
          type="submit"
          className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 disabled:opacity-50"
          disabled={isSubmitting}
        >
          Save Settings
        </button>
      </div>
    </form>
  );
} 