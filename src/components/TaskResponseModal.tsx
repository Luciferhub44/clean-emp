import { useState } from 'react';
import Modal from '@/components/Modal';

interface TaskResponseModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (response: 'accepted' | 'rejected', notes: string) => Promise<void>;
}

export default function TaskResponseModal({ isOpen, onClose, onSubmit }: TaskResponseModalProps) {
  const [notes, setNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleResponse = async (response: 'accepted' | 'rejected') => {
    setIsSubmitting(true);
    setError(null);
    try {
      await onSubmit(response, notes);
      setNotes('');
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to submit response');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Task Response"
    >
      <div className="space-y-4">
        {error && (
          <div className="text-red-600 text-sm">
            {error}
          </div>
        )}

        <div>
          <label htmlFor="notes" className="block text-sm font-medium text-gray-700">
            Response Notes
          </label>
          <textarea
            id="notes"
            rows={4}
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
            placeholder="Add any notes about your decision..."
          />
        </div>

        <div className="flex justify-end space-x-3">
          <button
            onClick={() => handleResponse('rejected')}
            disabled={isSubmitting}
            className="px-4 py-2 border border-red-300 text-red-700 rounded-md hover:bg-red-50 disabled:opacity-50"
          >
            Reject Task
          </button>
          <button
            onClick={() => handleResponse('accepted')}
            disabled={isSubmitting}
            className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:opacity-50"
          >
            Accept Task
          </button>
        </div>
      </div>
    </Modal>
  );
} 