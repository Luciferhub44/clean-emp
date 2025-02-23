import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { PayrollProvider } from '@/contexts/PayrollContext';
import PayrollAdmin from '../PayrollAdmin';
import ApiService from '@/services/api';

jest.mock('@/services/api');

describe('PayrollAdmin', () => {
  const mockPayrollData = {
    settings: {
      id: 1,
      base_salary: 5000,
      commission_rate: 2,
      po_commission_rate: 1,
      pay_period: '1 month',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
    payrolls: [
      {
        id: 1,
        employee_id: 1,
        period_start: '2024-01-01',
        period_end: '2024-01-31',
        base_salary: 5000,
        commission_amount: 200,
        total_amount: 5200,
        status: 'pending',
        payment_date: null,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      },
    ],
  };

  beforeEach(() => {
    jest.clearAllMocks();
    (ApiService.get as jest.Mock).mockImplementation((url) => {
      if (url === '/payroll/settings') {
        return Promise.resolve({ data: mockPayrollData.settings });
      }
      if (url === '/employee/payroll') {
        return Promise.resolve({ data: mockPayrollData.payrolls });
      }
      return Promise.resolve({ data: [] });
    });
  });

  it('renders payroll settings and records', async () => {
    render(
      <PayrollProvider>
        <PayrollAdmin />
      </PayrollProvider>
    );

    await waitFor(() => {
      expect(screen.getByText('Payroll Settings')).toBeInTheDocument();
      expect(screen.getByText('Base Salary:')).toBeInTheDocument();
      expect(screen.getByText('$5,000.00')).toBeInTheDocument();
    });
  });

  it('handles processing payroll', async () => {
    (ApiService.post as jest.Mock).mockResolvedValueOnce({
      data: { ...mockPayrollData.payrolls[0], status: 'processed' },
    });

    render(
      <PayrollProvider>
        <PayrollAdmin />
      </PayrollProvider>
    );

    await waitFor(() => {
      expect(screen.getByText('Process')).toBeInTheDocument();
    });

    fireEvent.click(screen.getByText('Process'));

    await waitFor(() => {
      expect(ApiService.post).toHaveBeenCalledWith('/admin/payroll/1/process', {
        status: 'processed',
      });
    });
  });
}); 