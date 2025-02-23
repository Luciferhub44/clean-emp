import { useState } from 'react';
import { User } from '@/types';
import ApiService from '@/services/api';
import { useAuth } from '@/hooks/useAuth';

interface ProfileConfirmationProps {
  onConfirmed: () => void;
}

export default function ProfileConfirmation({ onConfirmed }: ProfileConfirmationProps) {
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    phone: user?.phone || '',
    address: user?.address || '',
    emergency_contact: {
      name: user?.emergency_contact?.name || '',
      phone: user?.emergency_contact?.phone || '',
      relationship: user?.emergency_contact?.relationship || '',
    },
    bank_info: {
      account_name: user?.bank_info?.account_name || '',
      account_number: user?.bank_info?.account_number || '',
      bank_name: user?.bank_info?.bank_name || '',
      routing_number: user?.bank_info?.routing_number || '',
    },
  });

  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      await ApiService.put('/employee/profile/confirm', {
        ...formData,
        profile_confirmed: true,
        profile_confirmed_at: new Date().toISOString(),
      });
      onConfirmed();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to confirm profile');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
          Welcome! Please Confirm Your Profile
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          We need some additional information before you can continue
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-xl">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="text-red-600 text-sm">{error}</div>
            )}

            <div>
              <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
                Phone Number
              </label>
              <input
                type="tel"
                id="phone"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                required
              />
            </div>

            <div>
              <label htmlFor="address" className="block text-sm font-medium text-gray-700">
                Address
              </label>
              <textarea
                id="address"
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                rows={3}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                required
              />
            </div>

            <div className="border-t pt-6">
              <h3 className="text-lg font-medium mb-4">Emergency Contact</h3>
              <div className="grid grid-cols-1 gap-6">
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
                    required
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
                    required
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
                    required
                  />
                </div>
              </div>
            </div>

            <div className="border-t pt-6">
              <h3 className="text-lg font-medium mb-4">Bank Information</h3>
              <div className="grid grid-cols-1 gap-6">
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
                    required
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
                    required
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
                    required
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
                    required
                  />
                </div>
              </div>
            </div>

            <div className="flex justify-end">
              <button
                type="submit"
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Confirming...' : 'Confirm Profile'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
} 