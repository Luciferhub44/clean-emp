import { usePayroll } from '@/contexts/PayrollContext';
import LoadingSpinner from './LoadingSpinner';
import { formatCurrency } from '@/utils/payrollUtils';
import POCommissionChart from './POCommissionChart';

export default function EmployeePayrollDashboard() {
  const { payrolls, commissions, stats, poCommissions, loading, error } = usePayroll();

  if (loading) return <LoadingSpinner />;
  if (error) return <div className="text-red-600 text-center py-4">{error}</div>;

  return (
    <div className="space-y-8">
      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h3 className="text-lg font-medium text-gray-900">Total Earnings</h3>
          <p className="mt-2 text-3xl font-semibold text-primary-600">
            {formatCurrency(stats?.totalCommission || 0)}
          </p>
          <p className="mt-1 text-sm text-gray-500">Including base salary and commissions</p>
        </div>
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h3 className="text-lg font-medium text-gray-900">PO Commissions</h3>
          <p className="mt-2 text-3xl font-semibold text-green-600">
            {formatCurrency(poCommissions.reduce((sum, po) => sum + po.amount, 0))}
          </p>
          <p className="mt-1 text-sm text-gray-500">From {poCommissions.length} purchase orders</p>
        </div>
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h3 className="text-lg font-medium text-gray-900">Task Commissions</h3>
          <p className="mt-2 text-3xl font-semibold text-blue-600">
            {formatCurrency(
              commissions
                .filter(c => c.commission_type === 'task_completion')
                .reduce((sum, c) => sum + c.amount, 0)
            )}
          </p>
          <p className="mt-1 text-sm text-gray-500">
            From {commissions.filter(c => c.commission_type === 'task_completion').length} tasks
          </p>
        </div>
      </div>

      {/* PO Commission Chart */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h2 className="text-xl font-semibold mb-6">Commission Trends</h2>
        <POCommissionChart commissions={poCommissions} />
      </div>

      {/* Recent Payroll History */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h2 className="text-xl font-semibold mb-6">Recent Payroll History</h2>
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
              {payrolls.map((payroll) => (
                <tr key={payroll.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {new Date(payroll.period_start).toLocaleDateString()} -{' '}
                    {new Date(payroll.period_end).toLocaleDateString()}
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
                      payroll.status === 'paid'
                        ? 'bg-green-100 text-green-800'
                        : payroll.status === 'processed'
                        ? 'bg-blue-100 text-blue-800'
                        : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {payroll.status.charAt(0).toUpperCase() + payroll.status.slice(1)}
                    </span>
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