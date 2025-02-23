import { calculateCommission, calculatePayrollPeriod, formatCurrency } from '../payrollUtils';
import { Task, PayrollSettings } from '@/types';

describe('payrollUtils', () => {
  describe('calculateCommission', () => {
    const mockSettings: PayrollSettings = {
      id: 1,
      base_salary: 5000,
      commission_rate: 2, // 2%
      po_commission_rate: 1, // 1%
      pay_period: '1 month',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    it('should calculate basic commission for completed task', () => {
      const task: Task = {
        id: 1,
        title: 'Test Task',
        description: 'Test Description',
        status: 'completed',
        priority: 'medium',
        due_date: new Date().toISOString(),
        assigned_to: 1,
        assigned_by: 1,
      };

      const commission = calculateCommission(task, mockSettings);
      expect(commission).toBe(100); // 2% of 5000
    });

    it('should calculate commission with PO bonus', () => {
      const task: Task = {
        id: 1,
        title: 'Test Task',
        description: 'Test Description',
        status: 'completed',
        priority: 'medium',
        due_date: new Date().toISOString(),
        assigned_to: 1,
        assigned_by: 1,
        purchase_order: {
          id: 1,
          order_number: 'PO-001',
          vendor: 'Test Vendor',
          total_amount: 10000,
          status: 'approved',
          items: [],
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        },
      };

      const commission = calculateCommission(task, mockSettings);
      expect(commission).toBe(200); // 2% of 5000 + 1% of 10000
    });

    it('should return 0 commission for non-completed task', () => {
      const task: Task = {
        id: 1,
        title: 'Test Task',
        description: 'Test Description',
        status: 'pending',
        priority: 'medium',
        due_date: new Date().toISOString(),
        assigned_to: 1,
        assigned_by: 1,
      };

      const commission = calculateCommission(task, mockSettings);
      expect(commission).toBe(0);
    });
  });

  describe('calculatePayrollPeriod', () => {
    beforeEach(() => {
      // Mock the current date to ensure consistent test results
      jest.useFakeTimers();
      jest.setSystemTime(new Date('2024-01-15'));
    });

    afterEach(() => {
      jest.useRealTimers();
    });

    it('should calculate weekly period', () => {
      const { start, end } = calculatePayrollPeriod('1 week');
      expect(start.toISOString().split('T')[0]).toBe('2024-01-01');
      expect(end.toISOString().split('T')[0]).toBe('2024-01-08');
    });

    it('should calculate bi-weekly period', () => {
      const { start, end } = calculatePayrollPeriod('2 weeks');
      expect(start.toISOString().split('T')[0]).toBe('2024-01-01');
      expect(end.toISOString().split('T')[0]).toBe('2024-01-15');
    });

    it('should calculate monthly period', () => {
      const { start, end } = calculatePayrollPeriod('1 month');
      expect(start.toISOString().split('T')[0]).toBe('2024-01-01');
      expect(end.toISOString().split('T')[0]).toBe('2024-01-31');
    });
  });

  describe('formatCurrency', () => {
    it('should format currency correctly', () => {
      expect(formatCurrency(1234.56)).toBe('$1,234.56');
      expect(formatCurrency(1000000)).toBe('$1,000,000.00');
      expect(formatCurrency(0)).toBe('$0.00');
      expect(formatCurrency(-1234.56)).toBe('-$1,234.56');
    });
  });
}); 