import { render, screen, waitFor } from '@testing-library/react';
import { PayrollProvider, usePayroll } from '../PayrollContext';
import ApiService from '@/services/api';

// Mock the API service
jest.mock('@/services/api');

describe('PayrollContext', () => {
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
    payrolls: [],
    commissions: [],
    stats: {
      totalCommission: 1000,
      completedTasks: 5,
      pendingPayments: 500,
    },
  };

  beforeEach(() => {
    // Reset all mocks before each test
    jest.clearAllMocks();
  });

  it('should fetch payroll data on mount', async () => {
    // Mock API responses
    (ApiService.get as jest.Mock).mockImplementation((url) => {
      switch (url) {
        case '/payroll/settings':
          return Promise.resolve({ data: mockPayrollData.settings });
        case '/employee/payroll':
          return Promise.resolve({ data: mockPayrollData.payrolls });
        case '/employee/commissions':
          return Promise.resolve({ data: mockPayrollData.commissions });
        case '/employee/payroll/stats':
          return Promise.resolve({ data: mockPayrollData.stats });
        default:
          return Promise.reject(new Error('Not found'));
      }
    });

    // Create a test component that uses the context
    function TestComponent() {
      const { settings, loading, error } = usePayroll();
      if (loading) return <div>Loading...</div>;
      if (error) return <div>Error: {error}</div>;
      return <div>Base Salary: {settings?.base_salary}</div>;
    }

    render(
      <PayrollProvider>
        <TestComponent />
      </PayrollProvider>
    );

    // Initially should show loading
    expect(screen.getByText('Loading...')).toBeInTheDocument();

    // Wait for data to load
    await waitFor(() => {
      expect(screen.getByText('Base Salary: 5000')).toBeInTheDocument();
    });

    // Verify API calls
    expect(ApiService.get).toHaveBeenCalledWith('/payroll/settings');
    expect(ApiService.get).toHaveBeenCalledWith('/employee/payroll');
    expect(ApiService.get).toHaveBeenCalledWith('/employee/commissions');
    expect(ApiService.get).toHaveBeenCalledWith('/employee/payroll/stats');
  });

  it('should handle API errors', async () => {
    // Mock API error
    (ApiService.get as jest.Mock).mockRejectedValue(new Error('API Error'));

    function TestComponent() {
      const { loading, error } = usePayroll();
      if (loading) return <div>Loading...</div>;
      if (error) return <div>Error: {error}</div>;
      return null;
    }

    render(
      <PayrollProvider>
        <TestComponent />
      </PayrollProvider>
    );

    await waitFor(() => {
      expect(screen.getByText('Error: API Error')).toBeInTheDocument();
    });
  });
}); 