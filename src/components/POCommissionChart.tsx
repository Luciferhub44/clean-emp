import { useMemo } from 'react';
import { CommissionRecord } from '@/types';
import { formatCurrency } from '@/utils/payrollUtils';

interface POCommissionChartProps {
  commissions: CommissionRecord[];
}

export default function POCommissionChart({ commissions }: POCommissionChartProps) {
  const chartData = useMemo(() => {
    const last6Months = new Array(6).fill(0).map((_, i) => {
      const date = new Date();
      date.setMonth(date.getMonth() - i);
      return date.toISOString().slice(0, 7); // YYYY-MM format
    }).reverse();

    const monthlyTotals = last6Months.map(month => {
      const monthCommissions = commissions.filter(c => 
        c.created_at.startsWith(month)
      );
      return {
        month,
        total: monthCommissions.reduce((sum, c) => sum + c.amount, 0),
        count: monthCommissions.length,
      };
    });

    const maxTotal = Math.max(...monthlyTotals.map(m => m.total));

    return monthlyTotals.map(data => ({
      ...data,
      height: data.total > 0 ? (data.total / maxTotal) * 100 : 0,
    }));
  }, [commissions]);

  return (
    <div className="h-64">
      <div className="flex h-full items-end space-x-2">
        {chartData.map((data) => (
          <div
            key={data.month}
            className="flex-1 flex flex-col items-center"
          >
            <div className="relative flex-1 w-full">
              <div
                className="absolute bottom-0 w-full bg-primary-200 rounded-t"
                style={{ height: `${data.height}%` }}
              >
                <div className="absolute -top-6 left-1/2 transform -translate-x-1/2 text-xs font-medium">
                  {formatCurrency(data.total)}
                </div>
              </div>
            </div>
            <div className="mt-2 text-xs text-gray-600">
              {new Date(data.month).toLocaleDateString(undefined, { month: 'short', year: '2-digit' })}
            </div>
            <div className="text-xs text-gray-500">
              {data.count} POs
            </div>
          </div>
        ))}
      </div>
    </div>
  );
} 