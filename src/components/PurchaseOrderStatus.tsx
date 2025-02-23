import { PurchaseOrder } from '@/types';

interface PurchaseOrderStatusProps {
  purchaseOrder: PurchaseOrder;
  onStatusChange?: (status: PurchaseOrder['status']) => Promise<void>;
  showActions?: boolean;
}

export default function PurchaseOrderStatus({ 
  purchaseOrder, 
  onStatusChange,
  showActions = false 
}: PurchaseOrderStatusProps) {
  const getStatusColor = (status: PurchaseOrder['status']) => {
    switch (status) {
      case 'approved':
        return 'bg-green-100 text-green-800';
      case 'rejected':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-yellow-100 text-yellow-800';
    }
  };

  const getStatusSteps = () => {
    const steps = [
      { id: 'created', label: 'Created', completed: true },
      { id: 'pending', label: 'Pending Review', completed: purchaseOrder.status !== 'pending' },
      { id: 'approved', label: 'Approved', completed: purchaseOrder.status === 'approved' },
    ];

    if (purchaseOrder.status === 'rejected') {
      steps[2] = { id: 'rejected', label: 'Rejected', completed: true };
    }

    return steps;
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <span className={`px-2 py-1 rounded-full text-sm ${getStatusColor(purchaseOrder.status)}`}>
            {purchaseOrder.status.charAt(0).toUpperCase() + purchaseOrder.status.slice(1)}
          </span>
          <span className="text-sm text-gray-500">
            Last updated: {new Date(purchaseOrder.updated_at).toLocaleDateString()}
          </span>
        </div>

        {showActions && onStatusChange && purchaseOrder.status === 'pending' && (
          <div className="flex space-x-2">
            <button
              onClick={() => onStatusChange('rejected')}
              className="px-3 py-1 text-sm border border-red-300 text-red-700 rounded hover:bg-red-50"
            >
              Reject
            </button>
            <button
              onClick={() => onStatusChange('approved')}
              className="px-3 py-1 text-sm bg-green-600 text-white rounded hover:bg-green-700"
            >
              Approve
            </button>
          </div>
        )}
      </div>

      <div className="relative">
        <div className="overflow-hidden h-2 mb-4 text-xs flex rounded bg-gray-200">
          {getStatusSteps().map(step => (
            <div
              key={step.id}
              className={`shadow-none flex flex-col text-center whitespace-nowrap justify-center ${
                step.completed ? 'bg-primary-500' : 'bg-gray-300'
              }`}
              style={{ width: `${100 / getStatusSteps().length}%` }}
            />
          ))}
        </div>
        <div className="flex justify-between">
          {getStatusSteps().map((step) => (
            <div
              key={step.id}
              className={`text-xs ${step.completed ? 'text-primary-600' : 'text-gray-500'}`}
            >
              {step.label}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
} 