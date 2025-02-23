import { useState, useEffect } from 'react';
import { PayrollSettings, EmployeePayroll } from '@/types';
import ApiService from '@/services/api';
import { EmailService } from '@/services/emailService';
import PayrollSettingsForm from './PayrollSettingsForm';
import LoadingSpinner from './LoadingSpinner';

interface EmployeeData {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
}

export default function PayrollAdmin() {
  const [settings, setSettings] = useState<PayrollSettings | null>(null);
  const [payrolls, setPayrolls] = useState<EmployeePayroll[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showSettingsForm, setShowSettingsForm] = useState(false);

  useEffect(() => {
    fetchPayrollData();
  }, []);

  const fetchPayrollData = async () => {
    try {
      const [settingsRes, payrollsRes] = await Promise.all([
        ApiService.get<PayrollSettings>('/admin/payroll/settings'),
        ApiService.get<EmployeePayroll[]>('/admin/payroll/records'),
      ]);
      setSettings(settingsRes.data);
      setPayrolls(payrollsRes.data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch payroll data');
    } finally {
      setLoading(false);
    }
  };

  const handleProcessPayroll = async (payrollId: number) => {
    try {
      const response = await ApiService.post<EmployeePayroll>(`/admin/payroll/${payrollId}/process`, {
        status: 'processed'
      });
      
      // Send email notification
      const payroll = response.data;
      const employeeResponse = await ApiService.get<EmployeeData>(`/users/${payroll.employee_id}`);
      const employee = employeeResponse.data;
      
      await EmailService.sendPayrollNotification({
        employeeId: payroll.employee_id,
        employeeName: `${employee.first_name} ${employee.last_name}`,
        periodStart: payroll.period_start,
        periodEnd: payroll.period_end,
        baseSalary: payroll.base_salary,
        commissionAmount: payroll.commission_amount,
        totalAmount: payroll.total_amount,
      });

      // Update local state
      setPayrolls(payrolls.map(p => p.id === payrollId ? response.data : p));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to process payroll');
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

  return (
    <div className="space-y-8">
      {/* Settings Section */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold">Payroll Settings</h2>
          <button
            onClick={() => setShowSettingsForm(true)}
            className="px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700"
          >
            Edit Settings
          </button>
        </div>

        {showSettingsForm ? (
          <PayrollSettingsForm
            initialData={settings || undefined}
            onSubmit={() => {
              fetchPayrollData();
              setShowSettingsForm(false);
            }}
            onCancel={() => setShowSettingsForm(false)}
          />
        ) : settings && (
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
        )}
      </div>

      {/* Payroll Records Section */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h2 className="text-xl font-semibold mb-6">Payroll Records</h2>
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
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {payrolls.map((payroll) => (
                <tr key={payroll.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {new Date(payroll.period_start).toLocaleDateString()} - {new Date(payroll.period_end).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 text-right">
                    {formatCurrency(payroll.base_salary)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 text-right">
                    {formatCurrency(payroll.commission_amount)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 text-right">
                    {formatCurrency(payroll.total_amount)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 rounded-full text-xs ${
                      payroll.status === 'paid' ? 'bg-green-100 text-green-800' :
                      payroll.status === 'processed' ? 'bg-blue-100 text-blue-800' :
                      'bg-yellow-100 text-yellow-800'
                    }`}>
                      {payroll.status.charAt(0).toUpperCase() + payroll.status.slice(1)}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm">
                    {payroll.status === 'pending' && (
                      <button
                        onClick={() => handleProcessPayroll(payroll.id)}
                        className="text-primary-600 hover:text-primary-900"
                      >
                        Process
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
} 