import { useState, useEffect } from 'react';
import { usePayroll } from '@/contexts/PayrollContext';
import { formatCurrency } from '@/utils/payrollUtils';
import ApiService from '@/services/api';

interface POCommissionSummary {
  total_po_amount: number;
  total_po_commission: number;
  completed_pos: number;
  average_commission: number;
}

export default function POCommissionSummary() {
  const { commissions } = usePayroll();
  const [summary, setSummary] = useState<POCommissionSummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPOSummary = async () => {
      try {
        const response = await ApiService.get<POCommissionSummary>('/employee/commissions/po-summary');
        setSummary(response.data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch PO summary');
      } finally {
        setLoading(false);
      }
    };

    fetchPOSummary();
  }, [commissions]);

  if (loading) return <div className="animate-pulse bg-gray-100 h-32 rounded-lg"></div>;
  if (error) return <div className="text-red-600 text-sm">{error}</div>;
  if (!summary) return null;

  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <h2 className="text-xl font-semibold mb-6">Purchase Order Commissions</h2>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div>
          <h3 className="text-sm font-medium text-gray-500">Total PO Value</h3>
          <p className="mt-1 text-2xl font-semibold text-gray-900">
            {formatCurrency(summary.total_po_amount)}
          </p>
        </div>
        <div>
          <h3 className="text-sm font-medium text-gray-500">Total Commission</h3>
          <p className="mt-1 text-2xl font-semibold text-primary-600">
            {formatCurrency(summary.total_po_commission)}
          </p>
        </div>
        <div>
          <h3 className="text-sm font-medium text-gray-500">Completed POs</h3>
          <p className="mt-1 text-2xl font-semibold text-green-600">
            {summary.completed_pos}
          </p>
        </div>
        <div>
          <h3 className="text-sm font-medium text-gray-500">Average Commission</h3>
          <p className="mt-1 text-2xl font-semibold text-blue-600">
            {formatCurrency(summary.average_commission)}
          </p>
        </div>
      </div>
    </div>
  );
} 