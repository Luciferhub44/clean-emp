import { useState } from 'react';
import { User } from '@/types';
import ApiService from '@/services/api';

interface EmployeeFormProps {
  employee: User | null;
  onSubmit: () => Promise<void>;
  onCancel: () => void;
}

export default function EmployeeForm({ employee, onSubmit, onCancel }: EmployeeFormProps) {
  const [formData, setFormData] = useState({
    first_name: employee?.first_name || '',
    last_name: employee?.last_name || '',
    email: employee?.email || '',
    phone: employee?.phone || '',
    address: employee?.address || '',
    password: '',
    emergency_contact: {
      name: employee?.emergency_contact?.name || '',
      phone: employee?.emergency_contact?.phone || '',
      relationship: employee?.emergency_contact?.relationship || '',
    },
    bank_info: {
      account_name: employee?.bank_info?.account_name || '',
      account_number: employee?.bank_info?.account_number || '',
      bank_name: employee?.bank_info?.bank_name || '',
      routing_number: employee?.bank_info?.routing_number || '',
    },
  });
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      if (employee) {
        await ApiService.put(`/admin/employees/${employee.id}`, formData);
      } else {
        await ApiService.post('/admin/employees', formData);
      }
      await onSubmit();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save employee');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <div className="text-red-600 text-sm">{error}</div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label htmlFor="first_name" className="block text-sm font-medium text-gray-700">
            First Name
          </label>
          <input
            type="text"
            id="first_name"
            value={formData.first_name}
            onChange={(e) => setFormData({ ...formData, first_name: e.target.value })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
            required
          />
        </div>

        <div>
          <label htmlFor="last_name" className="block text-sm font-medium text-gray-700">
            Last Name
          </label>
          <input
            type="text"
            id="last_name"
            value={formData.last_name}
            onChange={(e) => setFormData({ ...formData, last_name: e.target.value })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
            required
          />
        </div>

        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700">
            Email
          </label>
          <input
            type="email"
            id="email"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
            required
          />
        </div>

        {!employee && (
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700">
              Initial Password
            </label>
            <input
              type="password"
              id="password"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
              required={!employee}
              minLength={8}
            />
          </div>
        )}
      </div>

      <div className="border-t pt-6">
        <h3 className="text-lg font-medium mb-4">Emergency Contact</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <label htmlFor="ec_name" className="block text-sm font-medium text-gray-700">
              Contact Name
            </label>
            <input
              type="text"
              id="ec_name"
              value={formData.emergency_contact.name}
              onChange={(e) => setFormData({
                ...formData,
                emergency_contact: { ...formData.emergency_contact, name: e.target.value }
              })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
            />
          </div>

          <div>
            <label htmlFor="ec_phone" className="block text-sm font-medium text-gray-700">
              Contact Phone
            </label>
            <input
              type="tel"
              id="ec_phone"
              value={formData.emergency_contact.phone}
              onChange={(e) => setFormData({
                ...formData,
                emergency_contact: { ...formData.emergency_contact, phone: e.target.value }
              })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
            />
          </div>

          <div>
            <label htmlFor="ec_relationship" className="block text-sm font-medium text-gray-700">
              Relationship
            </label>
            <input
              type="text"
              id="ec_relationship"
              value={formData.emergency_contact.relationship}
              onChange={(e) => setFormData({
                ...formData,
                emergency_contact: { ...formData.emergency_contact, relationship: e.target.value }
              })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
            />
          </div>
        </div>
      </div>

      <div className="border-t pt-6">
        <h3 className="text-lg font-medium mb-4">Bank Information</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label htmlFor="bank_name" className="block text-sm font-medium text-gray-700">
              Bank Name
            </label>
            <input
              type="text"
              id="bank_name"
              value={formData.bank_info.bank_name}
              onChange={(e) => setFormData({
                ...formData,
                bank_info: { ...formData.bank_info, bank_name: e.target.value }
              })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
            />
          </div>

          <div>
            <label htmlFor="account_name" className="block text-sm font-medium text-gray-700">
              Account Name
            </label>
            <input
              type="text"
              id="account_name"
              value={formData.bank_info.account_name}
              onChange={(e) => setFormData({
                ...formData,
                bank_info: { ...formData.bank_info, account_name: e.target.value }
              })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
            />
          </div>

          <div>
            <label htmlFor="account_number" className="block text-sm font-medium text-gray-700">
              Account Number
            </label>
            <input
              type="text"
              id="account_number"
              value={formData.bank_info.account_number}
              onChange={(e) => setFormData({
                ...formData,
                bank_info: { ...formData.bank_info, account_number: e.target.value }
              })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
            />
          </div>

          <div>
            <label htmlFor="routing_number" className="block text-sm font-medium text-gray-700">
              Routing Number
            </label>
            <input
              type="text"
              id="routing_number"
              value={formData.bank_info.routing_number}
              onChange={(e) => setFormData({
                ...formData,
                bank_info: { ...formData.bank_info, routing_number: e.target.value }
              })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
            />
          </div>
        </div>
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
          {isSubmitting ? 'Saving...' : employee ? 'Update Employee' : 'Create Employee'}
        </button>
      </div>
    </form>
  );
} 