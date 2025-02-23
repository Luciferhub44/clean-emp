import { render, screen } from '@testing-library/react';
import POCommissionChart from '../POCommissionChart';
import { CommissionRecord } from '@/types';

describe('POCommissionChart', () => {
  const mockCommissions: CommissionRecord[] = [
    {
      id: 1,
      employee_id: 1,
      task_id: 1,
      payroll_id: 1,
      amount: 500,
      commission_type: 'po_completion',
      created_at: new Date().toISOString(),
    },
    {
      id: 2,
      employee_id: 1,
      task_id: 2,
      payroll_id: 1,
      amount: 750,
      commission_type: 'po_completion',
      created_at: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(), // 1 month ago
    },
  ];

  it('renders commission data correctly', () => {
    render(<POCommissionChart commissions={mockCommissions} />);

    // Check if amounts are displayed
    expect(screen.getByText('$500.00')).toBeInTheDocument();
    expect(screen.getByText('$750.00')).toBeInTheDocument();

    // Check if PO counts are displayed
    expect(screen.getByText('1 POs')).toBeInTheDocument();
  });

  it('handles empty commission data', () => {
    render(<POCommissionChart commissions={[]} />);

    // Should render empty chart with 6 months
    const months = screen.getAllByText(/[A-Za-z]{3} '\d{2}/); // Matches format like "Jan '24"
    expect(months).toHaveLength(6);
  });
}); 