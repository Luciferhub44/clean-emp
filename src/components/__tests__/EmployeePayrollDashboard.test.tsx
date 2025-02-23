import { render, screen, waitFor } from '@testing-library/react';
import { PayrollProvider } from '@/contexts/PayrollContext';
import EmployeePayrollDashboard from '../EmployeePayrollDashboard';
import ApiService from '@/services/api';

jest.mock('@/services/api');

describe('EmployeePayrollDashboard', () => {
  const mockPayrollData = {
    stats: {
      totalCommission: 5000,
      completedTasks: 10,
      pendingPayments: 1000,
    },
    payrolls: [
      {
        id: 1,
        employee_id: 1,
        period_start: '2024-01-01',
        period_end: '2024-01-31',
        base_salary: 5000,
        commission_amount: 1000,
        total_amount: 6000,
        status: 'paid',
        payment_date: '2024-02-01',
        created_at: '2024-01-01',
        updated_at: '2024-02-01',
      },
    ],
    commissions: [
      {
        id: 1,
        employee_id: 1,
        task_id: 1,
        payroll_id: 1,
        amount: 500,
        commission_type: 'po_completion',
        created_at: '2024-01-15',
      },
    ],
  };

  beforeEach(() => {
    jest.clearAllMocks();
    (ApiService.get as jest.Mock).mockImplementation((url) => {
      switch (url) {
        case '/employee/payroll/stats':
          return Promise.resolve({ data: mockPayrollData.stats });
        case '/employee/payroll':
          return Promise.resolve({ data: mockPayrollData.payrolls });
        case '/employee/commissions':
          return Promise.resolve({ data: mockPayrollData.commissions });
        default:
          return Promise.resolve({ data: [] });
      }
    });
  });

  it('renders employee payroll dashboard', async () => {
    render(
      <PayrollProvider>
        <EmployeePayrollDashboard />
      </PayrollProvider>
    );

    await waitFor(() => {
      expect(screen.getByText('Total Earnings')).toBeInTheDocument();
      expect(screen.getByText('$5,000.00')).toBeInTheDocument();
      expect(screen.getByText('Commission Trends')).toBeInTheDocument();
      expect(screen.getByText('Recent Payroll History')).toBeInTheDocument();
    });
  });

  it('displays loading state', () => {
    render(
      <PayrollProvider>
        <EmployeePayrollDashboard />
      </PayrollProvider>
    );

    expect(screen.getByRole('status')).toBeInTheDocument();
  });

  it('handles error state', async () => {
    const errorMessage = 'Failed to fetch payroll data';
    (ApiService.get as jest.Mock).mockRejectedValue(new Error(errorMessage));

    render(
      <PayrollProvider>
        <EmployeePayrollDashboard />
      </PayrollProvider>
    );

    await waitFor(() => {
      expect(screen.getByText(errorMessage)).toBeInTheDocument();
    });
  });
}); 