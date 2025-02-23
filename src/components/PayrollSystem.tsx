import { useState, useEffect } from 'react';
import ApiService from '@/services/api';
import LoadingSpinner from '@/components/LoadingSpinner';

interface PayrollSettings {
  base_salary: number;
  commission_rate: number;
  po_commission_rate: number;
  pay_period: string;
}

interface PayrollRecord {
  id: number;
  period_start: string;
  period_end: string;
  base_salary: number;
  commission_amount: number;
  total_amount: number;
  status: 'pending' | 'processed' | 'paid';
  payment_date: string | null;
}

interface CommissionRecord {
  id: number;
  task_id: number;
  amount: number;
  commission_type: 'task_completion' | 'po_completion';
  created_at: string;
}

export default function PayrollSystem() {
  const [settings, setSettings] = useState<PayrollSettings | null>(null);
  const [payrollRecords, setPayrollRecords] = useState<PayrollRecord[]>([]);
  const [commissionRecords, setCommissionRecords] = useState<CommissionRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchPayrollData();
  }, []);

  const fetchPayrollData = async () => {
    try {
      const [settingsRes, payrollRes, commissionRes] = await Promise.all([
        ApiService.get<PayrollSettings>('/payroll/settings'),
        ApiService.get<PayrollRecord[]>('/payroll/records'),
        ApiService.get<CommissionRecord[]>('/payroll/commissions'),
      ]);

      setSettings(settingsRes.data);
      setPayrollRecords(payrollRes.data);
      setCommissionRecords(commissionRes.data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch payroll data');
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  if (loading) return <LoadingSpinner />;
  if (error) return <div className="text-red-600 text-center py-4">{error}</div>;
  if (!settings) return <div>No payroll settings found.</div>;

  return (
    <div className="space-y-8">
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h2 className="text-xl font-semibold mb-4">Payroll Settings</h2>
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <span className="font-medium">Base Salary:</span>{' '}
            {formatCurrency(settings.base_salary)}
          </div>
          <div>
            <span className="font-medium">Task Commission Rate:</span>{' '}
            {settings.commission_rate}%
          </div>
          <div>
            <span className="font-medium">PO Commission Rate:</span>{' '}
            {settings.po_commission_rate}%
          </div>
          <div>
            <span className="font-medium">Pay Period:</span>{' '}
            {settings.pay_period}
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm p-6">
        <h2 className="text-xl font-semibold mb-4">Recent Payroll Records</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Period
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Base Salary
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Commission
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Total
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {payrollRecords.map((record) => (
                <tr key={record.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {new Date(record.period_start).toLocaleDateString()} - {new Date(record.period_end).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 text-right">
                    {formatCurrency(record.base_salary)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 text-right">
                    {formatCurrency(record.commission_amount)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 text-right">
                    {formatCurrency(record.total_amount)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 rounded-full text-xs ${
                      record.status === 'paid' ? 'bg-green-100 text-green-800' :
                      record.status === 'processed' ? 'bg-blue-100 text-blue-800' :
                      'bg-yellow-100 text-yellow-800'
                    }`}>
                      {record.status.charAt(0).toUpperCase() + record.status.slice(1)}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm p-6">
        <h2 className="text-xl font-semibold mb-4">Commission History</h2>
        <div className="space-y-4">
          {commissionRecords.map((record) => (
            <div key={record.id} className="flex justify-between items-center p-4 bg-gray-50 rounded-lg">
              <div>
                <span className={`px-2 py-1 rounded-full text-xs ${
                  record.commission_type === 'po_completion' ? 'bg-purple-100 text-purple-800' : 'bg-blue-100 text-blue-800'
                }`}>
                  {record.commission_type === 'po_completion' ? 'PO Commission' : 'Task Commission'}
                </span>
                <p className="text-sm text-gray-600 mt-1">
                  {new Date(record.created_at).toLocaleDateString()}
                </p>
              </div>
              <div className="text-right">
                <p className="text-lg font-medium text-gray-900">
                  {formatCurrency(record.amount)}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
} 