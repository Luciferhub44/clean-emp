import { PurchaseOrder } from '@/types';

interface PurchaseOrderPreviewProps {
  purchaseOrder: PurchaseOrder;
  onAccept?: () => Promise<void>;
  onReject?: () => Promise<void>;
  showActions?: boolean;
}

export default function PurchaseOrderPreview({ 
  purchaseOrder, 
  onAccept, 
  onReject, 
  showActions = false 
}: PurchaseOrderPreviewProps) {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  return (
    <div className="bg-white rounded-lg shadow-sm p-6 space-y-6">
      <div className="flex justify-between items-start">
        <div>
          <h3 className="text-lg font-medium">PO #{purchaseOrder.order_number}</h3>
          <p className="text-gray-600">Vendor: {purchaseOrder.vendor}</p>
        </div>
        <div className="text-right">
          <p className="text-sm text-gray-600">
            Created: {new Date(purchaseOrder.created_at).toLocaleDateString()}
          </p>
          <span className={`inline-block px-2 py-1 rounded-full text-sm ${
            purchaseOrder.status === 'approved' ? 'bg-green-100 text-green-800' :
            purchaseOrder.status === 'rejected' ? 'bg-red-100 text-red-800' :
            'bg-yellow-100 text-yellow-800'
          }`}>
            {purchaseOrder.status.charAt(0).toUpperCase() + purchaseOrder.status.slice(1)}
          </span>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Description
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Quantity
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Unit Price
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Total
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {purchaseOrder.items.map((item, index) => (
              <tr key={index}>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {item.description}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 text-right">
                  {item.quantity}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 text-right">
                  {formatCurrency(item.unit_price)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 text-right">
                  {formatCurrency(item.total_price)}
                </td>
              </tr>
            ))}
            <tr className="bg-gray-50">
              <td colSpan={3} className="px-6 py-4 text-sm font-medium text-gray-900 text-right">
                Total Amount:
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 text-right">
                {formatCurrency(purchaseOrder.total_amount)}
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      {purchaseOrder.notes && (
        <div className="mt-4">
          <h4 className="text-sm font-medium text-gray-700">Notes:</h4>
          <p className="mt-1 text-sm text-gray-600">{purchaseOrder.notes}</p>
        </div>
      )}

      {showActions && onAccept && onReject && (
        <div className="flex justify-end space-x-4 mt-6">
          <button
            onClick={onReject}
            className="px-4 py-2 border border-red-300 text-red-700 rounded-md hover:bg-red-50"
          >
            Reject
          </button>
          <button
            onClick={onAccept}
            className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
          >
            Accept
          </button>
        </div>
      )}
    </div>
  );
} 