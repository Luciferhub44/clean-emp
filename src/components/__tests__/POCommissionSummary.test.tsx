import { render, screen, waitFor } from '@testing-library/react';
import { PayrollProvider } from '@/contexts/PayrollContext';
import POCommissionSummary from '../POCommissionSummary';
import ApiService from '@/services/api';

jest.mock('@/services/api');

describe('POCommissionSummary', () => {
  const mockSummaryData = {
    total_po_amount: 50000,
    total_po_commission: 2500,
    completed_pos: 10,
    average_commission: 250,
  };

  beforeEach(() => {
    jest.clearAllMocks();
    (ApiService.get as jest.Mock).mockResolvedValue({
      data: mockSummaryData,
    });
  });

  it('renders PO commission summary data', async () => {
    render(
      <PayrollProvider>
        <POCommissionSummary />
      </PayrollProvider>
    );

    await waitFor(() => {
      expect(screen.getByText('Purchase Order Commissions')).toBeInTheDocument();
      expect(screen.getByText('$50,000.00')).toBeInTheDocument();
      expect(screen.getByText('$2,500.00')).toBeInTheDocument();
      expect(screen.getByText('10')).toBeInTheDocument();
      expect(screen.getByText('$250.00')).toBeInTheDocument();
    });
  });

  it('handles API errors gracefully', async () => {
    const errorMessage = 'Failed to fetch PO summary';
    (ApiService.get as jest.Mock).mockRejectedValue(new Error(errorMessage));

    render(
      <PayrollProvider>
        <POCommissionSummary />
      </PayrollProvider>
    );

    await waitFor(() => {
      expect(screen.getByText(errorMessage)).toBeInTheDocument();
    });
  });
}); 