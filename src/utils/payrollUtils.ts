import { Task, PurchaseOrder, PayrollSettings } from '@/types';

export const calculateCommission = (
  task: Task,
  settings: PayrollSettings
): number => {
  let commission = 0;

  if (task.status === 'completed') {
    // Base commission for completing a task
    commission += (settings.commission_rate / 100) * settings.base_salary;

    // Additional commission for PO tasks
    if (task.purchase_order) {
      commission += (settings.po_commission_rate / 100) * task.purchase_order.total_amount;
    }
  }

  return commission;
};

export const calculatePayrollPeriod = (payPeriod: string): {
  start: Date;
  end: Date;
} => {
  const now = new Date();
  const start = new Date(now.getFullYear(), now.getMonth(), 1);
  let end: Date;

  switch (payPeriod) {
    case '1 week':
      end = new Date(start);
      end.setDate(start.getDate() + 7);
      break;
    case '2 weeks':
      end = new Date(start);
      end.setDate(start.getDate() + 14);
      break;
    default: // '1 month'
      end = new Date(start);
      end.setMonth(start.getMonth() + 1);
      end.setDate(0); // Last day of the month
      break;
  }

  return { start, end };
};

export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(amount);
}; 